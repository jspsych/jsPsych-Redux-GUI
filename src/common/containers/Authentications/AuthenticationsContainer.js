import { connect } from 'react-redux';
import Authentications from '../../components/Authentications';


export const load = ({dispatch}) => {
	// myaws.Auth.signOut();
	return dispatch((dispatch, getState) => {
		return myaws.Auth.setCredentials().then(myaws.Auth.getCurrentUserInfo).then(data => {
			// break the promise chain when there is no user signed in
			if (data === null) {
				throw new errors.NoCurrentUserException();
			} 

			let { userId } = data;

			return Promise.all([
				myaws.DynamoDB.getLastModifiedExperimentOf(userId),
				myaws.DynamoDB.getUserDate(userId)
			]).then(results => {
				let [ experimentState, userDataResponse ] = results;

				// load states
				if (experimentState) {
					dispatch(actions.actionCreator({
						type: actions.ActionTypes.LOAD_EXPERIMENT,
						experimentState
					}));
				}
				let userState = userDataResponse.Item.fetch;

				dispatch(actions.actionCreator({
					type: actions.ActionTypes.LOAD_USER,
					userState
				}));

				return Promise.resolve();
			});
		}).catch(err => {
			// keep the chaining by throwing all other error except 
			// NoCurrentUserException
			if (err.code === 'NoCurrentUserException') {
				console.log(err.message);
			} else {
				console.log(err)
				throw err;
			}
		})
	})
}

export const saveExperiment = ({dispatch}) => {
	return dispatch((dispatch, getState) => {
		let { userState } = getState();
		dispatch(actions.actionCreator({
			type: actions.ActionTypes.PREPARE_SAVE_EXPERIMENT,
			userId: userState.userId
		}));
		return myaws.DynamoDB.saveExperiment(getState().experimentState);
	})
}

const signIn = ({dispatch, username, password, firstSignIn=false}) => {
	return dispatch((dispatch, getState) => {
		return myaws.Auth.signIn({
			username,
			password
		}).then((userInfo) => {
			// if it is first time signing in
			// register user in DynamoDB
			if (firstSignIn) {
				let { userId, username, email } = userInfo;

				return myaws.DynamoDB.saveUserData({
					...core.getInitUserState(),
					userId,
					username,
					email
				});
			}

			return Promise.resolve();
		}).then(() => {
			// if user has changed anything
			// save the change
			// testing stage
			let anyChange = utils.deepEqual(core.getInitExperimentState(), getState().experimentState) && false;
			if (anyChange) {
				return saveExperiment({dispatch});
			}

			return Promise.resolve();
		}).catch((err) => {
			if (err.code === "UserNotConfirmedException") {
				popVerification({
					dispatch,
					signInCallback: () => {
						return signIn({
							dispatch,
							username,
							password,
							firstSignIn
						});
					}
				});
			} else {
				throw err;
			}
		});
	});
}

const signUp = ({dispatch, username, password, attributes, ...options}) => {
	return myaws.Auth.signUp({username, password, attributes, ...options}).then(() => {
		popVerification({
			dispatch,
			signInCallback: () => {
				return signIn({
					dispatch,
					username,
					password,
					firstSignIn: true,
				})
			}
		});
	});
}

const handleWindowClose = ({dispatch}) => {
	dispatch(actions.actionCreator({
		type: actions.ActionTypes.SET_AUTH_WINDOW,
		open: false
	}));
}

export const popSignIn = ({dispatch}) => {
	dispatch(actions.actionCreator({
		type: actions.ActionTypes.SET_AUTH_WINDOW,
		open: true,
		loginMode: enums.AUTH_MODES.signIn
	}));
}

export const popRegister = ({dispatch}) => {
	dispatch(actions.actionCreator({
		type: actions.ActionTypes.SET_AUTH_WINDOW,
		open: true,
		loginMode: enums.AUTH_MODES.register
	}));
}

export const popForgetPassword = ({dispatch}) => {
	dispatch(actions.actionCreator({
		type: actions.ActionTypes.SET_AUTH_WINDOW,
		open: true,
		loginMode: enums.AUTH_MODES.forgotPassword
	}));
}

export const popVerification = ({dispatch, ...args}) => {
	dispatch(actions.actionCreator({
		type: actions.ActionTypes.SET_AUTH_WINDOW,
		open: true,
		loginMode: enums.AUTH_MODES.verification,
		...args
	}));
}

const setLoginMode = ({dispatch, mode}) => {
	dispatch(actions.actionCreator({
		type: actions.ActionTypes.SET_AUTH_WINDOW,
		loginMode: mode
	}));
}

const mapStateToProps = (state, ownProps) => {
  return {
  	...state.authentications
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	signIn: ({...args}) => signIn({dispatch, ...args}),
	signUp: ({...args}) => signUp({dispatch, ...args}),
	load: () => load({dispatch}),
	handleWindowClose: () => handleWindowClose({dispatch}),
	popSignIn: () => popSignIn({dispatch}),
	popRegister: () => popRegister({dispatch}),
	popForgetPassword: () => popForgetPassword({dispatch}),
	popVerification: () => popVerification({dispatch}),
	setLoginMode: (mode) => setLoginMode({dispatch, mode}), 
})

export default connect(mapStateToProps, mapDispatchToProps)(Authentications);
