import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

import SignInIcon from 'material-ui/svg-icons/action/input';
import SignUpIcon from 'material-ui/svg-icons/social/person-add';
import Profile from 'material-ui/svg-icons/social/person';
import ExperimentIcon from 'material-ui/svg-icons/action/book';
import SignOut from 'material-ui/svg-icons/action/exit-to-app';

import Login from '../../../containers/Login';
import ExperimentList from '../../../containers/Appbar/ExperimentList';

import AppbarTheme from '../theme.js';

const colors = {
  ...AppbarTheme.colors
}

const style = {
  icon: {
    hoverColor: colors.secondaryLight,
    color: colors.secondary,
  },
  avatar: {
    backgroundColor: 'white',
    color: colors.primary
  },
  username: login => ({
    color: colors.font,
    fontWeight: login ? 'bold' : 'normal',
    textDecoration: login ? 'underline' : 'none'
  })
}

export default class UserMenu extends React.Component {
  state = {
      open: false,
      experimentListOpen: false,
  }


  handleTouchTap = (event) => {
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

  openExperimentList = () => {
    this.setState({
      experimentListOpen: true
    })
  }

  closeExperimentList = () => {
    this.setState({
      experimentListOpen: false
    })
  }

  renderMenu = (login) => {
    if (!login) {
      return (
        <Menu>
            <MenuItem
              leftIcon={<SignInIcon {...style.icon}/>}
              primaryText={"Sign In"}
              onClick={() => { this.props.handleSignIn(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              leftIcon={<SignUpIcon {...style.icon}/>}
              primaryText={"Create Account"}
              onClick={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
        </Menu>
      )
    } else {
      return (
        <Menu>
            <MenuItem
              leftIcon={<Profile {...style.icon}/>}
              primaryText={"Your profile"}
              onClick={() => { this.handleRequestClose(); }} />
            <MenuItem
              primaryText={"Your experiments"}
              leftIcon={<ExperimentIcon {...style.icon} />}
              onClick={() => { this.openExperimentList(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Sign out"}
              leftIcon={<SignOut {...style.icon} />}
              onClick={() => { this.props.handleSignOut(); this.handleRequestClose(); }} />
        </Menu>
      )
    }
  }

  renderUserPic = (login, size=36) => {
    return ((!login) ? 
            null:
            <Avatar 
              size={size} 
              {...style.avatar}
            >
              {this.props.username.charAt(0)}
            </Avatar>)
  }

  render() {
    let login = this.props.username !== null;
    let buttonLabel = (!login) ? 'Sign Up/Log In' : this.props.username;

    return (
      <div>
      <div style={{float: 'right', paddingRight: 1}}>
        <ListItem 
          primaryText={buttonLabel} 
          onClick={this.handleTouchTap} 
          style={{...style.username(login)}}
          leftAvatar={this.renderUserPic(login)}
        />
      </div>
       <Login />
       <ExperimentList 
        open={this.state.experimentListOpen} 
        handleOpen={this.openExperimentList}
        handleClose={this.closeExperimentList}
       />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          anchorOrigin={{horizontal:"right",vertical:"bottom"}}
          targetOrigin={{horizontal:"right",vertical:"top"}}
          >
          {this.renderMenu(login)}
        </Popover>
    </div>
    )
  }
}
