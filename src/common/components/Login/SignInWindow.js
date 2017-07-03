import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';


export default class SignInWindow extends React.Component {

  state = {
    userError: null,
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
      userError: newVal.length > 0 ? null : "Please enter your username or email address"
    });
  }

  handlePasswordChange = (e, newVal) => {
    this.props.setPassword(newVal);
    this.setState({
      passwordError: newVal.length < 10 ? "Password must be at least 10 characters long" : null
    });
  }

  handleSignIn = () => {
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
            fullWidth={true}
            id="username" 
            floatingLabelText="Username or Email" 
            value={username} 
            errorText={this.state.userError} 
            onChange={this.handleUserNameChange}
          />
          <TextField id="password" 
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
                labelStyle={{
                      textTransform: "none",
                      fontSize: 15
                }}
                primary={true} 
                onTouchTap={handleSignIn} 
                fullWidth={true}
              /> :
              <CircularProgress />
            }
          </div>
          <div style={{margin:'auto', textAlign: 'center', paddingTop: 15, paddingBottom: 20}}>
            <FlatButton 
              label="Forgot my password" 
              labelStyle={{textTransform: "none", }}
              secondary={true}
              onTouchTap={popForgotPassword}
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
//               onTouchTap={handleClose}
//             />
//           </div>