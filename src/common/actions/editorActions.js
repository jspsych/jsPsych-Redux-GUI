import * as actionTypes from '../constants/ActionTypes';

// update media
export function updateMediaAction(s3files) {
	return {
		type: actionTypes.UPDATE_MEDIA,
		s3files: s3files
	};
}

/* ********************** Trial form ********************** */
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
/* ********************** Trial form ********************** */


/* ********************** Timeline form ********************** */
export function setTimelineVariableAction(timelineVariables) {
	return {
		type: actionTypes.SET_TIMELINE_VARIABLES,
		timeline_variables: timelineVariables,
	}
}

export function setSamplingMethodAction(key, newVal) {
	return {
		type: actionTypes.SET_SAMPLING_METHOD,
		key: key,
		newVal: newVal
	};
}

export function setSampleSizeAction(newVal) {
	return {
		type: actionTypes.SET_SAMPLE_SIZE,
		newVal: newVal
	};
}

export function toggleRandomizeAction(newBool) {
	return {
		type: actionTypes.TOGGLE_RANDOMIZE,
		newBool: newBool
	};
}


export function setRepetitionsAction(newVal) {
	return {
		type: actionTypes.SET_REPETITIONS,
		newVal: newVal
	};
}
/* ********************** Timeline form ********************** */