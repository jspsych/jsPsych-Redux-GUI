import * as actionTypes from '../constants/ActionTypes';

export function signUpPushAction(anyChange) {
	return {
		type: actionTypes.SIGN_UP_PUSH,
		anyChange: anyChange
	};
}

export function signInPullAction(userData=null, experimentData=null) {
	return {
		type: actionTypes.SIGN_IN_PULL,
		userData: userData,
		experimentData: experimentData,
	};
}

export function clickSavePushAction() {
	return {
		type: actionTypes.CLICK_SAVE_PUSH
	};
}

export function pullExperimentAction(data) {
	return {
		type: actionTypes.PULL_EXPERIMENT,
		data: data
	};
}

export function deleteExperimentAction(id) {
	return {
		type: actionTypes.DELETE_EXPERIMENT,
		id: id
	};
}

/*
experimentItem = {
	id: id,
	name: name
}

*/
export function duplicateExperimentAction(experimentItem) {
	return {
		type: actionTypes.DUPLICATE_EXPERIMENT,
		experimentItem: experimentItem
	};
}

export function newExperimentAction() {
	return {
		type: actionTypes.NEW_EXPERIMENT
	};
}

export function saveAsAction(newName) {
	return {
		type: actionTypes.SAVE_AS_PUSH,
		newName: newName
	};
}