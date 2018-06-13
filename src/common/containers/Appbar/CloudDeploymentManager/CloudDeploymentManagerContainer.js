import { connect } from 'react-redux';
import CloudDeploymentManager from '../../../components/Appbar/CloudDeploymentManager';

import * as experimentActions from '../../../actions/experimentSettingActions';

import { cloudDeploy as $cloudDeploy } from '../../../backend/deploy';


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

function listNodesAtOSF({token, userId, dispatch}) {
	return new Promise((resolve, reject) => {
		let getOptions = {
			hostname: "api.osf.io",
				path: `/v2/users/${userId}/nodes/`,
				method: "GET",
				headers: {
					"Content-Type": "application/vnd.api+json",
					"Authorization": `Bearer ${token}`
				}
		}
		
		const req = https.request(getOptions, (res) => {
			res.on('data', (d) => {
				let data = JSON.parse(d.toString('utf8'));
				resolve(data ? data.data : []);
			});
		})

		req.on('error', (e) => {
			reject(e);
		});

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
			utils.notifications.notifySuccessBySnackbar({
				dispatch, 
				message: "Storage Place Created !"
			});
			return res.data.id;
		}).catch((err) => {
			console.log(err);
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
		});
	})
}

const cloudDeploy = ({dispatch, osfNode, osfAccess, saveAfter}) => {
	return dispatch((dispatch, getState) => {
		dispatch(experimentActions.setCloudDeployInfoAction({
			osfNode: osfNode,
			osfAccess: osfAccess,
			saveAfter: saveAfter
		}));
		
		return utils.commonFlows.saveCurrentExperiment({
			dispatch,
			displayNotification: false
		}).then(() => {
			let experimentState = getState().experimentState;
			return myaws.S3.listBucketContents({
				Prefix: [experimentState.ownerId, experimentState.experimentId].join(myaws.S3.Delimiter)
			});
		}).then((media) => {
			return $cloudDeploy({
				state: getState(),
				media
			});
		}).then(() => {
			utils.notifications.notifySuccessBySnackbar({
				dispatch,
				message: "Experiment Deployed !"
			});
		}).catch((err) => {
			console.log(err);
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
		});
	});
}

export const pureCloudDelete = (experimentId) => {
	return myaws.S3.listBucketContents({
		bucket: myaws.S3.Cloud_Bucket,
		Prefix: experimentId
	}).then((data) => {
		return Promise.all(data.Contents.map(
			item => myaws.S3.deleteObject({
				Bucket: myaws.S3.Cloud_Bucket,
				Key: item.Key
			}))
		);
	});
}

const cloudDelete = (dispatch) => {
	return dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;

		return Promise.all([
			utils.commonFlows.saveCurrentExperiment({
				dispatch,
				displayNotification: false
			}),
			pureCloudDelete(experimentState.experimentId),
		]).then(() => {
			utils.notifications.notifyWarningBySnackbar({
				dispatch, 
				message: "Experiment Offline !"
			});
		}).catch((err) => {
			console.log(err);
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
		});
	})
}

const syncExperimentStatus = ({dispatch,}) => {
	return dispatch((dispatch, getState) => {
		let experimentId = getState().experimentState.experimentId,
			userId = getState().userState.userId;
		return myaws.S3.listBucketContents({
			bucket: myaws.S3.Cloud_Bucket,
			Prefix: experimentId
		}).then((data) => {
			return data.Contents.length > 0;
		}).catch((err) => {
			console.log(err);
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
		});
	});
}

const checkBeforeOpen = (dispatch) => {
	return dispatch((dispatch, getState) => {
		return utils.commonFlows.isUserSignedIn().then((signedIn) => {
			if (signedIn) {
				if (utils.commonFlows.hasExperimentChanged(getState().experimentState)) {
					utils.notifications.notifyWarningBySnackbar({
						dispatch,
						message: 'Please save your changes first !'
					});
					return Promise.resolve(false);
				}
			} else {
				utils.notifications.notifyWarningByDialog({
					dispatch,
					message: 'You need to sign in before deploying your experiment on Cloud !'
				});
				utils.loginWindows.popSignIn({dispatch});
				return Promise.resolve(false);
			}
			return Promise.resolve(true);
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState,
		userState = state.userState,
		indexedNodeNames = experimentState.mainTimeline.map((id, i) => `${i+1}. ${experimentState[id].name}`);

	// Set default values for past experiment state
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
		experimentId: experimentState.experimentId
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
	syncExperimentStatus: () => syncExperimentStatus({dispatch: dispatch,}),
	listNodesAtOSF: ({...args}) => listNodesAtOSF({dispatch, ...args}).
	dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
