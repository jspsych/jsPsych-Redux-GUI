import { connect } from 'react-redux';
import * as backendActions from '../../../actions/backendActions';
import * as userActions from '../../../actions/userActions';
import * as experimentActions from '../../../actions/experimentSettingActions';
import CloudDeploymentManager from '../../../components/Appbar/CloudDeploymentManager';
import { LoginModes } from '../../../reducers/User';
import { cloudDeploy as $cloudDeploy } from '../../../backend/deploy';
import { listBucketContents, Cloud_Bucket, deleteObject } from '../../../backend/s3';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';
import {
	$save
} from '../index.js';

const cloudDeploy = (dispatch, insertAfter, setDeloyingStatus, checkIfOnline) => {
	dispatch((dispatch, getState) => {
		setDeloyingStatus(true);
		$cloudDeploy({
			state: getState(),
			insertAfter: insertAfter
		}).then(() => {
			setDeloyingStatus(false);
			notifySuccessBySnackbar(dispatch, "Experiment Deployed !");
			checkIfOnline();
		}).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
			checkIfOnline();
		});
	})
}

const cloudDelete = (dispatch, setDeletingStatus, checkIfOnline) => {
	dispatch((dispatch, getState) => {
		listBucketContents({
			bucket: Cloud_Bucket,
			Prefix: getState().experimentState.experimentId
		}).then((data) => {
			return Promise.all(data.Contents.map(item => deleteObject({
				Bucket: Cloud_Bucket,
				Key: item.Key
			})));
		}).then(() => {
			setDeletingStatus(false);
			notifyWarningBySnackbar(dispatch, "Experiment Offline !");
			checkIfOnline();
		}).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
			checkIfOnline();
		});
	})

}

const setCloudSaveDataAfter = (dispatch, index) => {
	dispatch(experimentActions.setCloudSaveDataAfterAction(index));
}

const setOsfParentNode = (dispatch, value) => {
	// dispatch((dispatch, getState) => {
	// 	dispatch(experimentActions.setOsfParentNodeAction(value ? value : null));
	// 	$save(dispatch, getState);
	// })
	dispatch(experimentActions.setOsfParentNodeAction(value ? value.trim() : null));
}

const checkIfOnline = (experimentId, callback) => {
	listBucketContents({
		bucket: Cloud_Bucket,
		Prefix: experimentId
	}).then(data => {
		callback(data.Contents.length > 0)
	})
}

const checkBeforeOpen = (dispatch, handleOpen) => {
	dispatch((dispatch, getState) => {
		// not logged in
		if (!getState().userState.user.identityId) {
			notifyWarningBySnackbar(dispatch, 'You need to sign in before deploying your experiment on Cloud !');
			dispatch(userActions.setLoginWindowAction(true, LoginModes.signIn));
			return;
		}
		handleOpen();
	})
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	return {
		experimentUrl: `experiments.jspsych.org/${experimentState.experimentId}`,
		osfParentNode: experimentState.osfParentNode,
		checkIfOnline: (callback) => { checkIfOnline(experimentState.experimentId, callback); },
		indexedNodeNames: experimentState.mainTimeline.map((id, i) => `${i+1}. ${experimentState[id].name}`),
		cloudSaveDataAfter: experimentState.cloudSaveDataAfter,
		osfToken: state.userState.osfToken,
		osfTokenError: !state.userState.osfToken,
		osfParentNodeError: !experimentState.osfParentNode
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	cloudDeploy: (insertAfter, setDeloyingStatus, checkIfOnline) => { cloudDeploy(dispatch, insertAfter, setDeloyingStatus, checkIfOnline); },
	setOsfParentNode: (value) => { setOsfParentNode(dispatch, value); },
	checkBeforeOpen: (handleOpen) => { checkBeforeOpen(dispatch, handleOpen); },
	setCloudSaveDataAfter: (index) => { setCloudSaveDataAfter(dispatch, index); },
	cloudDelete: (setDeletingStatus, checkIfOnline) => { cloudDelete(dispatch, setDeletingStatus, checkIfOnline); }
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
