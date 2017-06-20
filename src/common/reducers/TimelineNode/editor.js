import { deepCopy } from '../../utils';
import * as utils from './utils';

const DEFAULT_PLUGIN_TYPE = 'text';
const DEFAULT_HEADER = 'H';
const DEFAULT_CELL_VALUE = '-';

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

export function arrayOfArrays(arrayOfObjects) {
	var newArray = [];
	var headers = Object.keys(arrayOfObjects[0]);
	var firstRow = [];
	//For each object in the array
	for(let i=0; i<headers.length; i++) { 
		firstRow.push(headers[i]);
	}
	newArray.push(firstRow);

	var currentArray;
	//For each object in array
	for(let i=0; i<arrayOfObjects.length; i++) {
		newArray.push([]);
		//For each column in array
		for(let j=0; j<headers.length; j++) {
			currentArray = arrayOfObjects[i];
			newArray[i+1][j] = currentArray[headers[j]];
		}
	}
	return newArray;
}

export function arrayOfObjects(arrayOfArrays) {
	var array = [];
	var headers = arrayOfArrays[0];
	var currentObj;
	//For number of rows
	for(let i=0; i<(arrayOfArrays.length-1); i++) {
		array.push({});
		//For number of headers
		for(let j=0; j<arrayOfArrays[0].length; j++) {
			let currentHeader = headers[j]; 
		 	currentObj = array[i]; 
		 	currentObj[headers[j]] = arrayOfArrays[i+1][j];
		 	array[i] = currentObj;
		}
	}

	return array;
}

export function changeHeader(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node; 

	var newArray = arrayOfArrays(node.timeline_variable);

	var headerArray = newArray[0];
	headerArray[action.headerId] = action.newVal;

	node.timeline_variable = arrayOfObjects(newArray)

	return new_state;
}

export function changeCell(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	var cellString = action.cellId; //string with row and column index
 	var cellIndex = cellString.split(' '); 
	var newArray = arrayOfArrays(node.timeline_variable);
	var cellRow = cellIndex[0]; 
	
    var cellColumn = cellIndex[1];
    

    newArray[cellRow][cellColumn] = action.newVal;

    node.timeline_variable = arrayOfObjects(newArray);
    
    return new_state;

}

export function addColumnHelper(array) {
	for(let i=1; i<array.length; i++) {
		array[i].push(null);
	}

	return array;
}

var index = 2;
var timelineIDs = ['TIMELINE-0', 'TIMELINE-0'];
var lastIndex = [1];
export function addColumn(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	var newArray = arrayOfArrays(node.timeline_variable);
	// var previous = timelineIDs[1];
	// timelineIDs[0] = previous;
	// timelineIDs[1] =
    
	newArray[0].push(DEFAULT_HEADER + '' + index++);
	addColumnHelper(newArray);
	node.timeline_variable = arrayOfObjects(newArray);

	new_state[state.previewId] = node;

	return new_state;
}

export function addRow(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.timeline_variable.push({DEFAULT_HEADER: DEFAULT_CELL_VALUE});

	return new_state;
}

export function changeSampling(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	node.sampling['type'] = action.newVal;

	new_state[state.previewId] = node;
	return new_state;
}

export function changeSize(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	node.sampling['size'] = action.newVal;

	new_state[state.previewId] = node;
	return new_state;
}

export function changeRandomize(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	node.randomize_order = action.newBool;

	new_state[state.previewId] = node;
	return new_state;
}
