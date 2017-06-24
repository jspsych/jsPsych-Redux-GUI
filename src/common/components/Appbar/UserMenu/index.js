import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import Login from '../../../containers/Login';
import { LoginModes } from '../../Login';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    }
  }

  componentWillMount() {
    this.state = {
      loginOpen: false,
      loginMode: LoginModes.signIn,
      // loginOpen: true,
      // loginMode: 2,
    }
  }

  handleTouchTap = (event) => {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    })
  }

  handleCreateAccount = () => {
    this.setState({
      open: false
    });
    this.props.showRegisterWindow();
  }

  handleSignIn = () => {
    this.setState({
      open: false
    });
    this.props.showSignInWindow();
  }

  handleOpenLogin = (mode) => {
    this.setState({
      loginOpen: true,
      loginMode: mode,
    })
  }

  handleCloseLogin = () => {
    this.setState({
      loginOpen: false,
    })
  }

  setLoginMode = (mode) => {
    this.setState({loginMode: mode});
  }

  render() {

    var buttonLabel = this.props.user === null ? 'Your Account' : this.props.user;

    return (
      <div style={{display: 'inline-block', float: 'right'}}>
        <FlatButton label={buttonLabel} onTouchTap={this.handleTouchTap} />
        <Login 
          loginMode={this.state.loginMode} 
          open={this.state.loginOpen}
          handleOpen={this.handleOpenLogin}
          handleClose={this.handleCloseLogin}
          setLoginMode={this.setLoginMode}
          />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          >
          <Menu>
            <MenuItem
              primaryText={"Sign In"}
              onTouchTap={() => {this.handleOpenLogin(LoginModes.signIn); this.handleRequestClose();}} />
            <MenuItem
              primaryText={"Create Account"}
              onTouchTap={() => { this.handleOpenLogin(LoginModes.register); this.handleRequestClose();}} />
          </Menu>
        </Popover>
    </div>
    )
  }
}
