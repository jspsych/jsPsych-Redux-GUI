import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import Verified from 'material-ui/svg-icons/action/verified-user';

const colors = {
  ...theme.colors,
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

class VerificationWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      codeError: '',
      mode: Modes.ready,
    }


    this.setCode = (e, newVal) => {
      this.setState({
        code: newVal,
        codeError: ''
      });
    }

    this.clearField = () => {
      this.setState({
        code: '',
        codeError: '',
      })
    }

    this.handleVerification = () => {
      this.setState({
        mode: Modes.processing
      });
      myaws.Auth.confirmSignUp({
        username: this.props.username, 
        code: this.state.code.trim()
      }).then(() => {
        this.setState({
          mode: Modes.success
        });
        this.props.load();
      }).catch((err) => {
        this.setState({
          mode: Modes.ready,
          codeError: err.message
        });
      });
    }

    this.resendVerificationCode = () => {
      this.clearField();
      myaws.Auth.resendVerification({username: this.props.username}).then(() => {
        utils.notifications.notifySuccessBySnackbar({
          dispatch: this.props.dispatch,
          message: "Verification code was resent."
        });
      }).catch((err) => {
        utils.notifications.notifyErrorByDialog({
          dispatch: this.props.dispatch,
          message: err.message
        });
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
        <p>Your account won't be created until you enter the vertification code that you receive by email. Please enter the code below.</p>
        <div style={{width: 300, margin: 'auto'}}>
          <TextField 
            {...style.TextFieldFocusStyle(!!this.state.errorText)}
            id="verificationCode" 
            fullWidth={true}
            floatingLabelText="Verification Code" 
            errorText={this.state.codeError} 
            value={this.state.code} 
            onChange={this.setCode}
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

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(VerificationWindow);