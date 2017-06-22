import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {awsConfig} from '../../../../config/aws.js';
import {Config} from "aws-sdk";
import {CognitoUserPool, CognitoUserAttribute} from "amazon-cognito-identity-js";

console.log(JSON.stringify(awsConfig));

Config.region = awsConfig.region;
/*Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: awsConfig.IdentityPoolId
});
*/
const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.UserPoolId,
  ClientId: awsConfig.ClientId,
});

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      usernameError: null,
      emailError: null,
      passwordError: null,
    };
  }

  handleUserNameChange = (e, newVal) => {
    this.setState({
      username: newVal,
      usernameError: newVal.length > 0 ? null : "Please enter a username"
    });
  }

  handleEmailChange = (e, newVal) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = re.test(newVal);
    this.setState({
      email: newVal,
      emailError: validEmail ? null : "Please enter a valid email address"
    });
  }

  handlePasswordChange = (e, newVal) => {
    this.setState({
      password: newVal,
      passwordError: newVal.length < 10 ? "Password must be at least 10 characters long" : null
    });
  }

  handleClose = () => {
    this.props.hideRegisterWindow();
  };

  handleCreateAccount = () => {

    var cont_flag = true;
    if(this.state.username == ''){
      this.setState({usernameError: "Please enter a username"});
      cont_flag = false;
    }
    if(this.state.email == '' || this.state.emailError !== null){
      this.setState({emailError: "Please enter a valid email address"});
      cont_flag = false;
    }
    if(this.state.password == '' || this.state.passwordError !== null){
      this.setState({passwordError: "Password must be at least 10 characters long"});
      cont_flag = false;
    }
    if(!cont_flag){
      return;
    }

    var attributeList = [];

    var dataEmail = {
      Name: 'email',
      Value: this.state.email,
    }

    attributeList.push(new CognitoUserAttribute(dataEmail));

    var cognitoUser;
    userPool.signUp(this.state.username, this.state.password, attributeList, null, function(err, result){
      if(err){
        alert(err)
        return;
      }
      cognitoUser = result.user;
      console.log('user name is ' + cognitoUser.getUsername());
    })

    console.log(this.state.username + " " + this.state.email + " " + this.state.password);
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
          <TextField id="userName" floatingLabelText="Username" value={this.state.username} errorText={this.state.usernameError} onChange={this.handleUserNameChange}></TextField>
          <TextField id="email" floatingLabelText="Email" value={this.state.email} errorText={this.state.emailError} onChange={this.handleEmailChange}></TextField>
          <TextField id="password" type="password" floatingLabelText="Password" errorText={this.state.passwordError} value={this.state.password} onChange={this.handlePasswordChange}></TextField>
          <div style={{margin:'auto', textAlign: 'center'}}>
            <RaisedButton label="Create Account" primary={true} onTouchTap={this.handleCreateAccount} />
          </div>
        </Dialog>
      </div>
    )
  }
}
