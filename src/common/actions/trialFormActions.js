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

export function onChoicesChange(paramId, newVal) {
	return {
		type: actionTypes.CHANGE_CHOICES,
		paramId: paramId,
		newVal: newVal
	};
}

export function onCheckChange(paramId, newVal) {
	return {
		type: actionTypes.CHANGE_CHECK,
		paramId: paramId,
		newVal: newVal
	};
}

export function onParamIntChange(paramId, newVal) {
	return {
		type: actionTypes.CHANGE_PARAM_INT,
		paramId: paramId,
		newVal: newVal
	};
}

export function onParamFloatChange(paramId, newVal) {
	return {
		type: actionTypes.CHANGE_PARAM_FLOAT,
		paramId: paramId,
		newVal: newVal
	};
}
