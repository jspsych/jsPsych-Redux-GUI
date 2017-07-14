import * as actionTypes from '../constants/ActionTypes';

export function onPluginTypeChange(newPluginVal) {
	return {
		type: actionTypes.CHANGE_PLUGIN_TYPE,
		newPluginVal: newPluginVal
	};
}

export function setPluginParamAction(key, value, mode="") {
	return {
		type: actionTypes.SET_PLUGIN_PARAMTER,
		key: key,
		value: value,
		mode: mode
	};
}

export function setPluginParamModeAction(key, mode) {
	return {
		type: actionTypes.SET_PLUGIN_PARAMTER_MODE,
		key: key,
		mode: mode
	};
}

export function updateMediaAction(s3files) {
	return {
		type: actionTypes.UPDATE_MEDIA,
		s3files: s3files
	};
}