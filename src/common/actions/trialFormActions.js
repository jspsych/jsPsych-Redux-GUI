import * as actionTypes from '../constants/ActionTypes';

export function onPluginTypeChange(key) {
	return {
		type: actionTypes.CHANGE_PLUGIN_TYPE,
		key: key
	};
}

export function onToggleValue(newVal) {
	return {
		type: actionTypes.TOGGLE_PARAM_VALUE,
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

