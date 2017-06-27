import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions' ;
import Login from '../../components/Login';
import { LoginModes } from '../../reducers/User';

const handleClose = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(false));
}

const popVerification = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(true, LoginModes.verification));
}

const setLoginMode = (dispatch, mode) => {
	dispatch(userActions.setLoginWindowAction(true, mode))
}

const signIn = (dispatch, user) => {
	dispatch(userActions.signInAction(user))
}

const mapStateToProps = (state, ownProps) => {
  let userState = state.userState;
  return {
  	open: userState.windowOpen,
  	loginMode: userState.loginMode
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleClose: () => { handleClose(dispatch); },
	popVerification: () => { popVerification(dispatch); },
	setLoginMode: (mode) => { setLoginMode(dispatch, mode); },
	signIn: (user) => { signIn(dispatch, user); }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
