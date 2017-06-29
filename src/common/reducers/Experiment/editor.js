import { deepCopy } from '../../utils';
import * as utils from './utils';

const DEFAULT_HEADER = 'H';
const DEFAULT_CELL_VALUE = ' ';

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

	var paramsObject = { type: action.newPluginVal };

	for(let i=0; i<paramKeys.length; i++) {
		paramsObject[paramKeys[i]] = params[paramKeys[i]].default;
	}

	node = deepCopy(node);

	node.parameters = paramsObject;
	new_state[state.previewId] = node; 
	
	return new_state;
}

export function changeToggleValue(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters[action.paramId] = action.newVal;

	return new_state;
}

export function changeParamText(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters[action.paramId] = action.newVal;

	return new_state;
}

export function changeParamInt(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters[action.paramId] = action.newVal;

	return new_state; 
}

export function changeParamFloat(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters[action.paramId] = action.newVal;

	return new_state; 
}


export function changeHeader(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node; 

	let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	let headerArray = newArray[0];
	headerArray[action.headerId] = action.newVal;
	node.parameters.timeline_variables = utils.arrayOfObjects(newArray)

	return new_state;
}

export function changeCell(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	var cellString = action.cellId; //string with row and column index
 	var cellIndex = cellString.split(' '); 
	var newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	var cellRow = cellIndex[0]; 
	
    var cellColumn = cellIndex[1];
    

    newArray[cellRow][cellColumn] = action.newVal;

    node.parameters.timeline_variables = utils.arrayOfObjects(newArray);
    
    return new_state;

}

export function addColumnHelper(array) {
	for(let i=1; i<array.length; i++) {
		array[i][array[0].length-1] = '';
	}
	return array;
}

var index = 1;
export function addColumn(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	var newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	console.log(newArray);
    
	newArray[0].push(DEFAULT_HEADER + '' + index++);
	addColumnHelper(newArray);
	console.log("after column helper");
	console.log(newArray);
	node.parameters.timeline_variables = utils.arrayOfObjects(newArray);

	new_state[state.previewId] = node;
	console.log(node);
	return new_state;
}

export function addRowHelper(array) {
	array.push([]);
	for(let i=0; i<array[0].length; i++) {
		array[array.length-1][i] = '';
	}
	return array;
}

export function addRow(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	
	// node.parameters.timeline_variables.push({DEFAULT_HEADER: DEFAULT_CELL_VALUE});
	let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	addRowHelper(newArray);
	node.parameters.timeline_variables = utils.arrayOfObjects(newArray);

	new_state[state.previewId] = node;
	console.log(node);
	return new_state;
}

export function deleteColumn(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	
    let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);

    if(newArray[0][1] != undefined) {
    	let transformColumns = utils.arrayOfColumns(newArray);
    	transformColumns.splice(action.titleIndex,1);
    
    	node.parameters.timeline_variables = utils.backToArrayOfArrays(transformColumns);
    	node.parameters.timeline_variables = utils.arrayOfObjects(node.parameters.timeline_variables);
    }
    new_state[state.previewId] = node;
	return new_state;
}

export function deleteRow(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

    let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
 
    if(newArray[2] != undefined) {
     	newArray.splice(action.rowIndex, 1);
    	node.parameters.timeline_variables = utils.arrayOfObjects(newArray);
    }
 	new_state[state.previewId] = node;
	return new_state;
}

export function deleteColumnHeader(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
    let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
   
   	if(newArray[0][1] != undefined) {
    	let transformColumns = utils.arrayOfColumns(newArray);
    	transformColumns.splice(action.titleIndex,1);
    
    	node.parameters.timeline_variables = utils.backToArrayOfArrays(transformColumns);
    	node.parameters.timeline_variables = utils.arrayOfObjects(node.parameters.timeline_variables);
    }
    new_state[state.previewId] = node;
	return new_state;
}

export function changeSampling(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	node.parameters.sampling['type'] = action.newVal;

	new_state[state.previewId] = node;
	return new_state;
}

export function changeSize(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	node.parameters.sampling['size'] = action.newVal;

	new_state[state.previewId] = node;
	return new_state;
}

export function changeRandomize(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	node.parameters.randomize_order = action.newBool;

	new_state[state.previewId] = node;
	return new_state;
}
