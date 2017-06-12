import * as actionTypes from '../constants/ActionTypes';

export function onPluginTypeChange(newPluginVal) {
	return {
		type: actionTypes.CHANGE_PLUGIN_TYPE,
		newPluginVal: newPluginVal
	};
}

export function onToggleValue(paramId, newVal) {
	return {
		type: actionTypes.TOGGLE_PARAM_VALUE,
		paramId: paramId,
		newVal: newVal
	};
}

export function onParamTextChange(paramId, newVal) {
	return {
		type: actionTypes.CHANGE_PARAM_TEXT,
		paramId: paramId,
		newVal: newVal
	};
}

