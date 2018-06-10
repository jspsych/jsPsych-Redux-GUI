export const loadExperimentAction = ({dispatch, experimentState}) => {
	// Save state to local storage
	saveExperimentStateToLocal(experimentState);

	// load experiment state
	dispatch(actions.actionCreator({
		type: actions.ActionTypes.LOAD_EXPERIMENT,
		experimentState
	}));
}

export const load = ({dispatch}) => {
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
					loadExperimentAction({
						dispatch,
						experimentState
					});
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

/*
* 1. Register experimentState for pushing to AWS,
* Fill in ownerId, experimentId, createDate if these info are missing,
* Update lastModifiedDate.
* 2. Push to DynamoDB
* 
* @param {Object} experimentState - experiment to be saved
* @param {String} userId - experiment's owner's id
* @return {Object} A promise resolves to the registered experiment if call to AWS is successful
*/
export const pushExperiment = ({experimentState, userId=null}) => {
	// Register experimentState for pushing to AWS
	// Fill in ownerId, experimentId, createDate if these info are missing
	// Update lastModifiedDate
	experimentState = core.registerExperiment({
		experimentState,
		userId
	});

	// Push to AWS
	return myaws.DynamoDB.saveExperiment(experimentState).then(() => {
		return Promise.resolve(experimentState);
	});
}

/*
* Wrapper of pushExperiment
* Helper for handling the action of saving experiment and giving user response
* 
*/
const $saveExperiment = ({dispatch, experimentState, userId=null, displayNotification=true}) => {
	// push experiment first
	return pushExperiment({
		experimentState,
		userId
	}).then((experimentState) => {
		// then sync locally

		// load saved experiment
		loadExperimentAction({
			dispatch,
			experimentState
		});
		// notify success
		if (displayNotification) {
			utils.notifications.notifySuccessBySnackbar({
				dispatch,
				message: "Saved !"
			});
		}
		return Promise.resolve();
	}).catch((err) => {
		console.log(err);
		utils.notifications.notifyErrorByDialog({
			dispatch,
			message: err.message
		});

		// pass on error
		return Promise.reject(err);
	});
}


/*
* Save the currently opened experiment
* 1. Call $saveExperiment
*/
export const saveCurrentExperiment = ({dispatch, displayNotification=true}) => {
	return dispatch((dispatch, getState) => {
		return myaws.Auth.getCurrentUserInfo().then((userInfo) => {
			return $saveExperiment({
				experimentState: getState().experimentState,
				userId: userInfo.userId,
				displayNotification,
				dispatch
			});
		});
	});
}

/*
* Duplicate and save the source experiment
* 1. Duplicate the experiment
* 2. Call $saveExperiment
*/
export const duplicateExperiment = ({sourceExperimentState, newName=null}) => {
	return dispatch((dispatch, getState) => {
		let sourceExperimentId = sourceExperimentState.experimentId,
			// process experiment state
			experimentState = core.duplicateExperiment({
				sourceExperimentState,
				newName
			}),
			targetExeprimentId = experimentState.experimentId,
			userId = sourceExperimentState.ownerId;

		// make sure assests are copied successfully before proceeding
		return duplicateS3Content({
			userId,
			sourceExperimentId,
			targetExeprimentId
		}).then(() => {
			return $saveExperiment({ 
				experimentState,
				userId
			});
		});
	});
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

const duplicateS3Content = ({userId, sourceExperimentId, targetExeprimentId}) => {
	return myaws.S3.listBucketContents({
		Prefix: `${userId}/${sourceExperimentId}/`
	}).then((data) => {
		let params = [];
		if (data) {
			params = data.Contents.map((f) => {
				return myaws.S3.generateCopyParam({
					source: f.Key,
					target: f.Key.replace(sourceExperimentId, targetExeprimentId)
				});
			});
			return myaws.S3.copyFiles({ params });
		} else {
			return Promise.resolve();
		}
	});
}