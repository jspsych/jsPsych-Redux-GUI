import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {awsConfig} from '../../../../config/aws.js';
import {Config} from "aws-sdk";
import {CognitoUserPool, CognitoUserAttribute} from "amazon-cognito-identity-js";

// console.log(JSON.stringify(awsConfig));

Config.region = awsConfig.region;
/*Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: awsConfig.IdentityPoolId
});
*/
const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.UserPoolId,
  ClientId: awsConfig.ClientId,
});

export default class RegisterWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      usernameError: null,
      emailError: null,
      passwordError: null,
    };
  }

  handleUserNameChange = (e, newVal) => {
    this.props.setUserName(newVal);
    this.setState({
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
    this.props.setPassword(newVal);
    this.setState({
      passwordError: newVal.length < 10 ? "Password must be at least 10 characters long" : null
    });
  }

  handleCreateAccount = () => {

    var cont_flag = true;
    if(this.props.username === ''){
      this.setState({usernameError: "Please enter a username"});
      cont_flag = false;
    }
    if(this.state.email === '' || this.state.emailError !== null){
      this.setState({emailError: "Please enter a valid email address"});
      cont_flag = false;
    }

    if(this.props.password === '' || this.state.passwordError !== null){
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
    userPool.signUp(this.props.username, this.props.password, attributeList, null, function(err, result){
      if(err){
        alert(err)
        return;
      }
      cognitoUser = result.user;
      this.props.popVerification();
      console.log('user name is ' + cognitoUser.getUsername());
    })
    console.log(this.props.username + " " + this.state.email + " " + this.props.password);
  }

  render(){

    return(
      <Paper zDepth={1} style={{paddingTop: 10}}>
        <div style={{width: 350, margin: 'auto'}} 
          onKeyPress={(e)=>{
              if (e.which === 13) {
                this.handleCreateAccount();
              }
             }}
          >
          <TextField 
            fullWidth={true}
            id="userName" 
            floatingLabelText="Username" 
            value={this.props.username} 
            errorText={this.state.usernameError} 
            onChange={this.handleUserNameChange}>
          </TextField>
          <TextField 
            fullWidth={true}
            id="email" 
            floatingLabelText="Email" 
            value={this.state.email} 
            errorText={this.state.emailError} 
            onChange={this.handleEmailChange}>
          </TextField>
          <TextField 
            fullWidth={true}
            id="password" 
            type="password" 
            floatingLabelText="Password" 
            errorText={this.state.passwordError} 
            value={this.props.password} 
            onChange={this.handlePasswordChange}>
          </TextField>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}>
            <RaisedButton label="Create Account" primary={true} onTouchTap={this.handleCreateAccount} fullWidth={true}/>
          </div>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
          <FlatButton
              label="Not right now"
              secondary={true}
              keyboardFocused={true}
              onTouchTap={this.props.handleClose}
            />
          </div>
        </div>
      </Paper>
    )
  }
}
