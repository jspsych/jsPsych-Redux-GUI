import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions' ;
import SignInWindow from '../../components/Login/SignInWindow';
import { LoginModes } from '../../reducers/User';

const popForgotPassword = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(true, LoginModes.forgotPassword))
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	popForgotPassword: () => { popForgotPassword(dispatch); },
})

export default connect(mapStateToProps, mapDispatchToProps)(SignInWindow);
