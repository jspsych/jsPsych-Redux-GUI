import * as actionTypes from '../constants/ActionTypes';

export function setJspyschInitAction(key, value) {
	return {
		type: actionTypes.SET_JSPSYCH_INIT,
		key: key,
		value: value,
	};
}