import { connect } from 'react-redux';
import deepEqual from 'deep-equal';
import * as backendActions from '../../../../actions/backendActions';
import ExperimentList from '../../../../components/Appbar/UserMenu/ExperimentList';
import * as Errors from '../../../../constants/Errors' ;
import { $save } from '../../index';
import {
	fetchExperimentById,
	pushUserData,
	deleteExperiment as $deleteExperiment,
	pushExperimentData,
	// pushState
} from '../../../../backend/dynamoDB';
import {
	deleteFiles,
	generateCopyParam,
	copyFiles,
	listBucketContents
} from '../../../../backend/s3';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	// notifyWarningBySnackbar
} from '../../../Notification';
import { pureCloudDelete as cloudDelete } from '../../CloudDeploymentManager';
import { getDefaultInitCloudDeployInfo, getDefaultInitDiyDeployInfo } from '../../../../reducers/Experiment';

const $pullExperiment = (dispatch, getState, selected) => {
	// fetch experiment
	return fetchExperimentById(selected).then((data) => {
		if (!data) {
			throw Errors.internetError;
		}
		// set lastModifiedExperiment id
		dispatch(backendActions.pullExperimentAction(data));
	}).then(() => {
		// update user state on dynamoDB
		pushUserData(getState().userState).then(() => {}, (err) => {
			notifyErrorByDialog(dispatch, err.message);
		});
	}).catch((err) => {
		notifyErrorByDialog(dispatch, err.message);
	});
}

/*
Fetch experiment data
Expected behavior:
1. check if save currently open experiment
2. Fetch experiment state, and update lastModifiedExperimentId property
   of user state and replace current experiment state
   and update lastModifiedExperimentState (for checking if need saving)
3. Update user state on dynamoDB

*/
const pullExperiment = (dispatch, selected, popUpConfirm, onStart, onFinish) => {
	if (!selected) return;
	dispatch((dispatch, getState) => {
		// check if save current experiment
		if (getState().experimentState.experimentId === selected) return;
		if (deepEqual(
				getState().userState.lastModifiedExperimentState,
				getState().experimentState)) {
			onStart();
			$pullExperiment(dispatch, getState, selected).finally(() => {
				onFinish();
			});
			return;
		}
		popUpConfirm(
			"Do you want to save the changes before creating new experiment?",
			() => {
				onStart();
				// save current first
				$save(dispatch, getState).then(() => {
					// do the pull
					$pullExperiment(dispatch, getState, selected);
				}, (err) => {
					notifyErrorByDialog(dispatch, err.message);
				}).finally(() => {
					onFinish();
				});
			},
			"Yes (Continue with saving)",
			() => {
				onStart();
				$pullExperiment(dispatch, getState, selected).finally(() => {
					onFinish();
				});
			},
			"No (Continue without saving)"
		);
	});
}

/*
Delete experiment
Expected behavior:
1. Pop up confirmation
2. Fetch experiment state
	Delete corresponding s3 folder
3. Unregister the fetched experiment from user
4. Update user state on dynamoDB, delete experiment state from dynamoDB
*/
const deleteExperiment = (dispatch, id, popUpConfirm, onStart, onFinish) => {
	dispatch((dispatch, getState) => {
		let experiment = null;
		for (let item of getState().userState.experiments) {
			if (item.id === id) {
				experiment = item;
				break;
			}
		}
		// double check
		if (!experiment) return;
		popUpConfirm(
			"Are you sure that you want to delete experiment: " + experiment.name + "?",
			() => {
				onStart();				
				Promise.all([
					// cloudDelete(id),
					// fetch experiment state
					fetchExperimentById(id).then((data) => {
						if (!data || !data.Item) {
							throw Errors.internetError;
						}
						let filepaths = (data.Item.fetch.media.Contents) ? data.Item.fetch.media.Contents.map((f) => (f.Key)) : [];

						return Promise.all([
							// delete it from dynamoDB
							$deleteExperiment(id),
							// delete corresponding s3 files
							deleteFiles(filepaths),
						]).then(() => {
							// update user state on dynamoDB
							dispatch(backendActions.deleteExperimentAction(id));
							return pushUserData(getState().userState);
						})
					})
				]).catch((err) => {
					notifyErrorByDialog(dispatch, err.message);
				}).finally(() => {
					notifySuccessBySnackbar(dispatch, "Deleted !");
					onFinish();
				});
			},
			"Yes, I want to delete it.",
			() => {},
			"No, hold on.",
			false
		);
	});
}


