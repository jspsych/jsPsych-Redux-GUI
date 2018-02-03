import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import GeneralTheme from '../theme.js';

const colors = {
  ...GeneralTheme.colors,
}

const style = {
  TextFieldFocusStyle: {
    ...GeneralTheme.TextFieldFocusStyle()
  },
  Actions: {
    SignIn: {
      labelStyle: {
        textTransform: "none",
        fontSize: 15,
        color: 'white'
      },
      backgroundColor: colors.primary,
      fullWidth: true,
    },
    Forget: {
      labelStyle: {
        textTransform: "none",
        color: colors.secondary
      }
    },
    Wait: {
      color: colors.primary
    }
  }
}

export default class SignInWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userError: null,
      passwordError: null,
      ready: true,
    }

    this.handleReadyChange = (r) => {
      this.setState({
        ready: r
      });
    }

    this.handleUserNameChange = (e, newVal) => {
      this.props.setUserName(newVal);
      this.setState({
        userError: newVal.length > 0 ? null : "Please enter your username or email address"
      });
    }

    this.handlePasswordChange = (e, newVal) => {
      this.props.setPassword(newVal);
      this.setState({
        passwordError: newVal.length < 10 ? "Password must be at least 10 characters long" : null
      });
    }

    this.handleSignIn = () => {
      this.handleReadyChange(false);
      var cont_flag = true;
      if(this.props.username === ''){
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
      
      this.props.signIn((err) => {
        if (err) {
          this.handleReadyChange(true);
        }

        if (err.code === "NotAuthorizedException") {
          this.setState({
            passwordError: "Invalid password"
          });
          return;
        }
        if (err.code === "UserNotFoundException") {
          this.setState({
            userError: "No account found for this username / email"
          });
          return;
        }
        if (err.code === "UserNotConfirmedException") {
          this.props.popVerification();
          return;
        }
        this.props.notifyError(err.message);
      });
    }
  }
  

  render(){
    let { username, password, popForgotPassword } = this.props;
    let { handleSignIn } = this;

    return(
      <Paper zDepth={1} style={{paddingTop: 10}} >
        <div style={{width: 350, margin: 'auto'}} 
             onKeyPress={(e)=>{
              if (e.which === 13) {
                this.handleSignIn();
              }
             }}>
          <TextField 
            {...style.TextFieldFocusStyle}
            fullWidth={true}
            id="username-signIn" 
            floatingLabelText="Username or Email" 
            value={username} 
            errorText={this.state.userError} 
            onChange={this.handleUserNameChange}
          />
          <TextField 
            {...style.TextFieldFocusStyle}
            id="password-signIn" 
            fullWidth={true}
            type="password" 
            floatingLabelText="Password" 
            errorText={this.state.passwordError} 
            value={password} 
            onChange={this.handlePasswordChange} 
          />
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}>
            {this.state.ready ?
              <RaisedButton 
                label="Sign In" 
                onClick={handleSignIn} 
                {...style.Actions.SignIn}
              /> :
              <CircularProgress {...style.Actions.Wait}/>
            }
          </div>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
            <FlatButton 
              label="Forgot my password" 
              onClick={popForgotPassword}
              {...style.Actions.Forget}
            />
          </div>
        </div>
      </Paper>
    )
  }
}

// <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
//           <FlatButton
//               label="Not right now"
//               secondary={true}
//               keyboardFocused={true}
//               onClick={handleClose}
//             />
//           </div>