import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import { forgotPassword, forgotPasswordReset } from '../../backend/cognito';

let Modes = {
  ready: 0,
  sendingCode: 1,
  reset: 2,
  resetProcessing: 3,
}


export default class forgotPasswordWindow extends React.Component {
  state = {
    mode: Modes.ready,
    usernameError: '',
    code: '',
    codeError: '',
    passwordError: '',
    prompt: "A verification code will be sent to the email that you used to verify this account.",
  }

  componentDidMount() {
    this.props.setUserName('');
    this.props.setPassword('');
  }

  handleModeChange = (mode) => {
    this.setState({
      mode: mode
    });
  }

  handleCodeChange = (e, newVal) => {
    this.setState({
      code: newVal,
    });
  }

  handleCodeError = (m) => {
    this.setState({
      codeError: m
    });
  }

  handleUsernameError = (m) => {
    this.setState({
      usernameError: m
    });
  }

  handlePasswordError = (m) => {
    this.setState({
      passwordError: m
    });
  }

  handlePrompt = (m) => {
    this.setState({
      prompt: m
    });
  }

  handleFogortPassword = () => {
    this.handleModeChange(Modes.sendingCode);
    forgotPassword(this.props.username, 
      (data) => {
        this.handleModeChange(Modes.reset);
      },
      (err) => {
        this.handleUsernameError(err.message);
        this.handleModeChange(Modes.ready);
      },
      (data) => {
        this.handleModeChange(Modes.reset);
        this.handlePrompt("The verification code has been sent to " + data.CodeDeliveryDetails.Destination);
      }) 
  }

  handlePasswordReset = () => {
    let { username, password } = this.props;
    let { code, } = this.state;

    let callback = {
      onSuccess: () => {
        this.props.signIn((err) => {
          console.log(err.message)
        })
      },
      onFailuer: (err) => {
        this.props.notifyError(err.message);
      }
    }
    forgotPasswordReset(username, code, password, callback);
  }

  renderContent = () => {
    switch(this.state.mode) {
      case Modes.ready:
      case Modes.sendingCode:
        return (
          <div 
            style={{width: 300, margin: 'auto'}}
          >
            <TextField 
              id="forgot-password-username-input" 
              fullWidth={true}
              floatingLabelText="Username" 
              errorText={this.state.usernameError} 
              value={this.props.username} 
              onChange={(e, v) => { this.props.setUserName(v); }}
                 onKeyPress={(e)=>{
                    if (e.which === 13) {
                      this.handleFogortPassword();
                    }
                 }}
              />
            <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
              {(this.state.mode === Modes.sendingCode) ?
                <CircularProgress /> :
                <FlatButton 
                label="Next" 
                primary={true} 
                labelStyle={{textTransform: "none", }}
                onTouchTap={this.handleFogortPassword} 
              />}
            </div>
          </div>
        );
      case Modes.reset:
      case Modes.resetProcessing:
        return (
          <div 
            style={{width: 300, margin: 'auto'}}
          >
            <TextField 
              id="forgot-password-code-input" 
              fullWidth={true}
              floatingLabelText="Verification code" 
              errorText={this.state.codeError} 
              value={this.state.code} 
              onChange={this.handleCodeChange}
              onKeyPress={(e)=>{
                 if (e.which === 13) {
                   this.handlePasswordReset();
                 }
              }}
              />
            <TextField 
              id="forgot-password-password-input" 
              fullWidth={true}
              floatingLabelText="Password" 
              type="password" 
              errorText={this.state.passwordError} 
              value={this.props.password} 
              onChange={(e, v) => { this.props.setPassword(v); }}
                 onKeyPress={(e)=>{
                    if (e.which === 13) {
                      this.handlePasswordReset();
                    }
                 }}
              />
            <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}>
              {(this.state.mode === Modes.resetProcessing) ? 
                <CircularProgress /> :
                <RaisedButton 
                label="Reset your password" 
                fullWidth={true}
                primary={true} 
                labelStyle={{textTransform: "none", }}
                onTouchTap={this.handlePasswordReset} 
              />}
            </div>
            <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
              <FlatButton 
                label="Resend verification Code" 
                secondary={true} 
                labelStyle={{textTransform: "none", }}
                onTouchTap={this.handleFogortPassword} 
              />
            </div>
          </div>
        )
      default:
        return null;
    }
  }


  render() {
    return(
      <div >
        <p>{this.state.prompt}</p>
        {
          this.renderContent()
        }
      </div>
    )
  }
}

          