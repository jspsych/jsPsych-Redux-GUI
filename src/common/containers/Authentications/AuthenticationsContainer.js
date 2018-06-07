import { connect } from 'react-redux';
import Authentications from '../../components/Authentications';


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

				return myaws.DynamoDB.saveUserData(core.createUser({
					userId,
					username,
					email
				}));
			}

			return Promise.resolve();
		}).then(() => {
			// if user has changed anything
			// save the change

			let anyChange = !utils.deepEqual(core.getInitExperimentState(), getState().experimentState);
			if (anyChange) {
				return saveExperiment({dispatch});
			}

			return Promise.resolve();
		}).then(() => {
			return utils.commonFlows.load({dispatch});
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
	handleWindowClose: () => handleWindowClose({dispatch}),
	popSignIn: () => popSignIn({dispatch}),
	popRegister: () => popRegister({dispatch}),
	popForgetPassword: () => popForgetPassword({dispatch}),
	popVerification: () => popVerification({dispatch}),
	setLoginMode: (mode) => setLoginMode({dispatch, mode}), 
})

export default connect(mapStateToProps, mapDispatchToProps)(Authentications);
