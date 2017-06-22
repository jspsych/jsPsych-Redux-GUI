import { deepCopy } from '../../utils';
import * as utils from './utils';

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

	let firstObj;
	let array;
	//let initialArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	console.log(node.parameters.timeline_variables);
	console.log(action.headerId);
	console.log(node.parameters.timeline_variables == undefined && action.headerId == 0);

	if(node.parameters.timeline_variables == undefined && action.headerId == 0) {
		console.log("inside if");
		node.parameters.timeline_variables=[];
		node.parameters.timeline_variables.push({});
		firstObj = node.parameters.timeline_variables[0];
		firstObj[action.newVal] = undefined;
		node.parameters.timeline_variables[0] = firstObj;
	} else {
		console.log("inside else");
		let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
		let headerArray = newArray[0];
		headerArray[action.headerId] = action.newVal;
		node.parameters.timeline_variables = utils.arrayOfObjects(newArray)
	}

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
		array[i].push(null);
	}

	return array;
}

var index = 1;
var timelineIDs = ['TIMELINE-0', 'TIMELINE-0'];
var lastIndex = [1];
export function addColumn(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	var newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	console.log(newArray);
	// var previous = timelineIDs[1];
	// timelineIDs[0] = previous;
	// timelineIDs[1] =
    
	newArray[0].push(DEFAULT_HEADER + '' + index++);
	addColumnHelper(newArray);
	node.parameters.timeline_variables = utils.arrayOfObjects(newArray);

	new_state[state.previewId] = node;

	return new_state;
}

export function addRow(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.timeline_variables.push({DEFAULT_HEADER: DEFAULT_CELL_VALUE});

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
