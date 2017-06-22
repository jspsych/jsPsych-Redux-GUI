import { connect } from 'react-redux';

import UserMenu from '../../../components/Appbar/UserMenu';
import * as userMenuActions from '../../../actions/userMenuActions';

const showRegisterWindow = (dispatch) => {
  dispatch(userMenuActions.showRegisterWindow());
}

const showSignInWindow = (dispatch) => {
  dispatch(userMenuActions.showSignInWindow());
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.userState.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  showRegisterWindow: () => { showRegisterWindow(dispatch) },
  showSignInWindow: () => { showSignInWindow(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
