import { connect } from 'react-redux';
import utils.deepEqual from 'deep-equal';
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);