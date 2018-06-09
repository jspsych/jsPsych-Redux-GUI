import { connect } from 'react-redux';
import Appbar from '../../components/Appbar';

import * as experimentSettingActions from '../../actions/experimentSettingActions';
import * as backendActions from '../../actions/backendActions';

import { pushState } from '../../backend/dynamoDB';


export const pureSaveFlow = (dispatch, getState) => {
	dispatch(backendActions.clickSavePushAction());
	return pushState(getState());
}

export const $save = (dispatch, getState) => {
	return pureSaveFlow(dispatch, getState).then(
		() => {
		}, (err) => {
		});
}

const changeExperimentName = (dispatch, text) => {
	text = utils.toNull(text);
	dispatch(experimentSettingActions.setExperimentNameAction(text));
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

const clickSaveAs = ({dispatch, newName}) => {
	return dispatch((dispatch, getState) => {
		let sourceExperimentId = getState().experimentState.experimentId,
			userId = getState().userState.userId;

		dispatch(actions.actionCreator({
			type: actions.ActionTypes.PREPARE_SAVE_EXPERIMENT_AS,
			newName
		}));

		let targetExeprimentId = getState().experimentState.experimentId;

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
		}).then(() => {
			return utils.commonFlows.saveExperiment({
				dispatch
			});
		}).catch((err) => {
			console.log(err);
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
		experimentName: utils.toEmptyString(state.experimentState.experimentName),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatch,
	changeExperimentName: (text) => { changeExperimentName(dispatch, text); },
	clickSaveAs: ({newName}) => clickSaveAs({dispatch, newName}),
	clickSave: () => clickSave({dispatch}),
	clickNewExperiment: () => clickNewExperiment({dispatch})
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);