/**
 * @file This file defines the wrapped methods of AWS-DynamoDB and helpers for storing data to dynamoDB.
 * @author Junyan Qi <juqi@vassar.edu>
*/

import AWS from './index.js';

const API_VERSION = '2012-08-10';
const User_Table_Name = "jsPsych_Builder_Users";
const Experiment_Table_Name = "jsPsych_Builder_Experiments";

/**
* Construct a DynamoDB document client
* @return - A DynamoDB document client
*/
function connectDynamoDB() {
	return new(AWS.DynamoDB.DocumentClient)({
		apiVersion: API_VERSION,
	});
}

/**
* Promise wrapper function of dynamoDB.put
* @param {Object} param - parameters
* @return {Promise} - A Promise that resolves if success
*/
function putItem(param) {
	return connectDynamoDB().put(param).promise();
}

/**
* Promise wrapper function of dynamoDB.get
* @param {Object} param - parameters
* @return {Promise} - A Promise that resolves if success
*/
function getItem(param) {
	return connectDynamoDB().get(param).promise();
}

/**
* Promise wrapper function of dynamoDB.delete
* @param {Object} param - parameters
* @return {Promise} - A Promise that resolves if success
*/
function deleteItem(param) {
	return connectDynamoDB().delete(param).promise();
}

/**
* Promise wrapper function of dynamoDB.query
* @param {Object} param - parameters
* @return {Promise} - A Promise that resolves if success
*/
function queryItem(param) {
	return connectDynamoDB().query(param).promise();
}

/**
* Wrapper function that put item to user table
* @param {Object} data - Item to be put. (return value of extractUserData)
* @return {Promise} - A Promise that resolves if success
*/
function putItemToUserTable(data) {
	let param = {
		TableName: User_Table_Name,
		Item: {
			...data
		},
		ReturnConsumedCapacity: "TOTAL",
	};

	return putItem(param);
}

/**
* Wrapper function that put item to experiment table
* @param {Object} data - Item to be put. (return value of extractExperimentData)
* @return {Promise} - A Promise that resolves if success
*/
function putItemToExperimentTable(data) {
	let param = {
		TableName: Experiment_Table_Name,
		Item: {
			...data
		},
		ReturnConsumedCapacity: "TOTAL",
	}

	return putItem(param);
}

/**
* Process the userState so that it is ready to be put into User Table
* @param {Object} userState - userState from reduex
* @return {Object} - Key-Value pairs that map the design of user table
*/
function extractUserData(userState) {
	return {
		userId: userState.identityId,
		fetch: userState
	};
}

/**
* Process the experimentState so that it is ready to be put into Experiment Table
* @param {Object} experimentState - experimentState from reduex
* @return {Object} - Key-Value pairs that map the design of experiment table
*/
function extractExperimentData(experimentState) {
	return {
		experimentId: experimentState.experimentId,
		fetch: experimentState,
		ownerId: experimentState.ownerId,
		isPublic: experimentState.isPublic,
		createDate: experimentState.createDate,
		lastModifiedDate: experimentState.lastModifiedDate
	};
}

/**
* Wrapper function that fetch user data
* @param {string} id - user's identity id
* @return {Promise} - A Promise that resolves to DynamoDB response if success
*/
export function getUserDate(id) {
	let param = {
		TableName: User_Table_Name,
		Key: {
			'userId': id
		},
		AttributesToGet: [ 'fetch' ] // fetch update local state needed info
	};
	return getItem(param);
}

/**
* Wrapper function that fetch experiment data by id
* @param {string} id - experiment id
* @return {Promise} - A Promise that resolves to DynamoDB response if success
*/
export function getExperimentById(id) {
	let param = {
		TableName: Experiment_Table_Name,
		Key: {
			'experimentId': id
		},
		AttributesToGet: [ 'fetch' ] // fetch update local state needed info
	};
	return getItem(param);
}

/**
* Wrapper function that fetch experiment data by id
* @param {string} id - experiment id
* @return {Promise} - A Promise that resolves to DynamoDB response if success
*/
export function getExperimentsOf(userId) {
	let param = {
		TableName: Experiment_Table_Name,
		KeyConditionExpression: "#ownerid = :ownerid",
		ExpressionAttributeNames: {
			"#ownerId": "ownerId"
		},
		ExpressionAttributeValues: {
			":ownerId": userId
		}
	};
	return queryItem(param);
}

/**
* Wrapper function that put userState to User Table
* @param {Object} userState - userState from redux
* @return {Promise} - A Promise that resolves if success
*/
export function saveUserData(userState) {
	return putItemToUserTable(extractUserData(userState));
}

/**
* Wrapper function that put experimentState to Experiment Table
* @param {Object} experimentState - experimentState from redux
* @return {Promise} - A Promise that resolves if success
*/
export function saveExperiment(experimentState) {
	return putItemToExperimentTable(extractExperimentData(experimentState));
}


/**
* Wrapper function that delete an experiment from Experiment Table
* @param {string} experimentId - the id of the experiment to be deleted 
* @return {Promise} - A Promise that resolves if success
*/
export function deleteExperiment(experimentId) {
	let param = {
		TableName: Experiment_Table_Name,
		Key: {
			experimentId: experimentId
		}
	}
	return deleteItem(param);
}
