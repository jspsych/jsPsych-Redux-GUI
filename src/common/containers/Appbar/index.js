import { connect } from 'react-redux';
import * as experimentSettingActions from '../../actions/experimentSettingActions';
import * as backendActions from '../../actions/backendActions';
import * as notificationActions from '../../actions/notificationActions' ;
import * as userActions from '../../actions/userActions' ;
import Appbar from '../../components/Appbar';
import { pushState, fetchExperimentById } from '../../backend/dynamoDB';
import { Notify_Method, Notify_Type } from '../../reducers/Notification';
import { LoginModes } from '../../reducers/User';
import { convertEmptyStringToNull, convertNullToEmptyString } from '../../utils';
var deepEqual = require('deep-equal');

const changeExperimentName = (dispatch, text) => {
	text = convertEmptyStringToNull(text);
	dispatch(experimentSettingActions.setExperimentNameAction(text));
}

const save = (dispatch, onStart=()=>{}, onFinish=()=>{}) => {
	dispatch((dispatch, getState) => {
		// not logged in
		if (!getState().userState.user.identityId) {
			dispatch(notificationActions.notifyAction(
				Notify_Method.snackbar,
				Notify_Type.warning,
				'You need to sign in before saving your work !'));
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
				// process state
				dispatch(backendActions.clickSavePushAction());
				// push change
				pushState(getState()).catch((err) => {
					dispatch(notificationActions.notifyAction(
						Notify_Method.dialog,
						Notify_Type.error,
						err.message));
					// feedback
				}).then(() => {
					dispatch(notificationActions.notifyAction(
						Notify_Method.snackbar,
						Notify_Type.success,
						'Saved !'));
				});
			} else {
				dispatch(notificationActions.notifyAction(
					Notify_Method.snackbar,
					Notify_Type.warning,
					'Nothing has changed since last save !'));
			}
		}).catch((err) => {
			dispatch(notificationActions.notifyAction(
				Notify_Method.dialog,
				Notify_Type.error,
				err.message));
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
					// process state
					dispatch(backendActions.clickSavePushAction());
					// push change
					pushState(getState()).then(() => {
						dispatch(notificationActions.notifyAction(
						Notify_Method.snackbar,
						Notify_Type.success,
						'Saved !'));
					}).then(() => {
						dispatch(backendActions.newExperimentAction());
					}).catch((err) => {
						dispatch(notificationActions.notifyAction(
							Notify_Method.dialog,
							Notify_Type.error,
							err.message));
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
			dispatch(notificationActions.notifyAction(
				Notify_Method.snackbar,
				Notify_Type.warning,
				'You need to sign in before saving your work !'));
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
			dispatch(notificationActions.notifyAction(
				Notify_Method.dialog,
				Notify_Type.error,
				err.message));
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