import { connect } from 'react-redux';
import MediaManager from '../../components/MediaManager';
import * as userActions from '../../actions/userActions' ;
import * as editorActions from '../../actions/editorActions';
import { LoginModes } from '../../reducers/User';
import * as notify from '../Notification';
import {
	uploadFiles as $uploadFiles,
	deleteFiles as $deleteFiles,
	listBucketContents as $listBucketContents,
	Delimiter,
	generateUploadParam
} from '../../backend/s3';
import { pushExperimentData } from '../../backend/dynamoDB';

const Upload_Limit_MB = 100; 
const Upload_Limit = Upload_Limit_MB  * 1024 * 1024;

const updateFileList = (dispatch, feedback = null) => {
	dispatch((dispatch, getState) => {
		if (!getState().experimentState.experimentId) return;
		$listBucketContents({Prefix: `${getState().userState.user.identityId}/${getState().experimentState.experimentId}/`}).then((data) => {
			dispatch(editorActions.updateMediaAction(data));
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

const uploadFiles = (dispatch, files, setState, progressHook) => {
	for (let f of files) {
		if (f.size > Upload_Limit) {
			notify.notifyWarningBySnackbar(dispatch, "Exceed upload limit: " + Upload_Limit_MB + " MB !");
			return;
		}
	}
	dispatch((dispatch, getState) => {
		let params = files.map(f => generateUploadParam({
			Body: f, 
			Key: [getState().userState.user.identityId,
				getState().experimentState.experimentId,
				f.name
			].join(Delimiter)
		}));
		$uploadFiles({
			params: params,
			progressHook: progressHook
		}).then(() => {
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
	let filenames = [];
	let media = state.experimentState.media;
	if (media.Contents) {
		filenames = media.Contents.map((f) => (f.Key.replace(media.Prefix, '')));
	} 
	
 	return {
 		s3files: media,
 		filenames: filenames,
 	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	uploadFiles: (files, setState, progressHook) => { uploadFiles(dispatch, files, setState, progressHook); },
	updateFileList: () => { updateFileList(dispatch); },
	deleteFiles: (filePaths) => { deleteFiles(dispatch, filePaths); },
	checkBeforeOpen: (handleOpen) => { checkBeforeOpen(dispatch, handleOpen); },
	notifySuccessBySnackbar: (msg) => { notify.notifySuccessBySnackbar(dispatch, msg); },
	notifyWarningByDialog: (msg) => { notify.notifyWarningByDialog(dispatch, msg); },
	notifyWarningBySnackbar: (msg) => { notify.notifyWarningBySnackbar(dispatch, msg); }
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaManager);
