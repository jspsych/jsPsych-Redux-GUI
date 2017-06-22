import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
//import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import VerificationWindow from '../../containers/VerificationWindow';
import {awsConfig} from '../../../../config/aws.js';
import {Config} from "aws-sdk";
import {CognitoUser, CognitoUserPool, AuthenticationDetails} from "amazon-cognito-identity-js";

console.log(JSON.stringify(awsConfig));

Config.region = awsConfig.region;

const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.UserPoolId,
  ClientId: awsConfig.ClientId,
});

export default class SignInWindow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      userError: null,
      passwordError: null,
      verificationNeeded: false,
    };
  }

  handleUserNameChange = (e, newVal) => {
    this.setState({
      user: newVal,
      userError: newVal.length > 0 ? null : "Please enter your username or email address"
    });
  }

  handlePasswordChange = (e, newVal) => {
    this.setState({
      password: newVal,
      //passwordError: newVal.length < 10 ? "Password must be at least 10 characters long" : null
    });
  }

  handleClose = () => {
    this.props.hideSignInWindow();
  };

  handleSignIn = () => {

    var cont_flag = true;
    if(this.state.user === ''){
      this.setState({userError: "Please enter your username or email"});
      cont_flag = false;
    }
    if(this.state.password === ''){
      this.setState({passwordError: "Please enter your password"});
      cont_flag = false;
    }
    if(!cont_flag){
      return;
    }

    var authenticationData = {
      Username: this.state.user,
      Password: this.state.password
    }

    var userData = {
      Username : this.state.user, // your username here
      Pool : userPool
    };

    var authenticationDetails = new AuthenticationDetails(authenticationData);
    var cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('access token: '+ result.getAccessToken().getJwtToken());
      },
      onFailure: (err) => {
        if(err.code === "UserNotConfirmedException"){
          this.setState({verificationNeeded: true});
        }
        if(err.code === "NotAuthorizedException"){
          this.setState({passwordError: "Invalid password"});
        }
        if(err.code === "UserNotFoundException"){
          this.setState({userError: "No account found for this username / email"})
        }
        alert(err.code);
        //alert(err.code);
        //const errobj = JSON.parse(err);
        //console.log(err);



      }
    })
  }

  render(){
    return(
      <div>
        <Dialog
          title="Sign In"
          open={this.props.open}
          onRequestClose={this.handleClose}
          contentStyle={{width: '320px'}}
        >
          <TextField id="userName" floatingLabelText="Username or Email" value={this.state.user} errorText={this.state.userError} onChange={this.handleUserNameChange}></TextField>
          <TextField id="password" type="password" floatingLabelText="Password" errorText={this.state.passwordError} value={this.state.password} onChange={this.handlePasswordChange}></TextField>
          <div style={{margin:'auto', textAlign: 'center'}}>
            <RaisedButton label="Sign In" primary={true} onTouchTap={this.handleSignIn} />
          </div>
          <VerificationWindow user={this.state.user} open={this.state.verificationNeeded} />
        </Dialog>
      </div>
    )
  }
}
