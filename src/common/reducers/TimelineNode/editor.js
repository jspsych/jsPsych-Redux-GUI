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


export function createTable(id,
	timelineId,
	headerId,
	rowId,
	cellValue={}) {

	return {
		id: id,
		timelineId: utils.getTimelineId(),
		headerId: utils.getHeaderId(),
		rowId: utils.getRowId(),
		cellValue: cellValue
	};
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
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node; 

	// node.timeline_variable = Object.assign({}, node.timeline_variable);
	// console.log("node.timeline_variable " + node.timeline_variable);
	//var array = [];

	// for(let i=0; i<node.timeline_variable.length; i++) {
	// 	// let rowCopy = Object.assign({}, node.timeline_variable[i]);
	// 	// array.push({rowCopy});
	// 	var clonedArray = JSON.parse(JSON.stringify(nodesArray))
	// }

	const newArray = node.timeline_variable.map(obj => Object.assign({}, obj));

	for(let i=0; i<node.timeline_variable.length; i++) {
		// node.timeline_variable[i][action.newVal] = node.timeline_variable[i][action.headerId];
		// delete node.timeline_variable[i][action.headerId];
		newArray[i][action.newVal] = newArray[i][action.headerId];
		delete newArray[i][action.headerId];
	}

	node.timeline_variable = newArray;
	return new_state;
}

export function changeCell(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	//node.timeline_variable = Object.assign({}, node.timeline_variable);
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

// function changeHeader(state, action) {
// 	let table = state[state.previewId];
// 	let new_state = Object.assign({}, state);

// 	let cellId = action.cellId;

// 	table = copyTable(table);
// 	new_state[] = action.cellId
// }
