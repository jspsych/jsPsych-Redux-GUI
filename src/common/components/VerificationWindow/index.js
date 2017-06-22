import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
//import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {awsConfig} from '../../../../config/aws.js';
import {Config} from "aws-sdk";
import {CognitoUser, CognitoUserPool} from "amazon-cognito-identity-js";

console.log(JSON.stringify(awsConfig));

Config.region = awsConfig.region;

const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.UserPoolId,
  ClientId: awsConfig.ClientId,
});

export default class VerificationWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    };
  }

  handleCodeChange = (e, newVal) => {
    this.setState({
      code: newVal
    });
  }

  handleClose = () => {
    this.props.hideVerificationWindow();
  };

  handleVerification = () => {

    var userData = {
      Username : this.props.user, // your username here
      Pool : userPool
    };

    var cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(this.state.code, true, function(err, result) {
      if (err) {
          alert(err);
          return;
      }
      console.log('call result: ' + result);
    });
  }

  render(){
    return(
      <div>
        <Dialog
          title="Email Verification"
          open={this.props.open}
          onRequestClose={this.handleClose}
          contentStyle={{width: '320px'}}
        >
        <p>Your account won't be created until you enter the vertification code that you receive by email. Please enter the code below.</p>
          <TextField id="verificationCode" floatingLabelText="Verification Code" value={this.state.code} onChange={this.handleCodeChange}></TextField>
          <div style={{margin:'auto', textAlign: 'center'}}>
            <RaisedButton label="Verify Email Address" primary={true} onTouchTap={this.handleVerification} />
          </div>
        </Dialog>
      </div>
    )
  }
}
