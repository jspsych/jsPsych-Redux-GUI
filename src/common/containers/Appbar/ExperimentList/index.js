import { connect } from 'react-redux';
import deepEqual from 'deep-equal';
import * as backendActions from '../../../actions/backendActions';
import ExperimentList from '../../../components/Appbar/ExperimentList';
import * as Errors from '../../../constants/Errors' ;
import {
	fetchExperimentById,
	pushUserData,
	deleteExperiment as $deleteExperiment,
	pushExperimentData,
	pushState
} from '../../../backend/dynamoDB';
import {
	deleteFiles,
	copyParam,
	copyFiles,
	listBucketContents
} from '../../../backend/s3';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';
import { getUUID } from '../../../utils';

/*
Fetch experiment data
Sync and Process
Post new user data
*/
const pullExperiment = (dispatch, selected, popUpConfirm, onStart, onFinish) => {
	if (!selected) return;
	dispatch((dispatch, getState) => {
		if (getState().experimentState.experimentId === selected) return;
		if (deepEqual(
				getState().userState.lastModifiedExperimentState,
				getState().experimentState)) {
			onStart();
			$pullExperiment(dispatch, getState, selected).then(() => {
				onFinish();
			});
			return;
		}
		popUpConfirm(
			"Do you want to save the changes before creating new experiment?",
			() => {
				onStart();
				pushState(getState()).then(() => {
					$pullExperiment(dispatch, getState, selected);
				}, (err) => {
					notifyErrorByDialog(dispatch, err.message);
				}).then(() => {
					onFinish();
				});
			},
			"Yes (Continue with saving)",
			() => {
				onStart();
				$pullExperiment(dispatch, getState, selected).then(() => {
					onFinish();
				});
			},
			"No (Continue without saving)"
		);
	});
}

const $pullExperiment = (dispatch, getState, selected) => {
	return fetchExperimentById(selected).then((data) => {
		if (!data) {
			throw Errors.internetError;
		}
		dispatch(backendActions.pullExperimentAction(data));
	}).then(() => {
		pushUserData(getState().userState).then(() => {}, (err) => {
			notifyErrorByDialog(dispatch, err.message);
		});
	}).catch((err) => {
		notifyErrorByDialog(dispatch, err.message);
	});
}

/*
Delete experiment from database
successful: 
	update local state
	update user data remotely

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
				fetchExperimentById(id).then((data) => {
					if (!data) {
						throw Errors.internetError;
					}
					let filepaths = data.Item.fetch.media.Contents.map((f) => (f.Key));
					$deleteExperiment(id).then((data) => {
						deleteFiles(filepaths).then(() => {
							dispatch(backendActions.deleteExperimentAction(id));
							pushUserData(getState().userState).then(() => {
								notifySuccessBySnackbar(dispatch, "Deleted !");
							}, (err) => {
								notifyErrorByDialog(dispatch, err.message);
							});
						}, (err) => {
							notifyErrorByDialog(dispatch, err.message);
						})
					}, (err) => {
						notifyErrorByDialog(dispatch, err.message);
					}).then(() => {
						onFinish();
					});
				}).catch((err) => {
					notifyErrorByDialog(dispatch, err.message);
				});
			},
			"Yes, I want to delete it.",
			() => {},
			"No, hold on."
		);
	});
}


/*
Fetch experiment
Copy it and give new id
Process state
Update user data remotely
Push experiment
*/
const duplicateExperiment = (dispatch, id, onStart, onFinish) => {
	dispatch((dispatch, getState) => {
		onStart();
		fetchExperimentById(id).then((data) => {
			if (!data) {
				throw Errors.internetError;
			}
			let now = Date.now();
			let newId = getUUID();
			
			let experimentState = Object.assign({}, data.Item.fetch, {
				experimentId: newId,
				experimentDetails: Object.assign({}, data.Item.fetch.experimentDetails, {
					createDate: now,
					lastEditDate: now,
				})
			});

			let params = (data.Item.fetch.media.Contents) ? data.Item.fetch.media.Contents.map((f) =>
				(copyParam(f.Key, f.Key.replace(data.Item.fetch.experimentId, newId)))
			) : [];
			// duplicate s3 bucket
			copyFiles(params).then(() => {
				// fetch new media
				listBucketContents(newId).then((data) => {
					experimentState.media = data;
					dispatch(backendActions.duplicateExperimentAction({
						id: experimentState.experimentId,
						name: experimentState.experimentName,
						details: experimentState.experimentDetails
					}));
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
		}).then(() => {
			onFinish();
		});
	});
}


const mapStateToProps = (state, ownProps) => {
	let experiments = state.userState.experiments.slice();
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
