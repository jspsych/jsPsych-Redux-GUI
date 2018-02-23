import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';

import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');

import EditCodeIcon from 'material-ui/svg-icons/action/code';
// import DialogIcon from 'material-ui/svg-icons/content/create';
import {
  grey800 as normalColor,
  yellow500 as checkColor,
  // blue500 as titleIconColor,
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
  }
}

export default class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      code: ""
    }


    this.handleOpen = () => {
      this.setState({
        open: true,
        code: this.props.initCode
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
  }

  static defaultProps = { 
  	initCode: "",
    tooltip: "Insert code",
    title: "Code Editor",
    submitCallback: function(newCode) { return; },
    showEditMode: false,
    Trigger: ({onClick}) => (
      <IconButton
        onClick={onClick}
        title="Click to edit"
      >
        <EditCodeIcon {...style.DefaultTrigger}/>
      </IconButton>
    )
  };

  
  render() {
  	const { buttonIcon, title, submitCallback, Trigger } = this.props;
  	const actions = [
      <FlatButton
        label="Save"
        onClick={() => { this.handleClose(); submitCallback(this.state.code); }}
        {...style.actionButtons.Submit}
        keyboardFocused
      />,
    ];

  	return (
  		<div>
        <Trigger onClick={this.handleOpen} />
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
	            onRequestClose={this.handleClose}
	          >
	          <CodeMirror value={this.state.code} 
                        onChange={this.onUpdate} 
                        options={{lineNumbers: true}}
            />
	      </Dialog>
	    </div>
  	)
  }
}
