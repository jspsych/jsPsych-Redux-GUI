import { deepCopy } from '../../utils';
import * as utils from './utils';

const DEFAULT_HEADER = 'H';

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

export function choicesHelper(string) {
	let array = [],
		word = [],
		joined,
		s,
		newString='';

	// if(string.match(/{([^}]*)}/g) != undefined) {
	// 	s = string.match(/{([^}]*)}/g);
	// 	array.push(s[1]);
	// 	newString = string.replace(string.match(/{([^}]*)}/g),'');
	// 	console.log(newString);
	// } 

	// if(newString.length > 0) {
	// 	for(let i=0; i<newString.length; i++) {
	// 		array.push(newString[i]);	
	// 	}
	// } else {
	// 	for(let i=0; i<string.length; i++) {
	// 		array.push(string[i]);
	// 	}
	// }
 	
 	//turns string into array
	for(let i=0; i<string.length; i++) {
		array.push(string[i]);
	}

	//look for '{'
	let beginningCurly;
	for(let j=0; j<array.length; j++) {
		if(array[j] == '{') {
			beginningCurly = j;
		}
	}

	let endingCurly;
	for(let k=0; k<array.length; k++) {
		if(array[k] == '}') {
			endingCurly = k; 
		}
	}
	let removed;
	removed = array.splice(beginningCurly, (endingCurly - (beginningCurly)) + 1);
	console.log('removed');
	console.log(removed);
	console.log(removed.join(''));
	console.log('array');
	console.log(array);

	array.push(removed.join(''));

	
	console.log(array);
	return array;
}

export function changeParamText(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);
	let array;
	let nonSingleKey = [];
	let inCurly = false; 

	node = deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters[action.paramId] = choicesHelper(action.newVal);
	console.log(node);

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

	let  cellString = action.cellId; //string with row and column index
 	let  cellIndex = cellString.split(' ');
	let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	let cellRow = cellIndex[0];
    let  cellColumn = cellIndex[1];

    newArray[cellRow][cellColumn] = action.newVal;

    node.parameters.timeline_variables = utils.arrayOfObjects(newArray);
    return new_state;

}

export function addColumnHelper(array) {
	for(let i=1; i<array.length; i++) {
		array[i][array[0].length-1] = undefined;
	}
	return array;
}

var index = 1;
export function addColumn(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	newArray[0].push(DEFAULT_HEADER + '' + index++);
	addColumnHelper(newArray);
	node.parameters.timeline_variables = utils.arrayOfObjects(newArray);

	new_state[state.previewId] = node;
	return new_state;
}

export function addRowHelper(array) {
	array.push([]);
	for(let i=0; i<array[0].length; i++) {
		array[array.length-1][i] = undefined;
	}
	return array;
}

export function addRow(state, action) {
	let node = state[state.previewId];
	console.log("in add row");
	console.log(node);
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);
	addRowHelper(newArray);
	node.parameters.timeline_variables = utils.arrayOfObjects(newArray);

	new_state[state.previewId] = node;
	return new_state;
}

export function deleteColumn(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

    let newArray = utils.arrayOfArrays(node.parameters.timeline_variables);

    if(typeof newArray[0][1] !== 'undefined') {
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

    if(typeof newArray[2] !== 'undefined') {
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

   	if(typeof newArray[0][1] !== 'undefined') {
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

export function changeReps(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = deepCopy(node);

	node.parameters.repetitions = action.newVal;

	new_state[state.previewId] = node;
	return new_state;
}
