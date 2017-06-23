import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');

import ButtonIcon from 'material-ui/svg-icons/editor/mode-edit';
import {
  cyan500 as hoverColor,
  grey800 as normalColor,
} from 'material-ui/styles/colors';

export default class CodeEditor extends React.Component {
  static propTypes = { 
    submitCallback: PropTypes.func.isRequired,
    openCallback: PropTypes.func,
  	initCode: PropTypes.string,
  	buttonIcon: PropTypes.object,
    title: PropTypes.string
  };

  static defaultProps = { 
  	initCode: "",
  	buttonIcon: (<ButtonIcon color={normalColor} hoverColor={hoverColor} />),
    title: "Code Editor",
    openCallback: function() { return; },
    submitCallback: function(newCode) { return; },
  };

  state = {
  	open: false,
    code: this.props.initCode
  };

  handleOpen = () => {
  	this.setState({
  		open: true,
  	});
  };

  handleClose = () => {
  	this.setState({
  		open: false,
  	});
  };

  onUpdate = (newCode) => {
    this.setState({
      code: newCode
    });
  }

  render() {
  	const { buttonIcon, title, submitCallback, openCallback } = this.props;
  	const actions = [
      <FlatButton
        label="Finish"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => { this.handleClose(); submitCallback(this.state.code); }}
      />,
    ];

  	return (
  		<div>
	  		<IconButton onTouchTap={() => { this.handleOpen(); openCallback()}}>
	  		{buttonIcon}
	  		</IconButton>
	  		<Dialog
	            contentStyle={{minHeight: 500}}
	            title={title}
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