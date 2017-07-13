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
import { pushExperimentData } from '../../backend/dynamoDB';
import { isTimeline } from '../../reducers/Experiment/utils';

const Upload_Limit_MB = 100; 
const Upload_Limit = Upload_Limit_MB  * 1024 * 1024;

const uploadFiles = (dispatch, files, setState, progressHook) => {
	for (let f of files) {
		if (f.size > Upload_Limit) {
			notify.notifyWarningBySnackbar(dispatch, "Exceed upload limit: " + Upload_Limit_MB + " MB !");
			return;
		}
	}
	dispatch((dispatch, getState) => {
		$uploadFiles(files, getState().experimentState.experimentId, progressHook).then(() => {
			// update list
			updateFileList(dispatch, "Uploaded !");
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

const deleteFiles = (dispatch, filePaths) => {
	$deleteFiles(filePaths).then((data) => {
		updateFileList(dispatch, "Deleted !");
	}, (err) => {
		notify.notifyErrorByDialog(dispatch, err.message);
	});
}

const updateFileList = (dispatch, feedback = null) => {
	dispatch((dispatch, getState) => {
		if (!getState().experimentState.experimentId) return;
		$listBucketContents(getState().experimentState.experimentId).then((data) => {
			dispatch(trialFormActions.updateMediaAction(data));

			pushExperimentData(getState().experimentState).then(() => {
				if (feedback) {
					notify.notifySuccessBySnackbar(dispatch, feedback);
				}
			}, (err) => {
				notify.notifyErrorByDialog(dispatch, err.message);
			})

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
	dispatch(trialFormActions.setPluginParamAction(ownProps.parameterName, MediaObject(filename, prefix)));
}

const fileArrayInput = (dispatch, ownProps, filelistStr, prefix, filenames) => {
	filelistStr = filelistStr.trim();
	let i = 0;
	let fileList = [];
	let ignoreSpace = false;
	let part = "", c = "";
	while (i < filelistStr.length) {
		c = filelistStr[i++];
		switch(c) {
			case ',':
				ignoreSpace = true;
				if (part.length > 0) {
					if (filenames.indexOf(part) === -1) {
						notify.notifyWarningByDialog(dispatch, `${part} is not found !`);
						return;
					}
					fileList.push(part);
					part = "";
				}
				break;
			case ' ':
				if (!ignoreSpace) part += c;
				break;
			default:
				part += c;
		}
	}
	if (part.length > 0) {
		if (filenames.indexOf(part) === -1) {
			notify.notifyWarningByDialog(dispatch, `${part} is not found !`);
			return;
		}
		fileList.push(part);
	}
	dispatch(trialFormActions.setPluginParamAction(ownProps.parameterName, MediaObject(fileList, prefix)));
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

	let selectedFilesString = "", item;
	if (node && !isTimeline(node)) {
		for (let key of Object.keys(node.parameters)) {
			item = (node.parameters[key]) ? node.parameters[key].value : null;
			if (isS3MediaType(item)) {
				if (Array.isArray(item.filename)) {
					let i = 0;
					for (let name of item.filename) {
						selectedFilesString += name + ((i++ < item.filename.length-1) ? ", " : "");
					}
				} else {
					selectedFilesString = item.filename;
				}
				
			}
		}
	}
	let filenames = [];
	let media = state.experimentState.media;
	if (media.Contents) {
		filenames = media.Contents.map((f) => (f.Key.replace(media.Prefix, '')));
	} 
	
 	return {
 		selectedFilesString: selectedFilesString,
 		s3files: media,
 		filenames: filenames,
 	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	uploadFiles: (files, setState, progressHook) => { uploadFiles(dispatch, files, setState, progressHook); },
	updateFileList: () => { updateFileList(dispatch); },
	deleteFiles: (filePaths) => { deleteFiles(dispatch, filePaths); },
	checkBeforeOpen: (handleOpen) => { checkBeforeOpen(dispatch, handleOpen); },
	insertFile: (filePaths, prefix, handleClose) => { insertFile(dispatch, ownProps, filePaths, prefix, handleClose); },
	autoFileInput: (filename, prefix, filenames) => { autoFileInput(dispatch, ownProps, filename, prefix, filenames); },
	fileArrayInput: (filelistStr, prefix, filenames) => { fileArrayInput(dispatch, ownProps, filelistStr, prefix, filenames); },
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaManager);
