import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

const colors = {
  ...theme.colors,
}

const style = {
  TextFieldFocusStyle: () => ({
    ...theme.TextFieldFocusStyle()
  }),
  Actions: {
    Wait: {
      color: colors.secondary
    },
    Next: {
      labelStyle: {
        textTransform: "none",
        color: colors.primary
      },
      fullWidth: true,
    },
    Resend:{
      labelStyle: {
        textTransform: "none",
        color: colors.secondary
      },
      fullWidth: true,
    },
  }
}

let Modes = {
  ready: 0,
  sendingCode: 1,
  reset: 2,
  resetProcessing: 3,
}


export default class forgotPasswordWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: Modes.ready,
      username: '',
      usernameError: '',
      code: '',
      codeError: '',
      passwordError: '',
      prompt: "A verification code will be sent to the email that you used to verify this account.",
    }

    this.handleModeChange = (mode) => {
      this.setState({
        mode: mode
      });
    }

    this.handleCodeChange = (e, newVal) => {
      this.setState({
        code: newVal,
      });
    }

    this.handleCodeError = (m) => {
      this.setState({
        codeError: m
      });
    }

    this.handleUsernameError = (m) => {
      this.setState({
        usernameError: m
      });
    }

    this.handlePasswordError = (m) => {
      this.setState({
        passwordError: m
      });
    }

    this.handlePrompt = (m) => {
      this.setState({
        prompt: m
      });
    }

    this.handleFogortPassword = () => {
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

    this.handlePasswordReset = () => {
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

    this.renderContent = () => {
      switch(this.state.mode) {
        case Modes.ready:
        case Modes.sendingCode:
          return (
            <div  style={{width: 300, margin: 'auto'}}>
              <TextField 
                {...style.TextFieldFocusStyle()}
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
                  <CircularProgress {...style.Actions.Wait}/> :
                  <FlatButton 
                    label="Next" 
                    onClick={this.handleFogortPassword} 
                    {...style.Actions.Next}
                  />
                }
              </div>
            </div>
          );
        case Modes.reset:
        case Modes.resetProcessing:
          return (
            <div style={{width: 300, margin: 'auto'}}>
              <TextField 
                {...style.TextFieldFocusStyle()}
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
                {...style.TextFieldFocusStyle()}
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
                  <CircularProgress {...style.Actions.Wait}/> :
                  <RaisedButton 
                    label="Reset your password" 
                    onClick={this.handlePasswordReset} 
                    {...style.Actions.Next}
                  />
                }
              </div>
              <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
                <FlatButton 
                  label="Resend verification Code" 
                  onClick={this.handleFogortPassword} 
                  {...style.Actions.Resend}
                />
              </div>
            </div>
          )
        default:
          return null;
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...nextProps
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

          