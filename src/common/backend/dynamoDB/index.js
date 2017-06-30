/*
This file handles direct communication with database (dynamoDB).
The data recevied in all functions in this file should be pre-processed by
the functions defined in reducers/backend

Possibly related files:

reducers/backend.js
containers/Login/*
containers/Appbar/index.js
*/

import { cognitoConfig } from '../../../../config/aws-config-cognito.js';
var AWS = require('aws-sdk');
AWS.config.region = cognitoConfig.region;
if (typeof Promise === 'undefined') {
  AWS.config.setPromisesDependency(require('bluebird'));
} else {
	AWS.config.setPromisesDependency(Promise);
}

const API_VERSION = '2012-08-10';
const User_Table_Name = "jsPsych_Builder_Users";
const Experiment_Table_Name = "jsPsych_Builder_Experiments";

function connectDynamoDB() {
	let access = {
		accessKeyId: window.sessionStorage.accessKeyId,
		secretAccessKey: window.sessionStorage.secretAccessKey,
		sessionToken: window.sessionStorage.sessionToken,
	};
	if (access.accessKeyId === 'undefined' ||
		access.secretAccessKey === 'undefined' ||
		access.sessionToken === 'undefined') {
		access = {};
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
function putItem(param) {
	connectDynamoDB().put(param, (err, data) => {
		if (err) {
			console.log(err); 
		}
	});
}

function getItem(param) {
	return connectDynamoDB().get(param).promise();
}

function deleteItem(param) {
	return connectDynamoDB().delete(param).promise();
}

/*
data = {
	userId: identityId,
	username: username,
	// an object of update-userState-needed data
	fetch: {
		lastEdittingId: last editting experiment id,
		experiments: array
	}, 
}
*/
function putItemToUserTable(data) {
	let param = {
		TableName: User_Table_Name,
		Item: {
			...data
		},
		ReturnConsumedCapacity: "TOTAL", 
	};

	putItem(param);
}

/*
data = {
	experimentId: assigned id,
	fetch: experimentState, 
}
*/
function putItemToExperimentTable(data) {
	let param = {
		TableName: Experiment_Table_Name,
		Item: {
			...data
		},
		ReturnConsumedCapacity: "TOTAL", 
	}

	putItem(param);
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

/*
Fetch case: sign in

userState should be already processed.
Detail is in reducers/backend.
*/
export function signInFetchUserData(userState) {
	let param = {
		TableName: User_Table_Name,
		Key: {
			'userId': userState.user.identityId
		},
		AttributesToGet: [ 'fetch' ] // fetch update local state needed info
	};
	return getItem(param);
}

/*
Fetch case: fetch experiment by id

userState should be already processed.
Detail is in reducers/backend.
*/
export function fetchExperimentById(id) {
	let param = {
		TableName: Experiment_Table_Name,
		Key: {
			'experimentId': id
		},
		AttributesToGet: [ 'fetch' ] // fetch update local state needed info
	};
	return getItem(param);
}

export function pushUserData(userState) {
	putItemToUserTable(extractUserData(userState));
}

export function pushExperimentData(experimentState) {
	putItemToExperimentTable(extractExperimentData(experimentState));
}

/*
Save case: create account

At this point, state is already processed for uploading
Detail is in reducers/backend.
*/
export function signUpPush(state) {
	let { userState, experimentState } = state;

	// update user data
	pushUserData(userState);

	// if there is any change in experiment, save it too
	if (experimentState.experimentId) {
		pushExperimentData(experimentState);
	}
}

/*
Save case: click save

At this point, state is already processed for uploading
Detail is in reducers/backend.
*/
export function pushState(state) {
	let { userState, experimentState } = state;

	pushUserData(userState);
	pushExperimentData(experimentState);
}

/**/
export function deleteExperiment(experimentId) {
	let param = {
		TableName: Experiment_Table_Name,
		Key: {
			experimentId: experimentId
		}
	}

	return deleteItem(param);
}