import { cognitoConfig } from '../../../../config/aws-config-cognito.js';
import { createIdFromTimeStamp } from '../../utils';
const User_Table_Name = "jsPsych_Builder_Users";
const Experiment_Table_Name = "jsPsych_Builder_Experiments";

var AWS = require('aws-sdk');
AWS.config.region = cognitoConfig.region;

/*
data = {
	userId: userState, // or
	experimentId: experimentState
}
*/
function putItem(param, accessInfo) {
	let access = {};
	if (accessInfo.accessKeyId &&
		accessInfo.secretAccessKey &&
		accessInfo.sessionToken) {
		access = accessInfo;
	}
	var dynamodb = new (AWS.DynamoDB.DocumentClient)({
				apiVersion: '2012-08-10',
				region: cognitoConfig.region,
				...access
			});
	dynamodb.put(param, (err, data) => {
		if (err) {
			console.log(err, err.stack); 
		} else {
			console.log(data); 
		}
	});
}

export function putItemToUserTable(data, accessInfo) {
	let param = {
		TableName: User_Table_Name,
		Item: {
			'userId': data.userId,
			'userState': data.userState,
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
			'experimentState': data.experimentState,
		},
		ReturnConsumedCapacity: "TOTAL", 
	}

	putItem(param, accessInfo);
}

export function save(state, dispatch) {
	let { userState, experimentState } = state;

	let userData = {
		userId: userState.user.identityId,
		userState: userState
	};

	putItemToUserTable(userData, userState.loginSession);

	let experimentId = experimentState.experimentId;
	if (!experimentId) {
		experimentId = createIdFromTimeStamp();
	}
	let experimentData = {
		experimentId: experimentId,
		experimentState: experimentState
	};

	putItemToExperimentTable(experimentData, userState.loginSession);

}

	// 	dynamodb.get({
	// 	TableName: User_Table_Name,
	// 	Key: {
	// 		'userId': data.userId,
	// 	},
	// 	AttributesToGet: [
	// 		'userState',
	// 	],
	// }, function(err, data) {
	// 	if (err) console.log(err);
	// 	else console.log(data.Item.userState);
	// });