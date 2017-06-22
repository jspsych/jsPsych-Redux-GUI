import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClose = () => {
    this.props.hideRegisterWindow();
  };

  handleCreateAccount = () => {

  }

  render(){
    const actions = [
      <FlatButton
        label="Not right now"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return(
      <div>
        <Dialog
          title="Create a new account"
          open={this.props.open}
          onRequestClose={this.handleClose}
          actions={actions}
          contentStyle={{width: '320px'}}
        >
        This box is where the account creation form will go.
          <TextField id="userName" floatingLabelText="Username"></TextField>
          <TextField id="email" floatingLabelText="Email"></TextField>
          <TextField id="password" type="password" floatingLabelText="Password"></TextField>
          <div style={{margin:'auto', textAlign: 'center'}}>
            <RaisedButton label="Create Account" primary={true} onTouchTap={this.handleCreateAccount} />
          </div>
        </Dialog>
      </div>
    )
  }
}
