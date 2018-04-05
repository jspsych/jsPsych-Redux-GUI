import { connect } from 'react-redux';
import * as experimentActions from '../../../actions/experimentSettingActions';
import CloudDeploymentManager from '../../../components/Appbar/CloudDeploymentManager';
import { LoginModes } from '../../../reducers/User';
import { cloudDeploy as $cloudDeploy } from '../../../backend/deploy';
import { listBucketContents, Cloud_Bucket, deleteObject } from '../../../backend/s3';
import { pushUserData, getUserData } from '../../../backend/dynamoDB';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';

const https = require('https');

function createNodeAtOSF({token, experimentName, experimentId}) {
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

const createProject = (dispatch, setCreatingStatus) => {
	setCreatingStatus(true);
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState,
			osfToken = getState().userState.osfToken;

		createNodeAtOSF({
			token: osfToken,
			experimentName: experimentState.experimentName,
			experimentId: experimentState.experimentId
		}).then((res) => {
			let id = res.data.id;
			dispatch(experimentActions.setOsfNodeAction(experimentState.experimentId, id));
		}).then(() => {
			notifySuccessBySnackbar(dispatch, "Storage Place Created !");
		}).catch((e) => {
			notifyErrorByDialog(dispatch, e.message);
		}).finally(() => {
			setCreatingStatus(false);
		})
	})
}

const cloudDeploy = ({dispatch, setDeloyingStatus, syncExperimentStatus}) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState,
			userState = getState().userState;

		// For now set token as user's only token
		dispatch(experimentActions.setOsfTokenAction(
			experimentState.experimentId,
			userState.osfToken
			)
		);

		Promise.all([
			Promise.resolve().then(() => { setDeloyingStatus(true); }),
			pushUserData(getState().userState),
			$cloudDeploy({
				state: getState(),
			})
		]).then(() => {
			notifySuccessBySnackbar(dispatch, "Experiment Deployed !");
		}).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
		}).finally(() => {
			syncExperimentStatus();
			setDeloyingStatus(false);
		});
	})
}

const cloudDelete = (dispatch, setDeletingStatus, syncExperimentStatus) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;

		listBucketContents({
			bucket: Cloud_Bucket,
			Prefix: getState().experimentState.experimentId
		}).then((data) => {
			return Promise.all(data.Contents.map(item => deleteObject({
				Bucket: Cloud_Bucket,
				Key: item.Key
			})));
		}).then(() => {
			notifyWarningBySnackbar(dispatch, "Experiment Offline !");
		}).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
		}).finally(() => {
			setDeletingStatus(false);
			syncExperimentStatus();
		});
	})
}

const setCloudSaveDataAfter = (dispatch, index) => {
	dispatch((dispatch, getState) => {
		dispatch(experimentActions.setCloudSaveDataAfterAction(
			getState().experimentState.experimentId,
			index
			)
		);
	});
}

const setOsfNode = (dispatch, value) => {
	dispatch((dispatch, getState) => {
		dispatch(experimentActions.setOsfNodeAction(
			getState().experimentState.experimentId,
			utils.toNull(value.trim())
			)
		);
	});
}

const syncExperimentStatus = ({dispatch, setReactState}) => {
	dispatch((dispatch, getState) => {
		let experimentId = getState().experimentState.experimentId,
			userId = getState().userState.user.identityId;
		Promise.all([
			listBucketContents({
				bucket: Cloud_Bucket,
				Prefix: experimentId
			}).then((data) => {
				setReactState({
					isOnline: data.Contents.length > 0
				})
			}),
			getUserData(userId).then((data) => {
				let userState = data.Item.fetch;
				if (userState.cloudDeployInfo[experimentId]) {
					setReactState({
						usingOsfToken: userState.cloudDeployInfo[experimentId].osfToken,
						usingOsfNode: userState.cloudDeployInfo[experimentId].osfNode
					})
				}
			})
		]).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
		});
	});
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
	let experimentState = state.experimentState,
		userState = state.userState,
		indexedNodeNames = experimentState.mainTimeline.map((id, i) => `${i+1}. ${experimentState[id].name}`);

	let cloudDeployInfo = {}, saveAfter = -1, osfNode = '';
	if (userState.cloudDeployInfo[experimentState.experimentId]) {
		cloudDeployInfo = userState.cloudDeployInfo[experimentState.experimentId];
		saveAfter = cloudDeployInfo.saveAfter;
		osfNode = cloudDeployInfo.osfNode;
	}

	return {
		experimentUrl: `experiments.jspsych.org/${experimentState.experimentId}`,
		indexedNodeNames: indexedNodeNames,
		osfParentNode: osfNode,
		osfParentNodeError: !osfNode,
		osfToken: userState.osfToken,
		osfTokenError: !userState.osfToken,
		cloudSaveDataAfter: saveAfter,
		saveAfterError: saveAfter >= indexedNodeNames.length || saveAfter === -1
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	cloudDeploy: ({setDeloyingStatus, syncExperimentStatus}) => { 
		cloudDeploy({
			dispatch: dispatch,
			setDeloyingStatus: setDeloyingStatus,
			syncExperimentStatus: syncExperimentStatus
		});
	},
	setOsfNode: (value) => { setOsfNode(dispatch, value); },
	checkBeforeOpen: (handleOpen) => { checkBeforeOpen(dispatch, handleOpen); },
	setCloudSaveDataAfter: (index) => { setCloudSaveDataAfter(dispatch, index); },
	cloudDelete: (setDeletingStatus, syncExperimentStatus) => { cloudDelete(dispatch, setDeletingStatus, syncExperimentStatus); },
	createProject: (setCreatingStatus) => { createProject(dispatch, setCreatingStatus); },
	syncExperimentStatus: (setReactState) => {
		syncExperimentStatus({
			dispatch: dispatch,
			setReactState: setReactState
		});
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
