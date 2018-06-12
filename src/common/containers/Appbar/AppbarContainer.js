import { connect } from 'react-redux';
import Appbar from '../../components/Appbar';

import * as experimentSettingActions from '../../actions/experimentSettingActions';


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
					return utils.commonFlows.saveCurrentExperiment({ dispatch });
				} else {
					utils.notifications.notifyWarningBySnackbar({
						dispatch,
						message: 'Nothing has changed since last save !'
					});
				}
			}

			return Promise.resolve();
		}).catch((err) => {
			console.log(err);
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
		});
	});
}

const clickNewExperiment = ({dispatch}) => {
	let loadNewExperiment = () => {
		dispatch((dispatch, getState) => {
			let newExperiment = core.getInitExperimentState();
			dispatch(actions.actionCreator({
				type: actions.ActionTypes.LOAD_EXPERIMENT,
				experimentState: core.registerExperiment({
					experimentState: newExperiment,
					userId: getState().userState.userId
				}),
			}));
		});
	}

	return dispatch((dispatch, getState) => {
		let { experimentState } = getState();
		if (utils.commonFlows.anyExperimentChange(getState().experimentState)) {
			utils.notifications.popUpConfirmation({
				dispatch: dispatch,
				message: "Do you want to save the changes before creating a new experiment?",
				continueWithOperation: () => {
					return utils.commonFlows.saveCurrentExperiment({dispatch}).then(loadNewExperiment);
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
		let sourceExperimentState = getState().experimentState;
		return utils.commonFlows.duplicateExperiment({
			dispatch,
			sourceExperimentState,
			newName
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