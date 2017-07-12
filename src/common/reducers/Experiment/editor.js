import { deepCopy, convertEmptyStringToNull } from '../../utils';
import * as utils from './utils';
import { createFuncObj } from './jsPsychInit';
const DEFAULT_HEADER = 'H';

export const createComposite = (value=null, func=createFuncObj(), useFunc=false) => ({
	isComposite: true,
	value: value,
	func: func,
	useFunc: useFunc
})

export const DEFAULT_TIMELINE_PARAM = {
	timeline_variables: [{H0: undefined}],
	randomize_order: true,
	repetitions: undefined,
	sampling: {type: undefined, size: undefined},
	conditional_function: undefined,
	loop_function: undefined,
};

export const DEFAULT_TRIAL_PARAM = {
		type: 'text',
		text: createComposite(),
		choices: createComposite(),
		allow_mouse_click: createComposite(),
};

/*
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
action = {
	key: name of param,
	value: new value,
	setFunc: boolean,
}
*/
export function setPluginParam(state, action) {
	let { key, value, setFunc } = action;

	let new_state = Object.assign({}, state);
	let node = deepCopy(new_state[new_state.previewId]);
	new_state[node.id] = node;
	node.parameters[key] = Object.assign({}, node.parameters[key]);
	if (setFunc) {
		node.parameters[key].func = createFuncObj(value);
	} else {
		node.parameters[key].value = value;
	}
	return new_state;
}

export function setPluginParamMode(state, action) {
	let { key } = action;

	let new_state = Object.assign({}, state);
	let node = deepCopy(new_state[new_state.previewId]);
	new_state[node.id] = node;
	node.parameters[key] = Object.assign({}, node.parameters[key], {
		useFunc: !node.parameters[key].useFunc
	});

	return new_state;
}

export function updateMedia(state, action) {
	return Object.assign({}, state, {
		media: action.s3files
	});
}

export function changePlugin(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);


	let params = window.jsPsych.plugins[action.newPluginVal].info.parameters;
	let paramKeys = Object.keys(params);

	var paramsObject = {
		type: action.newPluginVal
	};

	for (let i = 0; i < paramKeys.length; i++) {
		paramsObject[paramKeys[i]] = createComposite(convertEmptyStringToNull(params[paramKeys[i]].default));
	}

	node = deepCopy(node);

	node.parameters = paramsObject;
	new_state[state.previewId] = node;

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
