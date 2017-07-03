import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import { signUp } from '../../backend/cognito';

export default class RegisterWindow extends React.Component {
  state = {
    usernameError: null,
    emailError: null,
    passwordError: null,
    ready: true,
  }

  handleReadyChange = (r) => {
    this.setState({
      ready: r
    });
  }

  handleUserNameChange = (e, newVal) => {
    this.props.setUserName(newVal);
    this.setState({
      usernameError: newVal.length > 0 ? null : "Please enter a username"
    });
  }

  handleEmailChange = (e, newVal) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validEmail = re.test(newVal);
    this.props.setEmail(newVal);
    this.setState({
      emailError: validEmail ? null : "Please enter a valid email address"
    });
  }

  handlePasswordChange = (e, newVal) => {
    this.props.setPassword(newVal);
    this.setState({
      passwordError: newVal.length < 10 ? "Password must be at least 10 characters long" : null
    });
  }

  handleCreateAccount = () => {
    this.handleReadyChange(false);
    var cont_flag = true;
    if(this.props.username === ''){
      this.setState({usernameError: "Please enter a username"});
      cont_flag = false;
    }
    if(this.props.email === '' || this.state.emailError !== null){
      this.setState({emailError: "Please enter a valid email address"});
      cont_flag = false;
    }

    if(this.props.password === '' || this.state.passwordError !== null){
      this.setState({passwordError: "Password must be at least 10 characters long"});
      cont_flag = false;
    }
    if(!cont_flag){
      this.handleReadyChange(true);
      return;
    }

    var attributes = [{
      Name: 'email',
      Value: this.props.email,
    }];



    signUp(this.props.username, this.props.password, attributes, (err, result) => {
      if (err) {
        this.handleReadyChange(true);
        this.props.notifyError(err.message);
        return;
      }
      this.props.popVerification();
    });
  }

  render(){

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
            fullWidth={true}
            id="userName" 
            floatingLabelText="Username" 
            value={this.props.username} 
            errorText={this.state.usernameError} 
            onChange={this.handleUserNameChange}>
          </TextField>
          <TextField 
            fullWidth={true}
            id="email" 
            floatingLabelText="Email" 
            value={this.props.email} 
            errorText={this.state.emailError} 
            onChange={this.handleEmailChange}>
          </TextField>
          <TextField 
            fullWidth={true}
            id="password" 
            type="password" 
            floatingLabelText="Password" 
            errorText={this.state.passwordError} 
            value={this.props.password} 
            onChange={this.handlePasswordChange}>
          </TextField>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15}}>
            {this.state.ready ?
              <RaisedButton 
                label="Create Account" 
                labelStyle={{
                      textTransform: "none",
                      fontSize: 15
                }}
                primary={true} 
                onTouchTap={this.handleCreateAccount} 
                fullWidth={true}
              /> :
              <CircularProgress />
            }
          </div>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
          <FlatButton
              label="Not right now"
              labelStyle={{
                textTransform: "none",
              }}
              secondary={true}
              keyboardFocused={true}
              onTouchTap={this.props.handleClose}
            />
          </div>
        </div>
      </Paper>
    )
  }
}
