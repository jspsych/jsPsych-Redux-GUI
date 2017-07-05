import { connect } from 'react-redux';
import * as experimentSettingActions from '../../actions/experimentSettingActions';
import * as backendActions from '../../actions/backendActions';
import * as notificationActions from '../../actions/notificationActions' ;
import * as userActions from '../../actions/userActions' ;
import Appbar from '../../components/Appbar';
import { LoginModes } from '../../reducers/User';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../Notification';
import {
	convertEmptyStringToNull,
	convertNullToEmptyString
} from '../../utils';
import { pushState } from '../../backend/dynamoDB';
var deepEqual = require('deep-equal');

const changeExperimentName = (dispatch, text) => {
	text = convertEmptyStringToNull(text);
	dispatch(experimentSettingActions.setExperimentNameAction(text));
}

const $save = (dispatch, getState) => {
	// process state
	dispatch(backendActions.clickSavePushAction());

	return pushState(getState()).catch((err) => {
		notifyErrorByDialog(dispatch, err.message);
		// feedback
	}).then(() => {
		notifySuccessBySnackbar(dispatch, "Saved !");
	});
}

const save = (dispatch, onStart=()=>{}, onFinish=()=>{}) => {
	dispatch((dispatch, getState) => {
		// not logged in
		if (!getState().userState.user.identityId) {
			notifyWarningBySnackbar(dispatch, 'You need to sign in before saving your work !');
			dispatch(userActions.setLoginWindowAction(true, LoginModes.signIn));
			return;
		}

		// on start effect
		onStart();
		let p = Promise.resolve(
			!deepEqual(getState().userState.lastEdittingExperimentState, 
				getState().experimentState)
			);

		p.then((anyChange) => {
			// if there is any change
			if (anyChange) {
				$save(dispatch, getState);
			} else {
				notifyWarningBySnackbar(dispatch, 'Nothing has changed since last save !');
			}
		}).catch((err) => {
			notifyErrorByDialog(dispatch, err.message);
		}).then(() => { onFinish(); });
	});
}

const newExperiment = (dispatch, popUpConfirm) => {
	dispatch((dispatch ,getState) => {
		let anyChange = !deepEqual(
			getState().userState.lastEdittingExperimentState,
			getState().experimentState
		);
		if (anyChange) {
			popUpConfirm(
				"Do you want to save the changes before creating new experiment?",
				() => {
					$save(dispatch, getState).then(() => {
						dispatch(backendActions.newExperimentAction());
					}).catch((err) => {
						notifyErrorByDialog(dispatch, err.message);
					})
				},
				"Yes (Continue with saving)",
				() => { dispatch(backendActions.newExperimentAction()); },
				"No (Continue without saving)"
			);
		} else {
			dispatch(backendActions.newExperimentAction());
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
		}
		callback();
	});
}

const saveAs = (dispatch, newName) => {
	dispatch((dispatch, getState) => {
		dispatch(backendActions.saveAsAction(newName));
		pushState(getState()).catch((err) => {
			notifyErrorByDialog(dispatch, err.message);
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
		experimentName: convertNullToEmptyString(state.experimentState.experimentName),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	changeExperimentName: (e, text) => { changeExperimentName(dispatch, text); },
	save: (onStart, onFinish) => { save(dispatch, onStart, onFinish); },
	newExperiment: (popUpConfirm) => { newExperiment(dispatch, popUpConfirm); },
	saveAs: (newName) => { saveAs(dispatch, newName); },
	saveAsOpen: (callback) => { saveAsOpen(dispatch, callback); }
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);