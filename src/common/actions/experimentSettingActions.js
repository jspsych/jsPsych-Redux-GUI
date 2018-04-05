import * as actionTypes from '../constants/ActionTypes';

export const setExperimentNameAction = (name) => ({
	type: actionTypes.SET_EXPERIMENT_NAME,
	name: name,
});

export function setJspyschInitAction(key, value) {
	return {
		type: actionTypes.SET_JSPSYCH_INIT,
		key: key,
		value: value,
	};
}

export function setOsfTokenAction(id, token) {
	return {
		type: actionTypes.SET_EXPERIMENT_OSF_TOKEN,
		id: id,
		token: token
	}
}

export function setOsfNodeAction(id, node) {
	return {
		type: actionTypes.SET_OSF_PARENT,
		id: id,
		node: node
	}
}

export function setCloudSaveDataAfterAction(id, index) {
	return {
		type: actionTypes.SET_CLOUD_SAVE_DATA_AFTER,
		id: id,
		index: index
	}
}