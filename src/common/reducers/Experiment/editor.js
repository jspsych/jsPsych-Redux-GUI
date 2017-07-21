import { deepCopy, convertEmptyStringToNull, injectJsPsychUniversalPluginParameters } from '../../utils';
import { createFuncObj } from './jsPsychInit';


/*
Indicate which value (native value, function or timeline variable) should be used
*/
export const ParameterMode = {
	USE_FUNC: 'USE_FUNC',
	USE_TV: "USE_TIMELINE_VARIABLE"
}

/*
Every editor item that is from jsPsych plugin parameter is a composite object defined below
*/
export const createComplexDataObject = (value=null, func=createFuncObj(), mode=null) => ({
	isComplexDataObject: true,

	// native js value
	value: value,

	// function object 
	// (used to denote that it is a function and func.code stores the stringified function)
	func: func,

	// ParameterMode
	mode: mode, 

	// timeline variable (name)
	timelineVariable: null,
})

/*
Default timeline node parameter

According to jsPysch
timeline_variables should have the following data structure:

[
	{		
		// displayed as column header col=0     // displayed as (row=1, col=0)
		"Timline Variable 1":                   "TV 1 value", 
		// displayed as column header col=1     // displayed as (row=2, col=0)
		"Timline Variable 2": "TV 2 value", 
	},  // row 1
	{
		"Timline Variable 1 (displayed as column header col=0)": "TV 1 value (displayed as (row=2, col=0))", 
		"Timline Variable 2 (displayed as column header col=1)": "TV 2 value (displayed as (row=2, col=1))", 
	}, // row 2
]


*/
export const DEFAULT_TIMELINE_PARAM = {
	timeline_variables: [],
	randomize_order: true,
	repetitions: null,
	sample: {type: null, size: null},
	conditional_function: createFuncObj('function a(d) { return null; }'),
	loop_function: createFuncObj('function a(d) { return null; }'),
};


/*
Default timeline node parameter
*/
export const DEFAULT_TRIAL_PARAM = {
	type: null,
};

/*
Set experiment name

action = {
	name: new experiment name
}
*/
export function setName(state, action) {
	let node = state[state.previewId];
	if (!node) return state;

	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[node.id] = node;

	node.name = action.name;

	return new_state;
}

/*
Set plugin parameter value, (A complexDataObject defined above)

action = {
	key: name of param,
	value: new value,
	setFunc: boolean,
}
*/
export function setPluginParam(state, action) {
	let { key, value, mode } = action;

	// update state
	let new_state = Object.assign({}, state);
	let node = deepCopy(new_state[new_state.previewId]);
	new_state[node.id] = node;

	switch(mode) {
		case ParameterMode.USE_FUNC:
			node.parameters[key].func = createFuncObj(value);
			break;
		case ParameterMode.USE_TV:
			// toggle effect
			node.parameters[key].timelineVariable = (value === node.parameters[key].timelineVariable) ? null : value;
			break;
		default:
			node.parameters[key].value = value;
	}

	return new_state;
}

/*
Set to use native js value or function or timelineVar (jsPsych)

*/
export function setPluginParamMode(state, action) {
	let { key, mode } = action;

	// update state
	let new_state = Object.assign({}, state);
	let node = deepCopy(new_state[new_state.previewId]);
	new_state[node.id] = node;

	// toggle effect
	node.parameters[key].mode = (mode === node.parameters[key].mode) ? null : mode;

	return new_state;
}

/*
Update s3 files
*/
export function updateMedia(state, action) {
	return Object.assign({}, state, {
		media: action.s3files
	});
}

/*
Change plugin type of trial --> update trial.parameters

*/
export function changePlugin(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	// add universal plugin parameters
	let params = injectJsPsychUniversalPluginParameters(window.jsPsych.plugins[action.newPluginVal].info.parameters);
	let paramKeys = Object.keys(params);
	let paramsObject = {
		type: action.newPluginVal
	};
	for (let i = 0; i < paramKeys.length; i++) {
		// every trial data is a composite object defined above
		paramsObject[paramKeys[i]] = createComplexDataObject(convertEmptyStringToNull(params[paramKeys[i]].default));
	}

	// update trial node
	node = deepCopy(node);
	node.parameters = paramsObject;
	new_state[state.previewId] = node;

	return new_state;
}

/*
Set sampling method
action = {
	// sampling method
	newVal: string
}
*/
export function setSamplingMethod(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.sample['type'] = action.newVal;
	
	return new_state;
}

/*
Set sample size
action = {
	// sample size
	newVal: number
}
*/
export function setSampleSize(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.sample['size'] = action.newVal;

	return new_state;
}

/*
Toggle if randomized timeline variable
action = {

}
*/
export function toggleRandomize(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.randomize_order = action.newBool;

	return new_state;
}

/*
Set repetition times for trials under timeline,
action = {
	// wanted repetition number
	newVal: number 
}
*/
export function setRepetitions(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.repetitions = action.newVal;

	return new_state;
}

/*
Set timeline variable,
action = {
	// should have been processed to be in jsPsych friendly form
	// such form is stated above DEFAULT_TIMELINE_PARAM
	timeline_variables: array
}
*/
export function setTimelineVariable(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.timeline_variables = action.timeline_variables;

	return new_state;
}
