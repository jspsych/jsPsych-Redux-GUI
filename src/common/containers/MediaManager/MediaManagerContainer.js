import { connect } from 'react-redux';
import MediaManager from '../../components/MediaManager';
import * as editorActions from '../../actions/editorActions';


const Upload_Limit_MB = 100; 
const Upload_Limit = Upload_Limit_MB  * 1024 * 1024;


const uploadFiles = ({dispatch, files, progressHook, userId, experimentId}) => {
	let params = []
	for (let f of files) {
		if (f.size > Upload_Limit) {
			utils.notifications.notifyWarningBySnackbar({
				dispatch,
				message: "Exceed upload limit: " + Upload_Limit_MB + " MB !"
			});
			return Promise.resolve();
		}
		params.push(myaws.S3.generateUploadParam({
			Key: [userId, experimentId, f.name].join(myaws.S3.Delimiter),
			Body: f
		}));
	}

	return myaws.S3.uploadFiles({params, progressHook}).then(() => {
		utils.notifications.notifySuccessBySnackbar({
			dispatch,
			message: "Uploaded !"
		});
	});
}

const deleteFiles = ({dispatch, filePaths}) => {
	return $deleteFiles(filePaths).then((data) => {
		utils.notifications.notifySuccessBySnackbar({
			dispatch,
			message: "Deleted !"
		});
	}).catch((err) => {
		utils.notifications.notifyErrorByDialog({
			dispatch,
			message: err.message
		});
	});
}

const checkBeforeOpen = ({dispatch}) => {
	return dispatch((dispatch, getState) => {
		// not logged in
		if (!getState().userState.userId) {
			utils.notifications.notifyWarningBySnackbar({
				dispatch, 
				message: 'You need to sign in before uploading your resources !'
			});
			utils.loginWindows.popSignIn({dispatch});
			return Promise.resolve(false);
		}
		// unregistered experiment
		if (!getState().experimentState.experimentId) {
			utils.notifications.notifyWarningByDialog({
				dispatch, 
				message: 'You need to save this experiment before uploading your resources !'
			});
			return Promise.resolve(false);
		}

		return Promise.resolve(true);
	});
}

/*
Note that FOR NOW AWS S3 Media Type Object MUST be in the first level
of trial.paramters
*/
const mapStateToProps = (state, ownProps) => {
 	return {
 		userId: state.experimentState.ownerId,
 		experimentId: state.experimentState.experimentId
 	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	uploadFiles: ({...args}) => uploadFiles({dispatch, ...args}),
	deleteFiles: ({...args}) => deleteFiles({dispatch, ...args}),
	checkBeforeOpen: () => checkBeforeOpen({dispatch}),
	notifySuccessBySnackbar: (message) => { utils.notifications.notifySuccessBySnackbar({dispatch, message}); },
	notifyWarningByDialog: (message) => { utils.notifications.notifyWarningByDialog({dispatch, message}); },
	notifyWarningBySnackbar: (message) => { utils.notifications.notifyWarningBySnackbar({dispatch, message}); }
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaManager);
