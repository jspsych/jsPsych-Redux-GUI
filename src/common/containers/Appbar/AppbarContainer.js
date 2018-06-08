import { connect } from 'react-redux';

import * as experimentSettingActions from '../../actions/experimentSettingActions';
import * as backendActions from '../../actions/backendActions';
import * as userActions from '../../actions/userActions' ;
import * as editorActions from '../../actions/editorActions';
import Appbar from '../../components/Appbar';
import { LoginModes } from '../../reducers/User';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../Notification';
import { pushState } from '../../backend/dynamoDB';
import {
	listBucketContents,
	generateCopyParam,
	copyFiles,
} from '../../backend/s3';


const changeExperimentName = (dispatch, text) => {
	text = utils.toNull(text);
	dispatch(experimentSettingActions.setExperimentNameAction(text));
}

export const pureSaveFlow = (dispatch, getState) => {
	dispatch(backendActions.clickSavePushAction());
	return pushState(getState());
}

export const $save = (dispatch, getState) => {
	return pureSaveFlow(dispatch, getState).then(
		() => {
			notifySuccessBySnackbar(dispatch, "Saved !");
		}, (err) => {
			notifyErrorByDialog(dispatch, err.message);
		});
}

const clickSave = ({dispatch}) => {
	return dispatch((dispatch, getState) => {
		return utils.commonFlows.isUserSignedIn().then((signedIn) => {
			if (!signedIn) {
				utils.notifications.notifyWarningBySnackbar({
					dispatch,
					message: 'You need to sign in before saving your work !'
				});
			} else {
				if (utils.commonFlows.anyExperimentChange(getState().experimentState)) {
					return utils.commonFlows.saveExperiment({
						dispatch
					});
				} else {
					utils.notifications.notifyWarningBySnackbar({
						dispatch,
						message: 'Nothing has changed since last save !'
					})
				}
			}

			return Promise.resolve();
		}).catch((err) => {
			console.log(err)
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
		});
	});
}


const save = (dispatch, onStart = () => {}, onFinish = () => {}) => {
	dispatch((dispatch, getState) => {
		// not logged in
		if (!getState().userState.user.identityId) {
			notifyWarningBySnackbar(dispatch, 'You need to sign in before saving your work !');
			dispatch(userActions.setLoginWindowAction(true, LoginModes.signIn));
			return;
		}

		// on start effect
		let anyChange = !utils.deepEqual(getState().userState.lastModifiedExperimentState,
			getState().experimentState);

		// if there is any change
		if (anyChange) {
			onStart();
			$save(dispatch, getState).finally(() => {
				onFinish();
			});
		} else {
			notifyWarningBySnackbar(dispatch, 'Nothing has changed since last save !');
		}
	});
}


const clickNewExperiment = ({dispatch}) => {
	let loadNewExperiment = () => {
		dispatch(actions.actionCreator({
			type: actions.ActionTypes.LOAD_EXPERIMENT,
			experimentState: core.getInitExperimentState()
		}));
	}

	return dispatch((dispatch, getState) => {
		let { experimentState } = getState();
		if (utils.commonFlows.anyExperimentChange(getState().experimentState)) {
			utils.notifications.popUpConfirmation({
				dispatch: dispatch,
				message: "Do you want to save the changes before creating a new experiment?",
				continueWithOperation: () => {
					utils.commonFlows.saveExperiment({dispatch}).then(loadNewExperiment);
				},
				continueWithoutOperation: loadNewExperiment,
				continueWithOperationLabel: "Yes (Continue with saving)",
				continueWithoutOperationLabel: "No (Continue without saving)",
				showCancelButton: true,
				withExtraCare: true,
				extraCareText: experimentState.experimentId ? experimentState.experimentId : "Yes, I know what I am doing."
			});
		} else {
			loadNewExperiment();
		}
	});
}

const newExperiment = (dispatch, popUpConfirm) => {
	dispatch((dispatch ,getState) => {
		let anyChange = !utils.deepEqual(
			getState().userState.lastModifiedExperimentState,
			getState().experimentState
		);
		if (anyChange) {
			popUpConfirm(
				"Do you want to save the changes before creating a new experiment?",
				() => {
					$save(dispatch, getState).then(() => {
						dispatch(backendActions.newExperimentAction());
					});
				},
				"Yes (Continue with saving)",
				() => { dispatch(backendActions.newExperimentAction()); },
				"No (Continue without saving)"
			);
		} else {
			popUpConfirm(
				"Do you want to close the current experiment and open a new one?",
				() => {
					dispatch(backendActions.newExperimentAction());
				},
				"Yes, close it!",
				() => {},
				"No, hold on...",
				false
			);
		}
	});
}

const saveAsOpen = (dispatch, callback) => {
	dispatch((dispatch, getState) => {
		// not logged in
		if (!getState().userState.user.identityId) {
			notifyWarningBySnackbar(dispatch, 'You need to sign in before saving your work !');
			dispatch(userActions.setLoginWindowAction(true, LoginModes.signIn));
			return;
		} else {
			callback();
		}
	});
}

const saveAs = (dispatch, newName, onStart, onFinish) => {
	dispatch((dispatch, getState) => {
		let oldExperimentId = getState().experimentState.experimentId;
		// process state, assign new id
		dispatch(backendActions.saveAsAction(newName));

		onStart();
		let experimentState = getState().experimentState;
		let params = (experimentState.media.Contents) ? experimentState.media.Contents.map((f) =>
			(generateCopyParam({source: f.Key, target: f.Key.replace(oldExperimentId, experimentState.experimentId)}))
		) : [];
		// s3 duplicate
		copyFiles({params: params}).then(() => {
			listBucketContents({Prefix: `${getState().userState.user.identityId}/${getState().experimentState.experimentId}/`}).then((data) => {
				dispatch(editorActions.updateMediaAction(data));
				pushState(getState()).then(() => {
					notifySuccessBySnackbar(dispatch, "Saved !");
				}, (err) => {
					notifyErrorByDialog(dispatch, err.message);
				})
			}, (err) => {
				notifyErrorByDialog(dispatch, err.message);
			})
		}, (err) => {
			notifyErrorByDialog(dispatch, err.message);
		}).finally(() => {
			onFinish();
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
		experimentName: utils.toEmptyString(state.experimentState.experimentName),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	changeExperimentName: (text) => { changeExperimentName(dispatch, text); },
	save: (onStart, onFinish) => { save(dispatch, onStart, onFinish); },
	newExperiment: (popUpConfirm) => { newExperiment(dispatch, popUpConfirm); },
	saveAs: (newName, onStart, onFinish) => { saveAs(dispatch, newName, onStart, onFinish); },
	saveAsOpen: (callback) => { saveAsOpen(dispatch, callback); },
	clickSave: () => clickSave({dispatch}),
	clickNewExperiment: () => clickNewExperiment({dispatch})
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);