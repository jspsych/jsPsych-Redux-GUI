import { connect } from 'react-redux';
import * as experimentActions from '../../../actions/experimentSettingActions';
import CloudDeploymentManager from '../../../components/Appbar/CloudDeploymentManager';
import { LoginModes } from '../../../reducers/User';
import { getDefaultInitCloudDeployInfo } from '../../../reducers/Experiment';
import { cloudDeploy as $cloudDeploy } from '../../../backend/deploy';
import { listBucketContents, Cloud_Bucket, deleteObject } from '../../../backend/s3';
import { pushUserData, getUserData } from '../../../backend/dynamoDB';
import { pureSaveFlow } from '../index.js';
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

const createProject = (dispatch, token) => {
	return dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;

		return createNodeAtOSF({
			token: token,
			experimentName: experimentState.experimentName,
			experimentId: experimentState.experimentId
		}).then((res) => {
			notifySuccessBySnackbar(dispatch, "Storage Place Created !");
			return res.data.id;
		}).catch((e) => {
			notifyErrorByDialog(dispatch, e.message);
		})
	})
}

const cloudDeploy = ({dispatch, osfNode, osfAccess, saveAfter}) => {
	return dispatch((dispatch, getState) => {
		dispatch(experimentActions.setCloudDeployInfoAction({
			osfNode: osfNode,
			osfAccess: osfAccess,
			saveAfter: saveAfter
		}));
		console.log(getState().experimentState)
		return Promise.all([
			pureSaveFlow(dispatch, getState),
			$cloudDeploy({
				state: getState(),
			}).then(() => {
				notifySuccessBySnackbar(dispatch, "Experiment Deployed !");
			})
		]).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
		});
	})
}

const cloudDelete = (dispatch) => {
	return dispatch((dispatch, getState) => {
		dispatch(experimentActions.setCloudDeployInfoAction(getDefaultInitCloudDeployInfo()));
		let experimentState = getState().experimentState;

		return Promise.all([
			pureSaveFlow(dispatch, getState),
			listBucketContents({
				bucket: Cloud_Bucket,
				Prefix: experimentState.experimentId
			}).then((data) => {
				return Promise.all(data.Contents.map(item => deleteObject({
					Bucket: Cloud_Bucket,
					Key: item.Key
				})));
			}).then(() => {
				notifyWarningBySnackbar(dispatch, "Experiment Offline !");
			})
		]).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
		});
	})
}

const saveSetting = ({dispatch, osfNode, saveAfter, setSavingStatus, syncExperimentStatus}) => {
	return dispatch((dispatch, getState) => {
		dispatch(experimentActions.setCloudSaveDataAfterAction(
			getState().experimentState.experimentId,
			saveAfter
		));
		dispatch(experimentActions.setOsfNodeAction(
			getState().experimentState.experimentId,
			utils.toNull(osfNode.trim())
		));
		setSavingStatus(true);
		return pushUserData(getState().userState).then(() => {
			notifySuccessBySnackbar(dispatch, "Settings Saved !");
		}).finally(() => {
			setSavingStatus(false);
			syncExperimentStatus();
		});
	});
}

const syncExperimentStatus = ({dispatch, setReactState}) => {
	return dispatch((dispatch, getState) => {
		let experimentId = getState().experimentState.experimentId,
			userId = getState().userState.user.identityId;
		return Promise.all([
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

const checkBeforeOpen = (dispatch) => {
	return dispatch((dispatch, getState) => {
		// not logged in
		if (!getState().userState.user.identityId) {
			notifyWarningBySnackbar(dispatch, 'You need to sign in before deploying your experiment on Cloud !');
			dispatch(userActions.setLoginWindowAction(true, LoginModes.signIn));
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	})
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState,
		userState = state.userState,
		indexedNodeNames = experimentState.mainTimeline.map((id, i) => `${i+1}. ${experimentState[id].name}`);

	let cloudDeployInfo = experimentState.cloudDeployInfo || {},
		osfAccess = userState.osfAccess || [],
		chosenOsfAccess = cloudDeployInfo.osfAccess || {},
		saveAfter = cloudDeployInfo.saveAfter || 0,
		osfNode = cloudDeployInfo.osfNode || null;

	return {
		experimentUrl: `experiments.jspsych.org/${experimentState.experimentId}`,
		osfAccess: osfAccess,
		chosenOsfAccess: chosenOsfAccess,
		indexedNodeNames: indexedNodeNames,
		osfNode: osfNode,
		osfToken: chosenOsfAccess.token,
		saveAfter: saveAfter,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	cloudDeploy: ({osfNode, osfAccess, saveAfter}) => { 
		return cloudDeploy({
			dispatch: dispatch,
			osfNode: osfNode,
			osfAccess: osfAccess,
			saveAfter: saveAfter
		});
	},
	checkBeforeOpen: () => checkBeforeOpen(dispatch),
	cloudDelete: () => cloudDelete(dispatch),
	createProject: (token) => createProject(dispatch, token),
	syncExperimentStatus: (setReactState) => {
		return syncExperimentStatus({
			dispatch: dispatch,
			setReactState: setReactState
		});
	},
	saveSetting: ({ 
		osfNode,
		saveAfter,
		setSavingStatus,
		syncExperimentStatus
	}) => {
		return saveSetting({
			dispatch: dispatch,
			osfNode: osfNode,
			saveAfter: saveAfter,
			setSavingStatus: setSavingStatus,
			syncExperimentStatus: syncExperimentStatus
		});
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
