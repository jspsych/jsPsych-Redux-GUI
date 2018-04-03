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

const https = require('https');

function createNodeAtOSF({
	token,
	experimentName,
	experimentId
}) {
	return new Promise((resolve, reject) => {
		let body = JSON.stringify({
				"data": {
					"type": "nodes",
					"attributes": {
						"title": `jsPsych-${experimentName}`,
						"category": "data",
						"public": true,
						"description": `This is the data storage for jsPsych-${experimentName}. The experiment id is: ${experimentId}.`,
					}
				}
			}),
			postOptions = {
				hostname: "api.osf.io",
				path: `/v2/nodes/`,
				method: "POST",
				headers: {
					"Content-Type": "application/vnd.api+json",
					"Content-Length": Buffer.byteLength(body),
					"Authorization": `Bearer ${token}`
				}
			};

		const req = https.request(postOptions, (res) => {
			res.on('data', (d) => {
				resolve(JSON.parse(d.toString('utf8')));
			});
		})

		req.on('error', (e) => {
			reject(e);
		});

		req.write(body);
		req.end();
	})
}

const createProject = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState,
			osfToken = getState().userState.osfToken;
		createNodeAtOSF({
			token: osfToken,
			experimentName: experimentState.experimentName,
			experimentId: experimentState.experimentId
		}).then((res) => {
			let id = res.data.id;
			dispatch(experimentActions.setOsfParentNodeAction(id));
			notifySuccessBySnackbar(dispatch, "Storage Place Created !");
		}).catch((e) => {
			notifyErrorByDialog(dispatch, e.message);
		})
	})
}

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
	cloudDelete: (setDeletingStatus, checkIfOnline) => { cloudDelete(dispatch, setDeletingStatus, checkIfOnline); },
	createProject: () => { createProject(dispatch); }
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
