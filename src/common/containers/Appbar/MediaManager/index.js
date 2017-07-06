import { connect } from 'react-redux';
import MediaManager from '../../../components/Appbar/MediaManager';
import * as userActions from '../../../actions/userActions' ;
import { LoginModes } from '../../../reducers/User';
import * as notify from '../../Notification';
import {
	uploadFiles as $uploadFiles,
	deleteFiles as $deleteFiles,
	listBucketContents as $listBucketContents
} from '../../../backend/s3';

const uploadFiles = (dispatch, files, setState) => {
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

		// on start
		setState({
			uploadComplete: false
		});
		$uploadFiles(files, getState().experimentState.experimentId).then(() => {
			// update list
			updateFileList(dispatch, setState, true);
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
		updateFileList(dispatch, setState, true);
	}, (err) => {
		console.log(err.message)
		notify.notifyErrorByDialog(dispatch, err.message);
	});
}

const updateFileList = (dispatch, setState, feedback=false) => {
	dispatch((dispatch, getState) => {
		$listBucketContents(getState().experimentState.experimentId).then((data) => {
			setState({
				s3files: data,
				selected: data.Contents.map((d) => (false)),
			});
			if (feedback) {
				notify.notifySuccessBySnackbar(dispatch, "List updated !");
			}
		}, (err) => {
			notify.notifyErrorByDialog(dispatch, err.message);
		});
	})
}

const mapStateToProps = (state, ownProps) => {
 	return {
 		experimentId: state.experimentState.experimentId
 	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	uploadFiles: (files, setState) => { uploadFiles(dispatch, files, setState); },
	updateFileList: (setState) => { updateFileList(dispatch, setState); },
	deleteFiles: (filePaths, setState) => { deleteFiles(dispatch, filePaths, setState); },
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaManager);
