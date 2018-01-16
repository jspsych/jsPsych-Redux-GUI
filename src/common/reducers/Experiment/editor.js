import { deepCopy, convertEmptyStringToNull, injectJsPsychUniversalPluginParameters } from '../../utils';
import { createFuncObj } from './jsPsychInit';

var jsPsych = window.jsPsych || require('./tests/jsPsych.js').jsPsych;
var EnumPluginType = jsPsych.plugins.parameterType;


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
		// displayed as column header col=1     // displayed as (row=1, col=1)
		"Timline Variable 2": "TV 2 value", 
	},  // row 1
	{
		"Timline Variable 1 (displayed as column header col=0)": "TV 1 value (displayed as (row=2, col=0))", 
		"Timline Variable 2 (displayed as column header col=1)": "TV 2 value (displayed as (row=2, col=1))", 
	}, // row 2
]


*/
export const DEFAULT_TIMELINE_PARAM = {
	timeline_variables: [{"V0": createComplexDataObject(null)}],
	randomize_order: true,
	repetitions: null,
	sample: {type: null, size: null},
	conditional_function: createFuncObj('function a(d) { return null; }'),
	loop_function: createFuncObj('function a(d) { return null; }'),
};


/*
Default trial node parameter
*/
export const DEFAULT_TRIAL_PARAM = {
	type: null,
	//rest is according to corresponding parameters in jsPsych plugin
};

/*
Set node name

action = {
	name: new node name
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
path = string or 
	{
		next: object,
		position: number, // index
		key: string,
	}
*/
export function locateNestedParameterValue(parameters, path) {
	let parameterValue = parameters;
	if (typeof path === 'object') {
		// find the complex type jsPsych plugin parameter
		parameterValue = parameterValue[path.key];
		path = path.next;
		while (path) {
			let tmp = parameterValue.value[path.position];
			parameterValue = parameterValue.value[path.position][path.key];
			path = path.next;
		}
	} else {
		parameterValue = parameterValue[path];
	}

	return parameterValue;
}


/*
Set plugin parameter value, (A complexDataObject defined above)

action = {
	// can be object (linkedlist structure) 
	// to denote path to value in complex type jsPsych plugin parameter
	{
		next: object,
		position: number, // index
		key: string,
	}

	key: name of param, // or is the object defined above
	value: new value,
	setFunc: boolean,
}
*/
export function setPluginParam(state, action) {
	let { key: path, value, mode } = action;

	// update state
	let new_state = Object.assign({}, state);
	let node = deepCopy(new_state[new_state.previewId]);
	new_state[node.id] = node;

	// handle Complex type jsPsych plugin parameter
	let parameter = locateNestedParameterValue(node.parameters, path);

	switch(mode) {
		case ParameterMode.USE_FUNC:
			parameter.func = createFuncObj(value);
			break;
		case ParameterMode.USE_TV:
			// toggle effect
			parameter.timelineVariable = (value === parameter.timelineVariable) ? null : value;
			break;
		default:
			parameter.value = value;
	}

	return new_state;
}

