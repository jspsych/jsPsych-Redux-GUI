import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  grey50,
  grey900 as deepGrey,
  cyan500 as iconHighlightColor
} from 'material-ui/styles/colors';
import InitSettingIcon from 'material-ui/svg-icons/action/settings';


export default class jsPsychInitEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleOpen = () => {
      this.setState({
        open: true
      });
    };

    this.handleClose = () => {
      this.setState({
        open: false
      });
    };

  }



  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];


    return (
      <MuiThemeProvider>
        <div className="jsPsych.init-editor">
          <IconButton 
              tooltip="Click to set jsPsych.init properties"
              onTouchTap={this.handleOpen}
          >
              <InitSettingIcon 
                color={(this.state.open) ? iconHighlightColor : deepGrey}
                hoverColor={iconHighlightColor}
              />
          </IconButton>
          <Dialog
            title="jsPsych.init Editor"
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}