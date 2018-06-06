import React from 'react';
import { connect } from 'react-redux';

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


class ForgotPasswordWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: Modes.ready,
      username: '',
      usernameErrorText: '',
      code: '',
      codeErrorText: '',
      passwordErrorText: '',
      prompt: "A verification code will be sent to the email that you used to verify this account.",
    }

    this.setCode = (e, newVal) => {
      this.setState({
        code: newVal,
      });
    }

    this.setCodeError = (m) => {
      this.setState({
        codeErrorText: m
      });
    }

    this.setUsernameError = (m) => {
      this.setState({
        usernameErrorText: m
      });
    }

    this.setPasswordError = (m) => {
      this.setState({
        passwordErrorText: m
      });
    }

    this.setPrompt = (m) => {
      this.setState({
        prompt: m
      });
    }

    this.handleFogortPassword = () => {
      this.setState({
        mode: Modes.sendingCode
      })

      let { username } = this.props;
      myaws.Auth.forgotPassword({username}).then((data) => {
        if (data) {
          console.log(data);
          this.setState({
            mode: Modes.reset
          });
          if (data.CodeDeliveryDetails) {
            this.setPrompt("The verification code has been sent to " + data.CodeDeliveryDetails.Destination);
          }
        }
      }).catch((err) => {
        this.setUsernameError(err.message);
        this.setState({
            mode: Modes.ready
          });
      });
    }

    this.handlePasswordReset = () => {
      let { username, password, dispatch } = this.props;
      let { code } = this.state;

      myaws.Auth.forgotPasswordSubmit({
        username,
        new_password: password,
        code
      }).then(() => {
        utils.notifications.notifySuccessByDialog({
          dispatch,
          message: "Your password has been reset successfully."
        });
      }).catch((err) => {
        utils.notifications.notifyErrorByDialog({
          dispatch,
          message: err.message
        });
      });
    }

    this.renderContent = () => {
      let { usernameErrorText, passwordErrorText, codeErrorText } = this.state;

      switch(this.state.mode) {
        case Modes.ready:
        case Modes.sendingCode:
          return (
            <div  style={{width: 300, margin: 'auto'}}>
              <TextField 
                {...style.TextFieldFocusStyle(!!usernameErrorText)}
                id="forgot-password-username-input" 
                fullWidth={true}
                floatingLabelText="Username" 
                errorText={usernameErrorText} 
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
                {...style.TextFieldFocusStyle(!!codeErrorText)}
                id="forgot-password-code-input" 
                fullWidth={true}
                floatingLabelText="Verification code" 
                errorText={codeErrorText} 
                value={this.state.code} 
                onChange={this.setCode}
                onKeyPress={(e)=>{
                   if (e.which === 13) {
                     this.handlePasswordReset();
                   }
                }}
                />
              <TextField 
                {...style.TextFieldFocusStyle(!!passwordErrorText)}
                id="forgot-password-password-input" 
                fullWidth={true}
                floatingLabelText="Password" 
                type="password" 
                errorText={passwordErrorText} 
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

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordWindow);