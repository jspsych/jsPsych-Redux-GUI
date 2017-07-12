import * as actionTypes from '../constants/ActionTypes';

export function onPluginTypeChange(newPluginVal) {
	return {
		type: actionTypes.CHANGE_PLUGIN_TYPE,
		newPluginVal: newPluginVal
	};
}

export function setPluginParamAction(key, value, setFunc=false) {
	return {
		type: actionTypes.SET_PLUGIN_PARAMTER,
		key: key,
		value: value,
		setFunc: setFunc,
	};
}

export function setPluginParamModeAction(key) {
	return {
		type: actionTypes.SET_PLUGIN_PARAMTER_MODE,
		key: key
	};
}

export function updateMediaAction(s3files) {
	return {
		type: actionTypes.UPDATE_MEDIA,
		s3files: s3files
	};
}