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

		onStart();
		fetchExperimentById(
			getState().experimentState.experimentId
		).then((data) => {
			if (!data) throw new Error('Network Failure');
			let fetched = data.Item.fetch;
			let anyChange = !deepEqual(fetched, getState().experimentState)
			return anyChange;
		}).then((anyChange) => {
			if (anyChange) {
				dispatch(backendActions.clickSavePushAction());
				pushState(getState()).catch((err) => {
					dispatch(notificationActions.notifyAction(
						Notify_Method.dialog,
						Notify_Type.error,
						err.message));
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
		}).then(() => { onFinish();});
	});
}

const newExperiment = (dispatch) => {
	dispatch((dispatch ,getState) => {
		dispatch(backendActions.newExperimentAction());
		// pushState(getState());
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
	newExperiment: () => { newExperiment(dispatch); },
	saveAs: (newName) => { saveAs(dispatch, newName); }
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);