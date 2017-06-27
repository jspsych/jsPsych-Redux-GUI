import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import Login from '../../../containers/Login';

export default class UserMenu extends React.Component {
  state = {
      open: false,
  }

  componentWillMount() {
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
              primaryText={"Profile"}
              onTouchTap={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Experiments"}
              onTouchTap={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
            <Divider />
            <MenuItem
              primaryText={"Sign Out"}
              onTouchTap={() => { this.props.handleSignOut(); this.handleRequestClose(); }} />
        </Menu>
      )
    }
  }

  render() {
    let login = this.props.username !== null;
    let buttonLabel = (!login) ? 'Your Account' : this.props.username;

    return (
      <div>
      <div style={{float: 'right', paddingRight: 1}}>
        <MenuItem 
          primaryText={buttonLabel} 
          onTouchTap={this.handleTouchTap} 
          style={{textDecoration: (login) ? 'none' : 'none'}}
        />
      </div>
       <Login />
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
