import { initState as jsPsychInitState } from '../reducers/Experiment/jsPsychInit.js';

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
export const createUserOsfAccessItem = ({token=null, alias=null}={}) => ({
	token, 
	alias,
});


/************************ Utility Functions for experimentState ************************/


export const getDefaultInitCloudDeployInfo = () => ({
	osfNode: null,
	osfAccess: null, // check userState.osfAccess[i]
	saveAfter: 0
});

export const getDefaultInitDiyDeployInfo = () => ({
	mode: enums.DIY_Deploy_Mode.disk,
	saveAfter: 0,
});

export const getInitExperimentState = () => createExperiment({experimentId: null});

export const generateExperimentId = () => `E_${utils.getUUID()}`;

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
