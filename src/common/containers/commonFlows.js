export const load = ({dispatch}) => {
	// myaws.Auth.signOut();
	return dispatch((dispatch, getState) => {
		return myaws.Auth.setCredentials().then(myaws.Auth.getCurrentUserInfo).then(data => {
			// Save initial experiment state to local storage
			// break the promise chain when there is no user signed in
			if (data === null) {
				saveExperimentStateToLocal(core.getInitExperimentState());
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
					// Save state to local storage
					saveExperimentStateToLocal(experimentState);

					// load experiment state
					dispatch(actions.actionCreator({
						type: actions.ActionTypes.LOAD_EXPERIMENT,
						experimentState
					}));
				}

				// load user state
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
				return Promise.reject(err);
			}
		})
	})
}

export const saveExperiment = ({dispatch}) => {
	return dispatch((dispatch, getState) => {
		return myaws.Auth.getCurrentUserInfo().then((userInfo) => {
			// pre-process experiment state for pushing to AWS
			dispatch(actions.actionCreator({
				type: actions.ActionTypes.PREPARE_SAVE_EXPERIMENT,
				userId: userInfo.userId
			}));

			// Get newest experiment state and push it to AWS
			return myaws.DynamoDB.saveExperiment(getState().experimentState);
		}).then(() => {
			// Update local storage 
			saveExperimentStateToLocal(getState().experimentState);
			// notify success
			utils.notifications.notifySuccessBySnackbar({
				dispatch,
				message: "Saved !"
			});
		}).catch((err) => {
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
		});
	})
}



const Jspsych_Experiment_Local_Storage = '$Jspsych_Experiment_Local_Storage';
export const saveExperimentStateToLocal = (state) => {
	window.localStorage.setItem(Jspsych_Experiment_Local_Storage, JSON.stringify(state));
}

export const getExperimentStateFromLocal = () => {
	let lastExperimentStateString = window.localStorage.getItem(Jspsych_Experiment_Local_Storage);
	if (!lastExperimentStateString) {
		saveExperimentStateToLocal(core.getInitExperimentState());
		return getExperimentStateFromLocal();
	} else {
		return JSON.parse(lastExperimentStateString);
	}
}

export const anyExperimentChange = (currentExperimentState) => !utils.deepEqual(getExperimentStateFromLocal(), currentExperimentState);

export const isUserSignedIn = () => {
	return myaws.Auth.getCurrentUserInfo().then((userInfo) => {
		return !!userInfo;
	}).catch((err) => {
		return Promise.resolve(false)
	});
}