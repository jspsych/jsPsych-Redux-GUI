import { cognitoConfig } from '../../../../config/aws-config-cognito.js';
import { getUUID } from '../../utils';
const User_Table_Name = "jsPsych_Builder_Users";
const Experiment_Table_Name = "jsPsych_Builder_Experiments";

var AWS = require('aws-sdk-promise');
AWS.config.region = cognitoConfig.region;

if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird'));
} else {
	AWS.config.setPromisesDependency(Promise);
}

const API_VERSION = '2012-08-10';

function connectDynamoDB(accessInfo) {
	let access = {};
	if (accessInfo.accessKeyId &&
		accessInfo.secretAccessKey &&
		accessInfo.sessionToken) {
		access = accessInfo;
	}
	return new (AWS.DynamoDB.DocumentClient)({
				apiVersion: API_VERSION,
				region: cognitoConfig.region,
				...access
			});
}

/*
data = {
	userId: userState, // or
	experimentId: experimentState
}
*/
function putItem(param, accessInfo) {
	let dynamodb = connectDynamoDB(accessInfo);
	dynamodb.put(param, (err, data) => {
		if (err) {
			console.log(err, err.stack); 
		} else {
			console.log(data); 
		}
	});
}

function getItem(param, accessInfo) {
	let dynamodb = connectDynamoDB(accessInfo);
	return dynamodb.get(param).promise();
}


/*
data = {
	userId: identityId,
	username: username,
	// an object of update-userState-needed data
	fetch: {
		lastEdittingId: last editting experiment id,
		medias: array,
		experiments: array
	}, 
}

accessInfo = { // from cognito
	accessKeyId: id,
	secretAccessKey: key,
	sessionToken: token
}
*/
export function putItemToUserTable(data, accessInfo) {
	let param = {
		TableName: User_Table_Name,
		Item: {
			'userId': data.userId,
			'username': data.username,
			'fetch': data.fetch
		},
		ReturnConsumedCapacity: "TOTAL", 
	};

	putItem(param, accessInfo);
}

export function putItemToExperimentTable(data, accessInfo) {
	let param = {
		TableName: Experiment_Table_Name,
		Item: {
			'experimentId': data.experimentId,
			'fetch': data.fetch,
		},
		ReturnConsumedCapacity: "TOTAL", 
	}

	putItem(param, accessInfo);
}


function extractUserData(userState) {
	return {
		userId: userState.user.identityId,
		username: userState.user.username,
		fetch: {
			lastEdittingId: userState.lastEdittingId,
			experiments: userState.experiments,
		}
	};
}

function extractExperimentData(experimentState) {
	return {
		experimentId: experimentState.experimentId,
		fetch: experimentState
	};
}


export function signInfetchUser(userState) {
	let param = {
		TableName: User_Table_Name,
		Key: {
			'userId': userState.user.identityId
		},
		AttributesToGet: [ 'fetch' ] // fetch update local state needed info
	};
	return getItem(param, userState.loginSession);
}

export function fetchExperimentById(id, loginSession) {
	let param = {
		TableName: Experiment_Table_Name,
		Key: {
			'experimentId': id
		},
		AttributesToGet: [ 'fetch' ] // fetch update local state needed info
	};
	return getItem(param, loginSession);
}

export function signUpSave(state) {
	let { userState, experimentState } = state;

	let userData = extractUserData(userState);
	putItemToUserTable(userData, userState.loginSession);
	// console.log(userState.loginSession)
	if (experimentState.experimentId) {
		let experimentData = extractExperimentData(experimentState);
		putItemToExperimentTable(experimentData, userState.loginSession);
	}
}


export function save(state, dispatch) {
	let { userState, experimentState } = state;

	let userData = extractUserData(userState);

	putItemToUserTable(userData, userState.loginSession);

	let experimentId = experimentState.experimentId;
	if (!experimentId) {
		experimentId = getUUID();
		experimentState.experimentId = experimentId;
	}
	let experimentData = extractExperimentData(experimentState);

	putItemToExperimentTable(experimentData, userState.loginSession);

}
