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
import LongStringIcon from 'material-ui/svg-icons/editor/insert-comment';
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


const pattern = /^\s*`(.*?)`\s*$/g;
const clearMuliLineStringWrapper = (str) => {
  if (pattern.test(str)) {
    return pattern.exec(str)[0];
  } else {
    return str;
  }
}

class MyDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.initCode,
      language: this.props.language,
      evalAsFunction: !pattern.test(this.props.initCode)
    }

    this.onUpdate = (newCode) => {
      this.setState({
        code: newCode
      });
    }

    this.setLanguage = (language) => {
      this.setState({
        language: language
      })
    }

    this.handleEvalAsFunction = () => {
      this.setState({
        evalAsFunction: !this.state.evalAsFunction
      })
    }

    this.onCommit = () => {
      let code = this.state.code;
      this.props.submitCallback(code);
      this.props.handleClose();
    }
  }

  render() {
    const { title, handleClose, open, } = this.props;
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

    return (
      <Dialog
          contentStyle={{minHeight: 500}}
          titleStyle={{padding: 0}}
          title={renderDialogTitle(
            <Subheader style={{fontSize: 18, maxHeight: 48}}>
            {title}
            </Subheader>, 
            handleClose, 
            null)}
          actions={actions}
          modal={true}
          open={open}
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
                  <EditCodeIcon color={colors.secondaryDeep} /> :
                  <LongStringIcon color={colors.secondaryDeep}/>
                }
                style={{color:colors.primaryDeep, textDecoration: 'underline'}}
                onClick={this.handleEvalAsFunction}
              /> :
              null
            }
          </div>
          <CodeMirror 
            value={this.state.code} 
            onChange={this.onUpdate} 
            options={{
              lineNumbers: true,
              mode: this.state.language
            }}
          />
    </Dialog>
    )
  }
}

export default class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }

    this.handleOpen = () => {
      this.setState({
        open: true
      });
    }

    this.handleClose = () => {
      this.setState({
        open: false,
      });
    }
  }

  static defaultProps = { 
  	initCode: "",
    language: CodeLanguage.javascript[0],
    tooltip: "Insert code",
    title: "Code Editor",
    submitCallback: function(newCode) { return; },
    showEditMode: false,
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
  	const { buttonIcon, title, submitCallback, Trigger } = this.props;

    // add this.state.open ? tag : null to trigger reset (because we don't have control to CodeMirror)
  	return (
  		<div>
        <Trigger onClick={this.handleOpen} tooltip={this.props.tooltip}/>
        {this.state.open ?
  	  		<MyDialog
            open={this.state.open}
            handleClose={this.handleClose}
            {...this.props}
          /> :
          null
        }
	    </div>
  	)
  }
}
