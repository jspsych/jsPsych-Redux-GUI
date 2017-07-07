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
import { MediaObject, isS3MediaType } from '../../reducers/Experiment/preview';
import { isTimeline } from '../../reducers/Experiment/utils';

const uploadFiles = (dispatch, files, setState) => {
	dispatch((dispatch, getState) => {
		// on start
		setState({
			uploadComplete: false
		});
		$uploadFiles(files, getState().experimentState.experimentId).then(() => {
			// update list
			updateFileList(dispatch, setState, "Uploaded !");
		}, (err) => {
			notify.notifyErrorByDialog(dispatch, err.message);
		}).then(() => {
			// on finish
			setState({
				uploadComplete: true
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
		$listBucketContents(getState().experimentState.experimentId).then((data) => {
			setState({
				s3files: data,
				selected: data.Contents.map((d) => (false)),
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
	notify.notifySuccessBySnackbar(dispatch, "Resource Appended !");
	handleClose();
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
	uploadFiles: (files, setState) => { uploadFiles(dispatch, files, setState); },
	updateFileList: (setState) => { updateFileList(dispatch, setState); },
	deleteFiles: (filePaths, setState) => { deleteFiles(dispatch, filePaths, setState); },
	checkBeforeOpen: (handleOpen) => { checkBeforeOpen(dispatch, handleOpen); },
	insertFile: (filePaths, prefix, handleClose) => { insertFile(dispatch, ownProps, filePaths, prefix, handleClose); },
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaManager);
