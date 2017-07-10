import { connect } from 'react-redux';
import MediaManager, { MediaManagerMode } from '../../components/MediaManager';
import * as userActions from '../../actions/userActions' ;
import * as trialFormActions from '../../actions/trialFormActions';
import { LoginModes } from '../../reducers/User';
import * as notify from '../Notification';
import {
	uploadFiles as $uploadFiles,
	deleteFiles as $deleteFiles,
	listBucketContents as $listBucketContents
} from '../../backend/s3';
import { convertEmptyStringToNull } from '../../utils';
import { MediaObject, isS3MediaType } from '../../backend/deploy';
import { isTimeline } from '../../reducers/Experiment/utils';

const uploadFiles = (dispatch, files, setState, progressHook) => {
	dispatch((dispatch, getState) => {
		$uploadFiles(files, getState().experimentState.experimentId, progressHook).then(() => {
			// update list
			updateFileList(dispatch, setState, "Uploaded !");
		}, (err) => {
			notify.notifyErrorByDialog(dispatch, err.message);
		}).then(() => {
			// on finish
			setState({
				completed: {}
			});
		})
	});
}

const deleteFiles = (dispatch, filePaths, setState) => {
	$deleteFiles(filePaths).then((data) => {
		updateFileList(dispatch, setState, "Deleted !");
	}, (err) => {
		notify.notifyErrorByDialog(dispatch, err.message);
	});
}

const updateFileList = (dispatch, setState, feedback=null) => {
	dispatch((dispatch, getState) => {
		if (!getState().experimentState.experimentId) return;
		$listBucketContents(getState().experimentState.experimentId).then((data) => {
			setState({
				s3files: data,
				selected: data.Contents.map((d) => (false)),
				filenames: data.Contents.map((f) => (f.Key.replace(data.Prefix, '')))
			});
			if (feedback) {
				notify.notifySuccessBySnackbar(dispatch, feedback);
			}
		}, (err) => {
			notify.notifyErrorByDialog(dispatch, err.message);
		});
	})
}

const insertFile = (dispatch, ownProps, filePaths, prefix, handleClose) => {
	if (filePaths.length === 0) {
		return;
	}
	if (ownProps.mode === MediaManagerMode.select) {
		if (filePaths.length > 1) {
			notify.notifyWarningByDialog(dispatch, "You can insert only one file here !");
			return;
		}
		filePaths = MediaObject(convertEmptyStringToNull(filePaths[0].replace(prefix, '')), prefix);
	} else {
		filePaths = MediaObject(filePaths.map((f) => (f.replace(prefix, ''))), prefix);
	}
	
	dispatch(trialFormActions.setPluginParamAction(ownProps.parameterName, filePaths));
	notify.notifySuccessBySnackbar(dispatch, "Media Inserted !");
	handleClose();
}

const autoFileInput = (dispatch, ownProps, filename, prefix, filenames) => {
	if (filenames.indexOf(filename) < 0) return;
	dispatch(trialFormActions.setPluginParamAction(ownProps.parameterName, MediaObject(filename, prefix)));
}

const checkBeforeOpen = (dispatch, handleOpen) => {
	dispatch((dispatch, getState) => {
		// not logged in
		if (!getState().userState.user.identityId) {
			notify.notifyWarningBySnackbar(dispatch, 'You need to sign in before uploading your resources !');
			dispatch(userActions.setLoginWindowAction(true, LoginModes.signIn));
			return;
		}
		// unregistered experiment
		if (!getState().experimentState.experimentId) {
			notify.notifyWarningByDialog(dispatch, 'You need to save this experiment before uploading your resources !');
			return;
		}

		handleOpen();
	})
}

/*
Note that FOR NOW AWS S3 Media Type Object MUST be in the first level
of trial.paramters
*/
const mapStateToProps = (state, ownProps) => {
	let node = state.experimentState[state.experimentState.previewId];
	if (!node || isTimeline(node)) {
		return {};
	}
	let selected = "", item;
	for (let key of Object.keys(node.parameters)) {
		item = node.parameters[key];
		if (isS3MediaType(item)) {
			selected = JSON.stringify(item.filename).replace(/^"(.+(?="$))"$/, '$1');
		}
	}
 	return {
 		selected: selected
 	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	uploadFiles: (files, setState, progressHook) => { uploadFiles(dispatch, files, setState, progressHook); },
	updateFileList: (setState) => { updateFileList(dispatch, setState); },
	deleteFiles: (filePaths, setState) => { deleteFiles(dispatch, filePaths, setState); },
	checkBeforeOpen: (handleOpen) => { checkBeforeOpen(dispatch, handleOpen); },
	insertFile: (filePaths, prefix, handleClose) => { insertFile(dispatch, ownProps, filePaths, prefix, handleClose); },
	autoFileInput: (filename, prefix, filenames) => { autoFileInput(dispatch, ownProps, filename, prefix, filenames); },
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaManager);
