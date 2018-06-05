import { connect } from 'react-redux';
import Authentications from '../../components/Authentications';


export const load = (dispatch) => {
	return dispatch((dispatch, getState) => {
		return myaws.Auth.setCredentials().then(myaws.Auth.getCurrentUserInfo).then(data => {
			// break the promise chain when there is no user signed in
			if (data === null) {
				throw new errors.NoCurrentUserException();
			} 
			if (!data.verified) {
				throw new errors.NotVerifiedException();
			} else {
				let { userId } = data;
				return Promise.all([
					myaws.DynamoDB.getLastModifiedExperimentOf(userId),
					myaws.DynamoDB.getUserDate(userId)
				]).then(results => {
					let [ experimentState, userState ] = results;

					console.log(results);

					// load states
					if (experimentState) {
						dispatch(actions.actionCreator({
							type: actions.ActionTypes.LOAD_EXPERIMENT,
							experimentState
						}));
					}
					dispatch(actions.actionCreator({
						type: actions.ActionTypes.LOAD_USER,
						userState
					}));
				})
			}
		}).catch(err => {
			// keep the chaining by throwing all other error except 
			// NoCurrentUserException
			if (!(err instanceof errors.NoCurrentUserException)) {
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
	return myaws.Auth.signIn({username, password}).then((userInfo) => {
		if (!userInfo.verified) {
			throw new errors.NotVerifiedException();
		}

		// Save/Register the user state to DynamoDB 
		if (firstSignIn) {
			let { userId, username, email } = userInfo
			return myaws.DynamoDB.saveUserData({
				...core.getInitUserState,
				userId,
				username,
				email
			});
		}
		return Promise.resolve();
	}).then(() => {

		let anyChange = utils.deepEqual(core.getInitExperimentState, getState().experimentState);
		if (anyChange) {
			return saveExperiment({dispatch});
		} else {
			return Promise.resolve();
		}
	}).then(() => {
		return load(dispatch);
	})
}

const signUp = ({dispatch, username, password, email}) => {
	return myaws.Auth.signUp({username, password, email}).then(() => {
		return signIn({dispatch, username, password, firstSignIn: true});
	})
}

const verify = ({dispatch, username, code}) => {
	return myaws.Auth.confirmSignUp({username, code}).then(() => {
		return load(dispatch);
	})
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	signIn: ({...args}) => signIn({dispatch, ...args}),
	signUp: ({...args}) => signUp({dispatch, ...args}),
	verify: ({...args}) => verify({dispatch, ...args})
})

export default connect(mapStateToProps, mapDispatchToProps)(Authentications);
