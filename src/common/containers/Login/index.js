import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions' ;
import * as backendActions from '../../actions/backendActions' ;
import Login from '../../components/Login';
import { LoginModes } from '../../reducers/User';
import { signUpSave, signInfetchUser, fetchExperimentById } from '../../backend/dynamoDB';

const handleClose = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(false));
}

const popVerification = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(true, LoginModes.verification));
}

const setLoginMode = (dispatch, mode) => {
	dispatch(userActions.setLoginWindowAction(true, mode))
}

const signIn = (dispatch) => {
	dispatch((dispatch, getState) => {
		// synchro sign action that update user info
		dispatch(userActions.signInAction());
		signInfetchUser(getState().userState).then((data) => {
			dispatch(backendActions.signInPullAction(data, null));
		}).then(() => {
			if (getState().experimentState.anyChange) {
				dispatch(backendActions.signUpAction());
				signUpSave(getState());
			} else {
				fetchExperimentById(
					getState().userState.lastEdittingId,
					getState().userState.loginSession
					).then(
					(data) => {
						dispatch(backendActions.signInPullAction(null, data));
					}
				)
			}
		})
	})
}

const signUp = (dispatch) => {
	dispatch((dispatch, getState) => {
		dispatch(backendActions.signUpAction());
		signUpSave(getState());
	});
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
	signIn: () => { signIn(dispatch); },
	signUp: () => { signUp(dispatch); },
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
