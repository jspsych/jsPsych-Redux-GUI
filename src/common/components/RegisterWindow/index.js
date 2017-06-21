import React from 'react';
import Dialog from 'material-ui/Dialog';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClose = () => {
    this.props.hideRegisterWindow();
  };

  render(){
    return(
      <div>
        <Dialog
        title="Create Account"
        open={this.props.open}
        onRequestClose={this.handleClose}>
        This box is where the account creation form will go.
        </Dialog>
      </div>
    )
  }
}
