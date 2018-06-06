import React from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

const colors = {
  ...theme.colors,
}

const style = {
  TextFieldFocusStyle: (error=false) => ({
    ...theme.TextFieldFocusStyle(error)
  }),
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

class SignInWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userErrorText: null,
      passwordErrorText: null,
      signIning: false
    }

    this.setUsername = (e, newVal) => {
      this.props.setUserName(newVal);
      this.setState({
        userErrorText: newVal.length > 0 ? null : "Please enter your username or email address"
      });
    }

    this.setPassword = (e, newVal) => {
      this.props.setPassword(newVal);
      this.setState({
        passwordErrorText: newVal.length < 10 ? "Password must be at least 10 characters long" : null
      });
    }

    this.signIn = () => {
      let cont_flag = true;
      if(this.props.username === ''){
        this.setState({userErrorText: "Please enter your username or email"});
        cont_flag = false;
      }
      if(this.props.password === ''){
        this.setState({passwordErrorText: "Please enter your password"});
        cont_flag = false;
      }
      if (cont_flag) {
        this.setState({
          signIning: true
        });
        this.props.signIn({
          username: this.props.username,
          password: this.props.password,
        }).catch((err) => {
          if (err.code === "NotAuthorizedException") {
            this.setState({
              passwordErrorText: "Invalid password"
            });
          } else if (err.code === "UserNotFoundException") {
            this.setState({
              userErrorText: "No account found for this username / email"
            });
          } else {
            console.log(err);
            utils.notifications.notifyErrorByDialog({
              dispatch: this.props.dispatch,
              message: err.message
            });
          }
        }).finally(() => {
          this.setState({
            signIning: false
          });
        });
      }
    }

  }
  

  render(){
    let { username, password, popForgetPassword } = this.props;
    let { userErrorText, passwordErrorText, signIning } = this.state;

    return(
      <Paper zDepth={1} style={{paddingTop: 10}} >
        <div style={{width: 350, margin: 'auto'}} 
             onKeyPress={(e)=>{
              if (e.which === 13) {
                this.signIn();
              }
             }}>
          <TextField 
            {...style.TextFieldFocusStyle(!!userErrorText)}
            fullWidth={true}
            id="username-signIn" 
            floatingLabelText="Username or Email" 
            value={username} 
            errorText={userErrorText} 
            onChange={this.setUsername}
          />
          <TextField 
            {...style.TextFieldFocusStyle(!!passwordErrorText)}
            id="password-signIn" 
            fullWidth={true}
            type="password" 
            floatingLabelText="Password" 
            errorText={passwordErrorText} 
            value={password} 
            onChange={this.setPassword} 
          />
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}>
            {!signIning ?
              <RaisedButton 
                label="Sign In" 
                onClick={this.signIn} 
                {...style.Actions.SignIn}
              /> :
              <CircularProgress {...style.Actions.Wait}/>
            }
          </div>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
            <FlatButton 
              label="Forgot my password" 
              onClick={popForgetPassword}
              {...style.Actions.Forget}
            />
          </div>
        </div>
      </Paper>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignInWindow);