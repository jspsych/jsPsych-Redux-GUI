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
  TextFieldFocusStyle: (error = false) => ({
    ...theme.TextFieldFocusStyle(error)
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
      sendingCode: false,
      reseting: false
    }

    this.setUsername = (e, v) => {
      this.props.setUserName(v);
      this.setState({
        usernameErrorText: ''
      });
    }

    this.setPassword = (e, v) => {
      this.props.setPassword(v);
      this.setState({
        passwordErrorText: v.length < 10 ? "Password must be at least 10 characters long" : null
      });
    }

    this.setCode = (e, newVal) => {
      this.setState({
        code: newVal,
        codeErrorText: ''
      });
    }

    this.sendVerificationCode = () => {
      this.setState({
        sendingCode: true
      })
      let { username } = this.props;
      myaws.Auth.forgotPassword({username}).then((data) => {
        if (data) {
          this.setState({
            mode: Modes.reset
          });
          if (data.CodeDeliveryDetails) {
            this.setState({ 
              prompt: `The verification code has been sent to ${data.CodeDeliveryDetails.Destination}.` 
            });
            utils.notifications.notifySuccessBySnackbar({
              dispatch: this.props.dispatch,
              message: 'The verification code was sent.'
            });
          }
        }
      }).catch((err) => {
        if (err.code === 'UserNotFoundException') {
          this.setState({
            usernameErrorText: err.message,
            mode: Modes.ready
          });
        }
        utils.notifications.notifyErrorByDialog({
          dispatch: this.props.dispatch,
          message: err.message
        })
      }).finally(() => {
        this.setState({
          sendingCode: false
        })
      });
    }

    this.handleFogortPassword = () => {
      this.setState({
        mode: Modes.sendingCode,
      })
      this.sendVerificationCode();
    }

    this.resetPassword = () => {
      let cont_flag = true;
      let { username, password, dispatch } = this.props;
      let { code } = this.state;

      if(code === ''){
        this.setState({codeErrorText: "Please enter a valid verification code."});
        cont_flag = false;
      }
      if(password === '' || this.state.passwordErrorText !== null){
        this.setState({passwordErrorText: "Password must be at least 10 characters long"});
        cont_flag = false;
      }

      if (cont_flag) {
        this.setState({
          reseting: true
        })
        myaws.Auth.forgotPasswordSubmit({
          username,
          new_password: password,
          code
        }).then(() => {
          this.props.handleClose();
          utils.notifications.notifySuccessByDialog({
            dispatch,
            message: "Your password has been reset successfully."
          });
          utils.loginWindows.popSignIn({dispatch});
        }).catch((err) => {
          if (err.code === 'CodeMismatchException') {
            this.setState({
              codeErrorText: err.message
            });
          } else {
            utils.notifications.notifyErrorByDialog({
              dispatch,
              message: err.message
            });
          }
        }).finally(() => {
          this.setState({
            reseting: false
          })
        });
      }
      
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
                onChange={this.setUsername}
                   onKeyPress={(e)=>{
                      if (e.which === 13) {
                        this.handleFogortPassword();
                      }
                   }}
                />
              <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
                {this.state.sendingCode ?
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
                     this.resetPassword();
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
                onChange={this.setPassword}
                   onKeyPress={(e)=>{
                      if (e.which === 13) {
                        this.resetPassword();
                      }
                   }}
                />
              <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}>
                {this.state.reseting ? 
                  <CircularProgress {...style.Actions.Wait}/> :
                  <RaisedButton 
                    label="Reset your password" 
                    onClick={this.resetPassword} 
                    {...style.Actions.Next}
                  />
                }
              </div>
              <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
                {this.state.sendingCode ? 
                  <CircularProgress {...style.Actions.Wait}/> :
                  <FlatButton 
                    label="Resend verification Code" 
                    onClick={this.sendVerificationCode} 
                    {...style.Actions.Resend}
                  />
                }
              </div>
            </div>
          )
        default:
          return null;
      }
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