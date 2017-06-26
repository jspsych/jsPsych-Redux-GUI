import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

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

  render() {

    var buttonLabel = this.props.username === null ? 'Your Account' : this.props.username;

    return (
      <div>
      <div style={{float: 'right', paddingRight: 1}}>
        <MenuItem primaryText={buttonLabel} onTouchTap={this.handleTouchTap} />
      </div>
       <Login />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          anchorOrigin={{horizontal:"right",vertical:"bottom"}}
          targetOrigin={{horizontal:"right",vertical:"top"}}
          >
          <Menu>
            <MenuItem
              primaryText={"Sign In"}
              onTouchTap={() => { this.props.handleSignIn(); this.handleRequestClose(); }} />
            <MenuItem
              primaryText={"Create Account"}
              onTouchTap={() => { this.props.handleCreateAccount(); this.handleRequestClose(); }} />
          </Menu>
        </Popover>
    </div>
    )
  }
}
