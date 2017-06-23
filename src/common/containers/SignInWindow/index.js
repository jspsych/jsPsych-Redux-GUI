import { connect } from 'react-redux';
import * as userMenuActions from '../../actions/userMenuActions';
import SignInWindow from '../../components/SignInWindow';

const hideSignInWindow = (dispatch) => {
  dispatch(userMenuActions.hideSignInWindow());
}

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.userState.signInWindowVisible
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  hideSignInWindow: () => { hideSignInWindow(dispatch); }
})

export default connect(mapStateToProps, mapDispatchToProps)(SignInWindow);
