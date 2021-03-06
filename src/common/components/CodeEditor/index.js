import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/htmlmixed/htmlmixed');

import EditCodeIcon from 'material-ui/svg-icons/action/code';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';
import UnCheckBoxIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import {
  grey800 as normalColor,
  yellow500 as checkColor,
} from 'material-ui/styles/colors';
import { renderDialogTitle } from '../gadgets';
import GeneralTheme from '../theme.js';

const colors = {
  ...GeneralTheme.colors,
}

const hoverColor = GeneralTheme.colors.secondary;

const style = {
  Trigger: {
    labelColor: 'white',
    backgroundColor: colors.primary,
    labelStyle: {
      fontSize: '13px'
    }
  },
  DefaultTrigger: {
    hoverColor: colors.secondary
  },
  actionButtons: {
    Submit: {
      labelStyle: {
        textTransform: "none",
        color: colors.primaryDeep
      }
    },
  },
  SelectFieldStyle: {
    selectedMenuItemStyle: {
      color: colors.secondary
    },
    style: {
      width: 180,
    }
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
}

export const CodeLanguage = {
  // text: [null, 'Plain Text'],
  javascript: ['javascript', 'Javascript'],
  html: ['htmlmixed', 'HTML/Plain Text']
}

export default class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }

    this.handleOpen = () => {
      this.setState({
        open: true,
        // init values
        code: utils.toEmptyString(this.props.value),
        language: this.props.language || CodeLanguage.javascript[0],
        evalAsFunction: !!this.props.ifEval
      });
    }

    this.handleClose = () => {
      this.setState({
        open: false,
      });
    }

    this.onUpdate = (newCode) => {
      this.setState({
        code: newCode
      });
    }

    this.setLanguage = (language) => {
      this.setState({
        language: language,
        evalAsFunction: language === CodeLanguage.javascript[0]
      })
    }

    this.handleEvalAsFunction = () => {
      this.setState({
        evalAsFunction: !this.state.evalAsFunction
      })
    }

    this.onCommit = () => {
      this.props.onCommit(utils.toNull(this.state.code), this.state.evalAsFunction, this.state.language);
      this.handleClose();
    }
  }

  static defaultProps = { 
  	value: "",
    language: CodeLanguage.javascript[0],
    tooltip: "Insert code",
    title: "Code Editor",
    onCommit: function(newCode) { return; },
    Trigger: ({onClick, tooltip}) => (
      <IconButton
        onClick={onClick}
        tooltip={tooltip}
      >
        <EditCodeIcon {...style.DefaultTrigger}/>
      </IconButton>
    ),
  };

  
  render() {
  	const { buttonIcon, title, onCommit, Trigger } = this.props;

    const actions = [
      <FlatButton
        label="Save"
        onClick={this.onCommit}
        {...style.actionButtons.Submit}
      />,
    ];

    const items = Object.values(CodeLanguage).map((mode, i) => (
      <MenuItem key={`code-mode-${i}`} primaryText={mode[1]} value={mode[0]} />
    ))

    let disabled = this.props.onlyString || this.props.onlyFunction;

    // add this.state.open ? tag : null to trigger reset (because we don't have control to CodeMirror)
  	return (
  		<div>
        <Trigger onClick={this.handleOpen} tooltip={this.props.tooltip}/>
        <Dialog
          contentStyle={{minHeight: 500}}
          titleStyle={{padding: 0}}
          title={renderDialogTitle(
            <Subheader style={{fontSize: 18, maxHeight: 48}}>
            {title}
            </Subheader>, 
            this.handleClose, 
            null)}
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <div style={{...style.toolbar}}>
            <SelectField
                disabled={disabled}
                onChange={(event, index, value) => { this.setLanguage(value)}}
                {...style.SelectFieldStyle}
                floatingLabelFixed
                floatingLabelText="Language"
                value={this.state.language}
            >
                {items}
            </SelectField>
            {!disabled ? 
              <MenuItem
                primaryText={this.state.evalAsFunction ? 'Evaluate' : 'Do Not Evaluate'}
                rightIcon={
                  this.state.evalAsFunction ?
                  <CheckBoxIcon color={colors.secondaryDeep} /> :
                  <UnCheckBoxIcon color={colors.secondaryDeep}/>
                }
                style={{color:colors.primaryDeep, textDecoration: 'underline'}}
                onClick={this.handleEvalAsFunction}
              /> :
              null
            }
          </div>
          <CodeMirror 
            autoFocus
            value={this.state.code} 
            onChange={this.onUpdate} 
            options={{
              lineNumbers: true,
              mode: this.state.language
            }}
          />
      </Dialog>
	    </div>
  	)
  }
}
