import { initState as jsPsychInitState } from '../reducers/Experiment/jsPsychInit.js';

/**
 * @typeof {(string|number|object)} guiValue - A native javascript value. 
 * It is important that if the input value is empty string, it should be converted to null for AWS.DynamoDB storage purpose. 
*/

/**
 * User State Template
 * @namespace ExperimentState
 * @property {guiValue} username=null - User Name
 * @property {guiValue} userId=null - User's identity id (see docs for AWS.Cognito)
 * @property {guiValue} email=null - User's email
 * @property {Array.<OsfAccessItem>} osfAccess=[] - Access information to OSF
 * @property {Array.<string>} diyAccess=[] - Access information to user's server
 * @description State template for User state. 
 * ***NOTE THAT***: All empty string '' will be converted to null for storage (AWS.DynamoDB) purpose
*/
export const createUser = ({
	userId = null,
	username = null,
	email = null,
}={}) => ({
	// Cognito Identity Id
	userId: userId, 
	username: username,
	email: email,

	// osf access information
	osfAccess: [],

	// diy access information
	diyAccess: [],
})

/**
 * Experiment State Template
 * @namespace ExperimentState
 * @property {guiValue} experimentName=null - Experiment Name
 * @property {guiValue} experimentId=null - Experiment's identifier in DynamoDB, should be generated as a UUID by uuid()
 * @property {guiValue} ownerId - Experiment Owner's identity id (see docs for AWS.Cognito)
 * @property {boolean} isPublic - True if the experiment is public
 * @property {number} createDate - The date the experiment is created
 * @property {number} lastModifiedDate - The date that the last edit happens to the experiment
 * @property {guiValue} previewId=null - The id of the node that is getting previewed
 * @property {Array.<string>} mainTimeline=[] - The main jsPsych timeline, should hold the id of nodes
 * @property {Object} jsPsychInit - The object that sets jsPsych (initialization/launch) options
 * @property {}
 * @property {Object} [timelineNode-{id}] - {@link TimelineNode}
 * @property {Object} [trialNode-{id}] - {@link TrialNode}
 * @description State template for Experiment state. 
 * ***NOTE THAT***: All empty string '' will be converted to null for storage (AWS.DynamoDB) purpose
*/
export const createExperiment = ({
	experimentName = "Untitled Experiment",
	ownerId = null,
	isPublic = false,
	experimentId = generateExperimentId()
}={}) => ({
	previewId: null,
	
	experimentName: experimentName,
	experimentId: null,
	description: null,

	createDate: null,
	lastModifiedDate: null,
	ownerId: ownerId,
	isPublic: isPublic,

	/********** experiment contents **********/
	mainTimeline: [],
	jsPsychInit: utils.deepCopy(jsPsychInitState),

	/********** Deployment Information **********/
	cloudDeployInfo: getDefaultInitCloudDeployInfo(),
	diyDeployInfo: getDefaultInitDiyDeployInfo(),
});

/************************ Utility Functions for UserState ************************/

/*
* @typeof {object} OsfAccessItem -  Hold osf access info
* @property {guiValue} token=null - Access key to OSF
* @property {guiValue} alias=null - Name of this item
*/
export const createUserOsfAccessItem = ({token=null, alias=null}={}) => ({
	token, 
	alias,
});


/************************ Utility Functions for experimentState ************************/

/*
* @typeof {object} CloudDeployItem -  Hold information for cloud deploy information
* @property {guiValue} osfNode=null - The osf node that stores data
* @property {OsfAccessItem} osfAccess=null - osf access item
* @property {number} saveAfter=0 - Save data to osf after the timeline node at this index
*/
export const getDefaultInitCloudDeployInfo = () => ({
	osfNode: null,
	osfAccess: null, 
	saveAfter: 0
});

/*
* @typeof {object} OsfAccessItem -  Hold osf access info
* @property {guiValue} token=null - Access key to OSF
* @property {guiValue} alias=null - Name of this item
*/
export const getDefaultInitDiyDeployInfo = () => ({
	mode: enums.DIY_Deploy_Mode.disk,
	saveAfter: 0,
});

export const getInitExperimentState = () => createExperiment({experimentId: null});

export const generateExperimentId = () => `E_${utils.getUUID()}`;

/*
* Duplicate an experiment
* Assign it a new experiment id (UUID) if necessary
* Clear its time stamps
*/
export const duplicateExperiment = ({sourceExperimentState, newName=null}) => {
	let targetExperimentState = utils.deepCopy(sourceExperimentState);

	if (newName) {
		targetExperimentState.experimentName = newName;
	}
	targetExperimentState.experimentId = generateExperimentId();
	targetExperimentState.createDate = null;
	targetExperimentState.lastModifiedDate = null;

	return targetExperimentState;
};

/*
* Prepare experimentState for being saved to AWS 
* Associate it with a user if necessary
* Assign it an experiment id (UUID) if necessary
* Stamp create date and last modified date if necessary
*/
export const registerExperiment = ({experimentState, userId=null}) => {
	experimentState = utils.deepCopy(experimentState);
	if (!experimentState.ownerId) {
		experimentState.ownerId = userId;
	}
	if (!experimentState.experimentId) {
		experimentState.experimentId = generateExperimentId();
	}

	let now = Date.now();
	if (!experimentState.createDate) {
		experimentState.createDate = now;
	}
	experimentState.lastModifiedDate = now;

	return experimentState;
};
