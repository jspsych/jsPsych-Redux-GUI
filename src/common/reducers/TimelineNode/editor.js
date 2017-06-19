import { deepCopy } from '../../utils';
import * as utils from './utils';

export function setName(state, action) {
	let node = state[state.previewId];
	if (!node) return state;

	let new_state = Object.assign({}, state);
	node = deepCopy(node);
	new_state[node.id] = node;

	node.name = action.name;

	return new_state;
}


export function changePlugin(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);


	let params = window.jsPsych.plugins[action.newPluginVal].info.parameters;
	let paramKeys = Object.keys(params);

	var paramsObject = {};

	for(let i=0; i<paramKeys.length; i++) {
		paramsObject[paramKeys[i]] = params[paramKeys[i]].default;

	}

	node = deepCopy(node);

	node.pluginType = action.newPluginVal; 
	node.parameters = paramsObject;
	new_state[state.previewId] = node; 
	
	return new_state;
}

export function changeToggleValue(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state;
}

export function changeParamText(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	console.log(node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state;
}

export function changeParamInt(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state; 
}

export function changeParamFloat(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state; 
}

export function changeHeader(state, action) {
	console.log("Inside reducer");
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node; 

	var newArray = arrayOfArrays(node.timeline_variable);
	return new_state;
}

export function changeCell(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	const newArray = node.timeline_variable.map(obj => Object.assign({}, obj));

	let cellString = action.cellId; //string with row and column index
	var cellIndex = cellString.split(' '); 
	var columns = Object.keys(node.timeline_variable[0]); //array of headers
	console.log(columns[2]);

	var cellRow = cellIndex[0];
	var cellColumn = cellIndex[1];
	console.log("cellRow " + cellRow);
	console.log("cellColumn " + cellColumn);

	//var currentRow = node.timeline_variable[cellRow];
	var currentRow = newArray[cellRow];

	currentRow[columns[cellColumn]] = action.newVal;
    console.log("currentRow[columns[cellColumn]] " + currentRow[columns[cellColumn]]);
    
    node.timeline_variable = newArray;
    return new_state; 
}

export function addColumn(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	new_state[state.previewId] = node;

	for(let i=0; i<node.timeline_variable.length; i++) {
		node.timeline_variable[i].newHeader = null; 
	}

	return new_state;
}