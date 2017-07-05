import { connect } from 'react-redux';
import * as backendActions from '../../../actions/backendActions';

import ExperimentList from '../../../components/Appbar/ExperimentList';
import {
	fetchExperimentById,
	pushUserData,
	deleteExperiment as $deleteExperiment,
	pushExperimentData,
	pushState
} from '../../../backend/dynamoDB';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';
import { getUUID } from '../../../utils';
var deepEqual = require('deep-equal');

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
				getState().userState.lastEdittingExperimentState,
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
				pushState(
					getState()
				).then(() => {
					$pullExperiment(dispatch, getState, selected);
				}).catch((err) => {
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
			throw new Error("Your internet may be disconnected !");
		}
		dispatch(backendActions.pullExperimentAction(data));
	}).then(() => {
		pushUserData(getState().userState);
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
				$deleteExperiment(id).then((data) => {
					dispatch(backendActions.deleteExperimentAction(id));
					pushUserData(getState().userState);
				}).then(() => {
					notifySuccessBySnackbar(dispatch, "Deleted !");
				}).catch((err) => {
					notifyErrorByDialog(dispatch, err.message);
				}).then(() => {
					onFinish();
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
				throw new Error("Your internet may be disconnected !");
			}
			let now = Date.now();
			let experimentState = Object.assign({}, data.Item.fetch, {
				experimentId: getUUID(),
				experimentDetails: Object.assign({}, data.Item.fetch.experimentDetails, {
					createDate: now,
					lastEditDate: now,
				})
			});
			dispatch(backendActions.duplicateExperimentAction({
				id: experimentState.experimentId,
				name: experimentState.experimentName,
				details: experimentState.experimentDetails
			}));
			pushUserData(getState().userState).then(() => {
				pushExperimentData(experimentState)
			}).then(() => {
				notifySuccessBySnackbar(dispatch, "Duplicated !");
			}).catch((err) => {
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
	return {
		experiments: state.userState.experiments,
		currentId: state.userState.lastEdittingId
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