/*
Duplication
Expected behavior:
1. Fetch experiment state from dynamoDB
	Copy it and assign new id and related details
2. Duplicate resources over S3 and update experimentState media property
3. Register the new experiment under user
4. Push experiment state and user state
*/
const duplicateExperiment = (dispatch, id, onStart, onFinish) => {
	dispatch((dispatch, getState) => {
		onStart();
		// fetch experiment
		fetchExperimentById(id).then((data) => {
			if (!data) {
				throw Errors.internetError;
			}
			let now = Date.now();
			let newId = utils.getUUID();
			// assign new id, date
			let experimentState = Object.assign({}, data.Item.fetch, {
				experimentId: newId,
				experimentDetails: Object.assign({}, data.Item.fetch.experimentDetails, {
					createDate: now,
					lastEditDate: now,
				}),
				cloudDeployInfo: getDefaultInitCloudDeployInfo(),
				diyDeployInfo: getDefaultInitDiyDeployInfo(),
			});

			// duplicate resources saved on s3
			let params = (data.Item.fetch.media.Contents) ? data.Item.fetch.media.Contents.map((f) =>
				(generateCopyParam({source: f.Key, target: f.Key.replace(data.Item.fetch.experimentId, newId)}))
			) : [];
			// duplicate s3 files
			copyFiles({params: params}).then((data) => {
				cloudDelete(experimentState.experimentId),
				// fetch new media
				listBucketContents(
					{Prefix: `${getState().userState.user.identityId}/${experimentState.experimentId}/`}
					).then((data) => {
					// update media property
					experimentState.media = data;
					// process state: register this duplicated experiment under user
					dispatch(backendActions.duplicateExperimentAction({
						id: experimentState.experimentId,
						name: experimentState.experimentName,
						details: experimentState.experimentDetails
					}));
					// update user state and experiment state on dynamDB
					pushUserData(getState().userState).then(() => {
						pushExperimentData(experimentState).then(() => {
							notifySuccessBySnackbar(dispatch, "Duplicated !");
						}, (err) => {
							notifyErrorByDialog(dispatch, err.message);
						})
					}, (err) => {
						notifyErrorByDialog(dispatch, err.message);
					});
				}, (err) => {
					notifyErrorByDialog(dispatch, err.message);
				})
			}, (err) => {
				notifyErrorByDialog(dispatch, err.message);
			});
		}).catch((err) => {
			notifyErrorByDialog(dispatch, err.message);
		}).finally(() => {
			onFinish();
		});
	});
}


const mapStateToProps = (state, ownProps) => {
	let experiments = state.userState.experiments.slice();
	// sort by last modified date (new --> old)
	experiments.sort((a, b) => {
		let at = a.details.lastEditDate, bt = b.details.lastEditDate;
		if (at > bt) {
			return -1;
		} else if (at < bt) {
			return 1;
		} else {
			return 0;
		}
	})
	let currentId =  state.userState.lastModifiedExperimentId, index = -1;
	for (let i = 0; i < experiments.length; i++) {
		if (experiments[i].id === currentId) {
			index = i;
			break;
		}
	}
	// put currently open first
	if (index > 0) {
		experiments.move(index, 0);
	}

	return {
		experiments: experiments,
		currentId: currentId
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	pullExperiment: (selected, popUpConfirm, onStart, onFinish) => { 
		pullExperiment(dispatch, selected, popUpConfirm, onStart, onFinish); 
	},
	deleteExperiment: (id, popUpConfirm, onStart, onFinish) => { deleteExperiment(dispatch, id, popUpConfirm, onStart, onFinish); },
	duplicateExperiment: (id, onStart, onFinish) => { duplicateExperiment(dispatch, id, onStart, onFinish); },
})

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentList);