/*
Set to use native js value or function or timelineVar (jsPsych)

*/
export function setPluginParamMode(state, action) {
	let { key: path, mode, toggle } = action;

	// update state
	let new_state = Object.assign({}, state);
	let node = deepCopy(new_state[new_state.previewId]);
	new_state[node.id] = node;

	let parameter = locateNestedParameterValue(node.parameters, path);

	// toggle effect
	if (toggle) {
		parameter.mode = (mode === parameter.mode) ? null : mode;
	} else {
		parameter.mode = mode;
	}
	

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
Latter adding check input before this phase

*/

/*
Change plugin type of trial --> update trial.parameters, if same plugin don't update
action = {
	newPluginVal: new plugin name (from jsPsych)
}

*/
export function changePlugin(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	// if same plugin don't update	
	if (node.parameters.type === action.newPluginVal) return new_state;

	// add universal plugin parameters
	let params = injectJsPsychUniversalPluginParameters(jsPsych.plugins[action.newPluginVal].info.parameters);
	// names of parameters
	let paramKeys = Object.keys(params);
	// new npde.parameters object
	let paramsObject = {
		type: action.newPluginVal
	};
	// convert to required data structure
	for (let i = 0; i < paramKeys.length; i++) {
		// parameter name
		let paramName = paramKeys[i];
		// parameter info
		let paramInfo = params[paramName];

		// Converting default value to target data structure procedure:
		// 1. Check if it has nested structure, if it has then defaultValue = []
		// 2. See if its default value is array or object (currently only do shallow converting)
		// 3. Fully convert ==> node.parameters[parameter name] = ComplexObject()

		// default value
		let defaultValue;
		// Check if it has nested structure, if it has then defaultValue = []
		if (paramInfo.type === EnumPluginType.COMPLEX) {
			defaultValue = [];
		} else {
			defaultValue = convertEmptyStringToNull(paramInfo.default);
		}

		// ***** Current converting is all shallow *****
		// See if its default value is array or object (currently only do shallow converting)
		if (Array.isArray(defaultValue)) {
			defaultValue = defaultValue.map((v) => (createComplexDataObject(v)));
		} else if (typeof defaultValue === 'object' && defaultValue) {
			let res = {};
			for (let key of Object.keys(defaultValue)) {
				res[key] = createComplexDataObject(defaultValue[key]);
			}
			defaultValue = res;
		}
		// ***** Current converting is all shallow *****
		
		// fully convert ==> node.parameters[parameter name] = ComplexObject()
		paramsObject[paramName] = createComplexDataObject(defaultValue);
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
	value: boolean
}
*/
export function setRandomize(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.randomize_order = action.value;

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

export function setLoopFunction(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.loop_function.code = action.newVal;

	return new_state;
}

export function setConditionFunction(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.conditional_function.code = action.newVal;

	return new_state;
}

/*
Set timeline variable by updating whole row (data handled by react-data-grid),
action = {
	fromRow: number,
	toRow: number,
	updated: new value
}
*/
export function updateTimelineVariableRow(state, action) {
	let { fromRow, toRow, updated } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	for (let i = fromRow; i <= toRow; i++) {
		for (let key of Object.keys(updated)) {
			node.parameters.timeline_variables[i][key] = (updated[key] === "") ? null : updated[key];
		}
	}

	return new_state;
}

/*
Set timeline variable cell code,
action = {
	row: number,
	col: number,
	toggleUseFunc: boolean, 
	code: string
}
*/
export function updateTimelineVariableCell(state, action) {
	let { row, col, toggleUseFunc, code } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	// find editting cell
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let chosenCol = Object.keys(node.parameters.timeline_variables[0])[col];
		let chosenCell = node.parameters.timeline_variables[row][chosenCol];

		// only set mode
		if (toggleUseFunc) {
			chosenCell.mode = (chosenCell.mode === ParameterMode.USE_FUNC) ? null : ParameterMode.USE_FUNC;
		} else {
			chosenCell.func.code = code;
		}
	}

	return new_state
}

/*
Set timeline variable column name,
action = {
	oldName: string,
	newName: string,
}

Prerequsite:
The newName shall not equal to any other column name.
This should be checked before calling this function.
*/
export function updateTimelineVariableName(state, action) {
	let { oldName, newName } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	// change column name
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let timeline_variables = node.parameters.timeline_variables;
		let variables = Object.keys(node.parameters.timeline_variables[0]);
		let new_timeline_variables = [];
		for (let i = 0; i < timeline_variables.length; i++) {
			let row = timeline_variables[i];
			let newRow = {};
			for (let v of variables) {
				if (v === oldName) {
					newRow[newName] = row[v];
				} else {
					newRow[v] = row[v];
				}
			}
			new_timeline_variables.push(newRow);
		}

		node.parameters.timeline_variables = new_timeline_variables;
	}

	return new_state;
}


/*
Add timeline variable row,
action = {
	// insert new row at which position
	index: number, 
}
*/
export function addTimelineVariableRow(state, action) {
	let { index } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	// add row
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let timeline_variables = node.parameters.timeline_variables;
		let variables = Object.keys(node.parameters.timeline_variables[0]);
		let row = {};
		for (let v of variables) {
			row[v] = createComplexDataObject(null);
		}
		timeline_variables.push(row);
		if (index > -1) {
			timeline_variables.move(timeline_variables.length-1, index);
		}
	}

	return new_state;
}


/*
Add timeline variable col,
action = {
}
*/
export function addTimelineVariableColumn(state, action) {
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	// add column
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let timeline_variables = node.parameters.timeline_variables;
		let variables = Object.keys(node.parameters.timeline_variables[0]);
		let i = 0, name = `V${i}`;
		while (variables.indexOf(name) !== -1) name = `V${++i}`;
		for (let row of timeline_variables) row[name] = createComplexDataObject(null);
	}
	
	return new_state;
}

/*
Delete timeline variable row,
action = {
	// delete which row
	index: number,
}
*/
export function deleteTimelineVariableRow(state, action) {
	let { index } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	// delete row
	// always preserve one row
	if (node.parameters.timeline_variables.length === 1) { 
		let row = node.parameters.timeline_variables[0];
		for (let v of Object.keys(row)) {
			row[v] = createComplexDataObject(null);
		}
	} else {
		node.parameters.timeline_variables.splice(index, 1);
	}
	

	return new_state;
}

/*
Delete timeline variable col,
action = {
	// delete which col
	index: number,
}
*/
export function deleteTimelineVariableColumn(state, action) {
	let { index } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[state.previewId] = node;

	// delete column
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let timeline_variables = node.parameters.timeline_variables;
		let variables = Object.keys(node.parameters.timeline_variables[0]);
		let target = variables[index];
		for (let row of timeline_variables) {
			delete row[target];
		}
		// always preserve one column
		let row = timeline_variables[0];
		if (Object.keys(row).length === 0 && row.constructor === Object) {
			row["V0"] = createComplexDataObject(null);
			node.parameters.timeline_variables = [row];
		}
	}

	return new_state;
}