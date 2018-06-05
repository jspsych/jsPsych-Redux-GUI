import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';

import Verified from 'material-ui/svg-icons/action/verified-user';
import Sent from 'material-ui/svg-icons/action/check-circle';

import { verify, resendVerification} from '../../backend/cognito';

import GeneralTheme from '../theme.js';

const colors = {
  ...GeneralTheme.colors,
  verifyColor: '#4CAF50'
}

const style = {
  VerifyIcon: {
    colors: colors.verifyColor,
  },
  TextFieldFocusStyle: (error=false) => ({
    ...GeneralTheme.TextFieldFocusStyle(error)
  }),
  Actions: {
    Wait: {
      color: colors.secondary
    },
    Verify: {
      backgroundColor: colors.primary,
      labelStyle: {
        textTransform: "none",
        color: 'white'
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
  processing: 1,
  success: 2,
}

export default class VerificationWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      codeError: '',
      mode: Modes.ready,
      open: false,
      message: '',
    }

    this.handleSnackbarClose = () => {
      this.setState({
        open: false,
      });
    }

    this.handleSnackbarOpen = () => {
      this.setState({
        open: true,
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

    this.handleModeChange = (mode) => {
      this.setState({
        mode: mode
      });
    }

    this.handleVerification = () => {
      this.handleModeChange(Modes.processing);
      verify(this.props.username, this.state.code, (err, result) => {
        if (err) {
          this.handleModeChange(Modes.ready);
          this.handleCodeError(err.message);
          return;
        }
        if (result === 'SUCCESS') {
          this.handleModeChange(Modes.success);
          this.handleCodeError('');
          this.props.signIn((err) => {
            this.props.notifyError(err.message);
          }, true)
        }
      });
    }

    this.resendVerificationCode = () => {
      this.handleCodeChange(null, '');
      this.handleSnackbarOpen(); 
      resendVerification(this.props.username, (err, result) => {
        if (err) {
          this.props.notifyError(err.message);
          return;
        }
      });
    }

    this.renderVerifcationButton = () => {
      switch(this.state.mode) {
        case Modes.processing:
          return (
            <CircularProgress {...style.Actions.Wait}/>
          );
        case Modes.success:
          return (
            <FlatButton
              labelStyle={{textTransform: "none", }}
              label="User Verified"
              icon={<Verified {...style.VerifyIcon}/>}
            />
          );
        case Modes.ready:
        default:
          return (
            <RaisedButton 
                  label="Verify Email Address" 
                  onClick={this.handleVerification} 
                  {...style.Actions.Verify}
            />
          );
      }
    }
  }


  render(){
    return(
      <div >
        <Snackbar
            open={this.state.open}
            message={ 
              <MenuItem 
                primaryText="Verification code was resent."
                style={{color: 'white' }}
                disabled={true}
                rightIcon={<Sent {...style.VerifyIcon}/>} 
              /> 
            }
            autoHideDuration={2500}
            onRequestClose={this.handleSnackbarClose}
          />
        <p>Your account won't be created until you enter the vertification code that you receive by email. Please enter the code below.</p>
        <div 
          style={{width: 300, margin: 'auto'}}
        >
          <TextField 
            {...style.TextFieldFocusStyle(!!this.state.errorText)}
            id="verificationCode" 
            fullWidth={true}
            floatingLabelText="Verification Code" 
            errorText={this.state.codeError} 
            value={this.state.code} 
            onChange={this.handleCodeChange}
               onKeyPress={(e)=>{
                  if (e.which === 13) {
                    this.handleVerification();
                  }
               }}
            />

          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}   
          >
            {
              this.renderVerifcationButton()
            }
          </div>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
            <FlatButton 
              label="Resend Verification Code" 
              onClick={this.resendVerificationCode} 
              {...style.Actions.Resend}
            />
          </div>
        </div>
      </div>
    )
  }
}
