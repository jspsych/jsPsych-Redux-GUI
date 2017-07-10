import * as actionTypes from '../constants/ActionTypes';

export function onPluginTypeChange(newPluginVal) {
	return {
		type: actionTypes.CHANGE_PLUGIN_TYPE,
		newPluginVal: newPluginVal
	};
}

export function setPluginParamAction(key, value) {
	return {
		type: actionTypes.SET_PLUGIN_PARAMTER,
		key: key,
		value: value
	};
}