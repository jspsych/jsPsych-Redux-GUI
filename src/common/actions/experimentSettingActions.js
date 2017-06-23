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

export function playAllAction() {
	return {
		type: actionTypes.PLAY_ALL,
	};
}