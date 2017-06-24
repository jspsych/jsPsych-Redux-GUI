import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
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
      userError: null,
      passwordError: null,
    };
  }

  handleUserNameChange = (e, newVal) => {
    this.props.setUserName(newVal);
    this.setState({
      userError: newVal.length > 0 ? null : "Please enter your username or email address"
    });
  }

  handlePasswordChange = (e, newVal) => {
    this.props.setPassword(newVal);
    // this.setState({
    //   password: newVal,
    //   //passwordError: newVal.length < 10 ? "Password must be at least 10 characters long" : null
    // });
  }

  handleSignIn = () => {
    var cont_flag = true;
    if(this.props.userName === ''){
      this.setState({userError: "Please enter your username or email"});
      cont_flag = false;
    }
    if(this.props.password === ''){
      this.setState({passwordError: "Please enter your password"});
      cont_flag = false;
    }
    if(!cont_flag){
      return;
    }

    var authenticationData = {
      Username: this.props.userName,
      Password: this.props.password
    }

    var userData = {
      Username : this.props.userName, // your username here
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
          this.props.popVerification();
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
    let { userName, password } = this.props;

    return(
      <Paper zDepth={1} style={{paddingTop: 10}}>
        <div style={{width: 500, margin: 'auto'}} >
          <TextField 
            fullWidth={true}
            id="userName" 
            floatingLabelText="Username or Email" 
            value={userName} 
            errorText={this.state.userError} 
            onChange={this.handleUserNameChange}
          />
          <TextField id="password" 
            fullWidth={true}
            type="password" 
            floatingLabelText="Password" 
            errorText={this.state.passwordError} 
            value={password} 
            onChange={this.handlePasswordChange} 
          />
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
            <RaisedButton label="Sign In" primary={true} onTouchTap={this.handleSignIn} />
          </div>
        </div>
      </Paper>
    )
  }
}
