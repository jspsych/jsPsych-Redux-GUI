import { connect } from 'react-redux';
import deepEqual from 'deep-equal';
import * as experimentSettingActions from '../../actions/experimentSettingActions';
import * as backendActions from '../../actions/backendActions';
import * as notificationActions from '../../actions/notificationActions' ;
import * as userActions from '../../actions/userActions' ;
import * as trialFormActions from '../../actions/trialFormActions';
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
import { diyDeploy as $diyDeploy } from '../../backend/deploy';
import {
	listBucketContents,
	copyParam,
	copyFiles,
} from '../../backend/s3';


const changeExperimentName = (dispatch, text) => {
	text = convertEmptyStringToNull(text);
	dispatch(experimentSettingActions.setExperimentNameAction(text));
}

const $save = (dispatch, getState) => {
	// process state
	dispatch(backendActions.clickSavePushAction());

	return pushState(getState()).then(
		() => {
			notifySuccessBySnackbar(dispatch, "Saved !");
		}, (err) => {
			notifyErrorByDialog(dispatch, err.message);
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
		let anyChange = !deepEqual(getState().userState.lastModifiedExperimentState,
			getState().experimentState)

		// if there is any change
		if (anyChange) {
			onStart();
			$save(dispatch, getState).then(() => {
				onFinish();
			});;
		} else {
			notifyWarningBySnackbar(dispatch, 'Nothing has changed since last save !');
		}
	});
}

const newExperiment = (dispatch, popUpConfirm) => {
	dispatch((dispatch ,getState) => {
		let anyChange = !deepEqual(
			getState().userState.lastModifiedExperimentState,
			getState().experimentState
		);
		if (anyChange) {
			popUpConfirm(
				"Do you want to save the changes before creating new experiment?",
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

const saveAs = (dispatch, newName, onStart, onFinish) => {
	dispatch((dispatch, getState) => {
		let oldExperimentId = getState().experimentState.experimentId;
		// process state, assign new id
		dispatch(backendActions.saveAsAction(newName));

		onStart();
		let experimentState = getState().experimentState;
		let params = (experimentState.media.Contents) ? experimentState.media.Contents.map((f) =>
			(copyParam(f.Key, f.Key.replace(oldExperimentId, experimentState.experimentId)))
		) : [];
		// s3 duplicate
		copyFiles(params).then(() => {
			listBucketContents(experimentState.experimentId).then((data) => {
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
		}).then(() => {
			onFinish();
		});


	});
}

const diyDeploy = (dispatch, progressHook) => {
	dispatch((dispatch, getState) => {
		$diyDeploy(getState(), progressHook);
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
	saveAs: (newName, onStart, onFinish) => { saveAs(dispatch, newName, onStart, onFinish); },
	saveAsOpen: (callback) => { saveAsOpen(dispatch, callback); },
	diyDeploy: (progressHook) => { diyDeploy(dispatch, progressHook); }
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);