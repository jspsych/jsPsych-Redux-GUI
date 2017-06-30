import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions' ;
import * as backendActions from '../../actions/backendActions' ;
import Login from '../../components/Login';
import { LoginModes } from '../../reducers/User';
import { signUpPush, signInFetchUserData, fetchExperimentById } from '../../backend/dynamoDB';

const handleClose = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(false));
}

const popVerification = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(true, LoginModes.verification));
}

const setLoginMode = (dispatch, mode) => {
	dispatch(userActions.setLoginWindowAction(true, mode))
}

/*
Save/fetch case: sign in .

0. Process state
1. update user data locally
if there is any change in experiment:
	2. update user data remotely
	3. update experiment data remotely
else:
	2. update experiment data locally
*/
const signIn = (dispatch) => {
	dispatch((dispatch, getState) => {
		// sign in handled by cognito first
		// sync user state from local storage
		dispatch(userActions.signInAction());

		// fetch user data
		signInFetchUserData(getState().userState).then((data) => {
			// update user data locally
			dispatch(backendActions.signInPullAction(data, null));
		}).then(() => {
			// if there is any change
			if (getState().experimentState.anyChange) {
				// almost same logic with signUp since we are
				// 1. updating user data anyway (due to new experiment)
				// 2. inserting a new experiment to data base as well
				dispatch(backendActions.signUpPushAction());
				signUpPush(getState());
			} else {
				// if there is no change
				// 1. Fetch last editted experiment data
				// 2. Update experiment state locally
				fetchExperimentById(
					getState().userState.lastEdittingId,
					).then(
					(data) => {
						dispatch(backendActions.signInPullAction(null, data));
					}
				)
			}
		})
	})
}

/*
Save case: create account.

0. Process state
1. inserting new user to database
2. inserting new experiment if there is one
*/
const signUp = (dispatch) => {
	dispatch((dispatch, getState) => {
		dispatch(backendActions.signUpPushAction());
		signUpPush(getState());
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
