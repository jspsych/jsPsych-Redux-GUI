import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

import Profile from 'material-ui/svg-icons/social/person';
import ExperimentIcon from 'material-ui/svg-icons/action/book';
import SignOut from 'material-ui/svg-icons/action/exit-to-app';
import {
  indigo500 as hoverColor,
  cyan500 as iconColor,
  blue400 as avatarBackgroundColor
} from 'material-ui/styles/colors';

import Login from '../../../containers/Login';
import ExperimentList from '../../../containers/Appbar/ExperimentList';

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
              primaryText={"Sign In"}
              onTouchTap={() => { this.props.handleSignIn(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Create Account"}
              onTouchTap={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
        </Menu>
      )
    } else {
      return (
        <Menu>
            <MenuItem
              leftIcon={<Profile hoverColor={hoverColor} color={iconColor}/>}
              primaryText={"Your profile"}
              onTouchTap={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
            <MenuItem
              primaryText={"Your experiments"}
              leftIcon={<ExperimentIcon hoverColor={hoverColor} color={iconColor} />}
              onTouchTap={() => { this.openExperimentList(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Sign out"}
              leftIcon={<SignOut hoverColor={hoverColor} color={iconColor} />}
              onTouchTap={() => { this.props.handleSignOut(); this.handleRequestClose(); }} />
        </Menu>
      )
    }
  }

  renderUserPic = (login, size=36) => {
    return ((!login) ? 
            null:
            <Avatar 
              size={size} 
              backgroundColor={avatarBackgroundColor}
            >
              {this.props.username.charAt(0)}
            </Avatar>)
  }

  render() {
    let login = this.props.username !== null;
    let buttonLabel = (!login) ? 'Your Account' : this.props.username;

    return (
      <div>
      <div style={{float: 'right', paddingRight: 1}}>
        <ListItem 
          primaryText={buttonLabel} 
          onTouchTap={this.handleTouchTap} 
          style={{textDecoration: (login) ? 'underline' : 'none'}}
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
