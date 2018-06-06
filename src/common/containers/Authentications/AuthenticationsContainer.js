import { connect } from 'react-redux';
import Authentications from '../../components/Authentications';


export const load = ({dispatch}) => {
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
				let [ experimentState, userState ] = results;
				console.log(results)
				console.log(results[1].Item)

				return;
				// load states
				if (experimentState) {
					dispatch(actions.actionCreator({
						type: actions.ActionTypes.LOAD_EXPERIMENT,
						experimentState
					}));
				}
				let userState = results[1].Item.fetch;
				dispatch(actions.actionCreator({
					type: actions.ActionTypes.LOAD_USER,
					userState
				}));

				return Promise.resolve();
			});
		}).catch(err => {
			// keep the chaining by throwing all other error except 
			// NoCurrentUserException
			if (err instanceof errors.NoCurrentUserException) {
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

const signIn = ({dispatch, username, password}) => {
	return dispatch((dispatch, getState) => {
		return myaws.Auth.signIn({username, password}).then(() => {
			// testing stage
			let anyChange = utils.deepEqual(core.getInitExperimentState(), getState().experimentState) && false;
			if (anyChange) {
				return saveExperiment({dispatch});
			}
			
			return Promise.resolve();
		}).then(() => {
			return load({dispatch});
		}).catch((err) => {
			if (err.code === "UserNotConfirmedException") {
	            popVerification({dispatch});
	        } else {
	        	throw err;
	        }
		});
	});
}

const signUp = ({dispatch, username, password, ...options}) => {
	return myaws.Auth.signUp({username, password, ...options}).then(() => {
		return myaws.Auth.signIn({
			username,
			password
		});
	}).then((userInfo) => {
		let { userId, username, email } = userInfo
		return myaws.DynamoDB.saveUserData({
			...core.getInitUserState,
			userId,
			username,
			email
		});
	}).then(() => {
		return load({dispatch});
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

export const popVerification = ({dispatch}) => {
	dispatch(actions.actionCreator({
		type: actions.ActionTypes.SET_AUTH_WINDOW,
		open: true,
		loginMode: enums.AUTH_MODES.verification
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
