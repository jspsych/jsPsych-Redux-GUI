import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');

import ButtonIcon from 'material-ui/svg-icons/editor/mode-edit';
import {
  cyan500 as hoverColor,
  grey800 as normalColor,
} from 'material-ui/styles/colors';

export default class CodeEditor extends React.Component {
  static propTypes = { 
  	onUpdate: PropTypes.func.isRequired,
  	code: PropTypes.string,
  	buttonIcon: PropTypes.object,
    title: PropTypes.string
  };

  static defaultProps = { 
  	code: "",
  	buttonIcon: (<ButtonIcon color={normalColor} hoverColor={hoverColor} />),
    title: "Code Editor"
  };

  state = {
  	open: false
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

  render() {
  	const { code, onUpdate, buttonIcon, title } = this.props;
  	const actions = [
      <FlatButton
        label="Finish"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

  	return (
  		<MuiThemeProvider>
  		<div>
	  		<IconButton onTouchTap={this.handleOpen}>
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
	          <CodeMirror value={code} onChange={onUpdate} options={{lineNumbers: true}}/>
	         </Dialog>
	    </div>
	  	</MuiThemeProvider>

  	)
  }
}