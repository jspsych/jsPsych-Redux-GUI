import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
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

  render() {

    var buttonLabel = this.props.user === null ? 'Your Account' : this.props.user;

    return (
      <div style={{display: 'inline-block', float: 'right'}}>
        <FlatButton label={buttonLabel} onTouchTap={this.handleTouchTap} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onRequestClose={this.handleRequestClose}
          >
          <Menu>
            <MenuItem
              primaryText="Sign In"
              onTouchTap={this.handleSignIn} />
            <MenuItem
              primaryText="Create Account"
              onTouchTap={this.handleCreateAccount} />
          </Menu>
        </Popover>
    </div>
    )
  }
}
