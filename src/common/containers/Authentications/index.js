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

					console.log(results)
					/*
						To Do
						Dispatch to Redux Store
					*/
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


export const signIn = ({dispatch, username, password, firstSignIn=false}) => {
	return myaws.Auth.signIn({username, password}).then((userInfo) => {
		if (!userInfo.verified) {
			throw new errors.NotVerifiedException();
		}

		if (firstSignIn) {
			/*
			To do

			update redux state
			*/
			return myaws.DynamoDB.saveUserData(getState().userState);
		}
		return Promise.resolve();
	}).then(() => {
		/*
		To do

		Check if user has changed experiment, if yes save if
		*/
		let anyChange = false;
		if (anyChange) {
			/*
			To do

			update redux state
			*/
			return myaws.DynamoDB.saveExperiment(getState().experimentState);
		} else {
			return Promise.resolve();
		}
	}).then(() => {
		return load(dispatch);
	})
}

const signUp = ({dispatch, username, password, email}) => {
	return myaws.Auth.signUp({username, password, email}).then(() => {
		return signIn({dispatch, username, password});
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
