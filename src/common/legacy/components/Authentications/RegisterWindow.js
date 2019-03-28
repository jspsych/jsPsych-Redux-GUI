import React from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

const colors = {
  ...theme.colors,
}

const style = {
  TextFieldFocusStyle: (error=false) => ({
    ...theme.TextFieldFocusStyle(error)
  }),
  Actions: {
    Create: {
      labelStyle: {
        textTransform: "none",
        fontSize: 15,
        color: 'white'
      },
      backgroundColor: colors.primary,
      fullWidth: true,
    },
    Cancel: {
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

class RegisterWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameErrorText: null,
      emailErrorText: null,
      passwordErrorText: null,
      registering: false
    }

    this.setUsername = (e, newVal) => {
      this.props.setUserName(newVal);
      this.setState({
        usernameErrorText: newVal.length > 0 ? null : "Please enter a username"
      });
    }

    this.setEmail = (e, newVal) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const validEmail = re.test(newVal);
      this.props.setEmail(newVal);
      this.setState({
        emailErrorText: validEmail ? null : "Please enter a valid email address"
      });
    }

    this.setPassword = (e, newVal) => {
      this.props.setPassword(newVal);
      this.setState({
        passwordErrorText: newVal.length < 10 ? "Password must be at least 10 characters long" : null
      });
    }

    this.handleCreateAccount = () => {
      let cont_flag = true;
      let { username, password, email, dispatch } = this.props;

      if(username === ''){
        this.setState({usernameErrorText: "Please enter a username"});
        cont_flag = false;
      }
      if(email === '' || this.state.emailErrorText !== null){
        this.setState({emailErrorText: "Please enter a valid email address"});
        cont_flag = false;
      }
      if(password === '' || this.state.passwordErrorText !== null){
        this.setState({passwordErrorText: "Password must be at least 10 characters long"});
        cont_flag = false;
      }

      if (cont_flag) {
        this.setState({
          registering: true
        });
        this.props.signUp({
          username,
          password,
          attributes: {
            email
          }
        }).finally(() => {
          this.setState({
            registering: false
          });
        }).catch((err) => {
          if (err.code === "UsernameExistsException") {
            this.setState({
              usernameErrorText: 'This username is already taken.'
            });
          } else if (err.code === "EmailExistsException") {
            this.setState({
              emailErrorText: 'This email is already used.'
            });
          } else {
            console.log(err);
            utils.notifications.notifyErrorByDialog({
              dispatch,
              message: err.message
            });
          }
        });
      }
    }
  }
  

  render(){

    let { usernameErrorText, passwordErrorText, emailErrorText, registering } = this.state;

    return(
      <Paper zDepth={1} style={{paddingTop: 10}}>
        <div style={{width: 350, margin: 'auto'}} 
          onKeyPress={(e)=>{
              if (e.which === 13) {
                this.handleCreateAccount();
              }
             }}
          >
          <TextField 
            {...style.TextFieldFocusStyle(!!usernameErrorText)}
            fullWidth={true}
            id="userName" 
            floatingLabelText="Username" 
            value={this.props.username} 
            errorText={usernameErrorText} 
            onChange={this.setUsername}>
          </TextField>
          <TextField 
            {...style.TextFieldFocusStyle(!!emailErrorText)}
            fullWidth={true}
            id="email" 
            floatingLabelText="Email" 
            value={this.props.email} 
            errorText={emailErrorText} 
            onChange={this.setEmail}>
          </TextField>
          <TextField 
            {...style.TextFieldFocusStyle(!!passwordErrorText)}
            fullWidth={true}
            id="password" 
            type="password" 
            floatingLabelText="Password" 
            errorText={passwordErrorText} 
            value={this.props.password} 
            onChange={this.setPassword}>
          </TextField>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}>
            {!registering ?
              <RaisedButton 
                label="Create Account" 
                onClick={this.handleCreateAccount} 
                {...style.Actions.Create}
              /> :
              <CircularProgress {...style.Actions.Wait}/>
            }
          </div>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
          <FlatButton
              label="Not right now"
              {...style.Actions.Cancel}
              onClick={this.props.handleClose}
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWindow);