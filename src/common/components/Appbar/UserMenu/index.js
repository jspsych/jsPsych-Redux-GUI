import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

import SignInIcon from 'material-ui/svg-icons/action/input';
import SignUpIcon from 'material-ui/svg-icons/social/person-add';
import ProfileIcon from 'material-ui/svg-icons/social/person';
import ExperimentIcon from 'material-ui/svg-icons/action/book';
import SignOut from 'material-ui/svg-icons/action/exit-to-app';

import Login from '../../../containers/Login';
import ExperimentList from '../../../containers/Appbar/UserMenu/ExperimentList';
import Profile from '../../../containers/Appbar/UserMenu/Profile';

import AppbarTheme from '../theme.js';

const colors = {
  ...AppbarTheme.colors
}

const style = {
  Icon: {
    hoverColor: colors.secondaryLight,
    color: colors.secondary,
  },
  Avatar: utils.prefixer({
    backgroundColor: 'white',
    color: colors.primary
  }),
  Username: login => (utils.prefixer({
    color: colors.font,
    fontWeight: login ? 'bold' : 'normal',
    textDecoration: login ? 'underline' : 'none'
  }))
}

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        open: false,
        isSignedIn: false
    }


    this.handleTouchTap = (event) => {
      this.setState({
        open: true,
        anchorEl: event.currentTarget
      });
    }

    this.handleRequestClose = () => {
      this.setState({
        open: false
      })
    }

    this.renderMenu = (login) => {
      if (!login) {
        return (
          <Menu>
              <MenuItem
                leftIcon={<SignInIcon {...style.Icon}/>}
                primaryText={"Sign In"}
                onClick={() => { this.props.popSignIn(); this.handleRequestClose(); }} />
              <Divider />
              <MenuItem
                leftIcon={<SignUpIcon {...style.Icon}/>}
                primaryText={"Create Account"}
                onClick={() => { this.props.popSignUp(); this.handleRequestClose(); }} />
          </Menu>
        )
      } else {
        return (
          <Menu>
              <MenuItem
                leftIcon={<ProfileIcon {...style.Icon}/>}
                primaryText={"Your profile"}
                onClick={() => { this.Profile.handleOpen(); this.handleRequestClose(); }} />
              <MenuItem
                primaryText={"Your experiments"}
                leftIcon={<ExperimentIcon {...style.Icon} />}
                onClick={() => { this.ExperimentList.handleOpen(); this.handleRequestClose(); }} />
              <Divider />
              <MenuItem
                primaryText={"Sign out"}
                leftIcon={<SignOut {...style.Icon} />}
                onClick={() => { this.props.handleSignOut(); this.handleRequestClose(); }} />
          </Menu>
        )
      }
    }

    this.renderUserPic = (login, size=36) => {
      if (login) {
        return (
          <Avatar 
            size={size} 
            {...style.Avatar}
          >
            {this.props.username.charAt(0)}
          </Avatar>
        )
      } else {
        return null;
      }
    }
  }

  componentDidMount() {
    this.props.openProfilePage(this.Profile.handleOpen);
  }
  
  componentWillUnmount() {
    this.props.openProfilePage(() => {});
  }

  render() {
    let login = !!this.props.username;
    let buttonLabel = (!login) ? 'Sign Up/Log In' : this.props.username;

    return (
      <div>
        <div style={{float: 'right', paddingRight: 1}}>
          <ListItem 
            primaryText={buttonLabel} 
            onClick={this.handleTouchTap} 
            style={{...style.Username(login)}}
            leftAvatar={this.renderUserPic(login)}
          />
        </div>
         <Login />
         <Profile onRef={ref => (this.Profile = ref)} />
         <ExperimentList onRef={ref => (this.ExperimentList = ref)}/>
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
