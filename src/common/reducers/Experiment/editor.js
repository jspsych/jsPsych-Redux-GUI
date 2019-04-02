/**
 *@file This file describes the reducers for editting the parameters of the timeline nodes from jsPsych (timeline, trial)
*/
import { createFuncObj } from './jsPsychInit';

var jsPsych = window.jsPsych;
var EnumPluginType = jsPsych.plugins.parameterType;

/*

*/
/**
 * @typeof {string} ParameterModeEnum
 * @description Indicate which value (native value, function or timeline variable) should be used
 * @readonly
 * @enum {string}
*/
export const ParameterMode = {
	/** The value that indicates deployment function should interpret the value as function when generating the code */
	USE_FUNC: 'USE_FUNC',
	/** The value that indicates deployment function should interpret the value as timeline variable when generating the code */
	USE_TV: "USE_TIMELINE_VARIABLE",
	/** The value that indicates deployment function should interpret the value as native javascript value when generating the code */
	USE_VAL: "USE_VALUE"
}

/**
 * @function isJspsychValueObjectEmpty
 * @param {JspsychValueObject} obj
 * @desc Should originally be a method of the JspsychValueObject class that determines if the object is truly empty. But since
 * AWS.DynamoDB does not store functions, this method is taken out separatly.
 * @returns {boolean}
*/
export const isJspsychValueObjectEmpty = (obj) => {
	switch (obj.mode) {
		case ParameterMode.USE_FUNC:
			return !obj.func.code;
		case ParameterMode.USE_TV:
			return !obj.timelineVariable;
		case ParameterMode.USE_VAL:
		default:
			return !obj.value;
	}
}

/**
 * @typeof {Object} JspsychValueObject
 * @classdesc Class representing a composite value object that holds different kinds of user chosen value source that will
 * be used in generating deployment code
 * @class
 * @public
*/
export class JspsychValueObject {
	/**
     * Create a jsPsychValueObject
     * @param {guiValue} value - The slot that holds native javascript value that user inputs
     * @param {StringifiedFunction} func - The slot that holds user inputs that may or may not be evaluated as experssions/functions
     * @param {guiValue} timelineVariable - The slot that holds the name of timeline variable that will be used
     * @param {ParameterModeEnum} mode - Tells the deployment function which value should it use
     * @property {boolean} isComplexDataObject - Distinguish itself from other object, since AWS.DynamoDB does not take classes
     */
	constructor({value=null, func=createFuncObj(), mode=ParameterMode.USE_VAL, timelineVariable=null}) {
		this.value = value;
		this.func = func;
		this.mode = mode;
		this.timelineVariable = timelineVariable;
		// keep this, as Object.assign does not maintain instanceof result
		this.isComplexDataObject = true;
	}
}

/**
 * @funcion createComplexDataObject
 * @desc Create a jsPsychValueObject
 * @param {guiValue} value=null
 * @param {StringifiedFunction} func=createFuncObject()
 * @param {ParameterModeEnum} mode=ParameterMode.USE_VAL
 * @returns {jsPsychValueObject}
*/
export const createComplexDataObject = (value=null, func=createFuncObj(), mode=ParameterMode.USE_VAL) => (
	new JspsychValueObject({value: value, func: func, mode: mode})
)

/**
 * @typeof {string} GuiIgnoredInforEnum
 * @readonly
 * @enum {string}
 * @description The object that holds enumerators for information that will not be evaluated when generating deployment code
*/
export const TimelineVariableInputType = {
	// string
	TEXT: 'String',
	NUMBER: 'Number',
	LONG_TEXT: 'HTML/Long String',
	// string, but use special editor
	MEDIA: 'Media Resources',
	OBJECT: 'Object',
	ARRAY: 'Array',
	FUNCTION: 'Function'
}

export const isString = (type) => (type === TimelineVariableInputType.TEXT || type === TimelineVariableInputType.LONG_TEXT);

export const isFunction = (type) => (type === TimelineVariableInputType.FUNCTION);

/**
 * @typeof {object} GuiIgnoredInforEnum
 * @readonly
 * @enum {string}
 * @description The object that holds enumerators for information that will not be evaluated when generating deployment code
*/
export const GuiIgonoredInfoEnum = {
	/** The key name to the should-be-ignored gui information object in the parameter */
	root: '$GUI_INFO_IGNORE', // GUI_INFO_IGNORE
	/** The key name to value that represents the user chosen input type for the timeline variables */
	TVHeaderInputType: '$inputType',
	/** The key name to the array that represents the static order headers (reliable table column order) */
	TVHeaderOrder: '$headers',
	/** The key name to the array that holds row ids (for drag and drop) */
	TVRowIds: "$rowId",
}


/** 
 * typeof {object} defaultTimelineParameters
 * @desc the paramters of a timeline node, which are the options in jsPsych timeline
 * @property {Array.<object>} timeline_variables=[{"V0":createComplexDataObject(null) }] - The array that holds the timeline variable table. Here is an example:
 * [
 *  {"Column 1": value1, "Column 2": value2}, // row 1
 *  {"Column 1": value1, "Column 2": value2} // row 2
 * ]
 * See {@link http://www.jspsych.org/}
 * @property {boolean} randomize_order=true - See {@link http://www.jspsych.org/}
 * @property {guiValue} repetitions=null - See {@link http://www.jspsych.org/}
 * @property 
*/
export const DEFAULT_TIMELINE_PARAM = (function() { 
	let obj = {
		timeline_variables: [{
			"V0": createComplexDataObject(null),
		}],
		randomize_order: true,
		repetitions: null,
		sample: {
			type: null,
			size: null
		},
		conditional_function: createFuncObj('function a(d) { return null; }'),
		loop_function: createFuncObj('function a(d) { return null; }'),
	}

	// info to be ignored when generating code
	obj[GuiIgonoredInfoEnum.root] = {};
	obj[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType] = {
		"V0": TimelineVariableInputType.TEXT,
	};
	obj[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder] = [
		"V0",
	];
	obj[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVRowIds] = [
		utils.getUUID()
	];
	return obj;
})();

/** 
 * typeof {object} defaultTrialParameters
 * @desc the paramters of a trial node, which are the options in jsPsych plugin
 * See {@link http://www.jspsych.org/}
 * @property {guiValue} type=null - Tells the plugin being used. 
 * @property {guiValue} options - The options of the used plugin. See {@link http://www.jspsych.org/}
*/
export const DEFAULT_TRIAL_PARAM = {
	type: null,
	//rest is according to corresponding parameters in jsPsych plugin
};

/**@function(state, action)
 * @name setName
 * @description Set timeline/trial node's name 
 * @param {object} state - The Experiment State Object 
 * @param {object} action - Describes the action user invokes
 * @param {guiValue} action.name - The node's user defined name
 * @param {guiValue} action.previewId - The id of the node that is being previewed
 * @returns {object} Returns a completely new Experiment State object
*/
export function setName(state, action) {
	let node = state[state.previewId];
	// just check for safety
	if (!node) return state;

	let new_state = Object.assign({}, state);
	node = utils.deepCopy(node);
	new_state[node.id] = node;

	node.name = action.name;

	return new_state;
}

/**
 * typeof {(object|string)} ParamPathNode
 * @property {ParamPathNode} next
 * @property {number} position - index
 * @property {string} key
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
	let { key: path, value, mode, ifEval, language } = action;

	// update state
	let new_state = Object.assign({}, state);
	let node = utils.deepCopy(new_state[new_state.previewId]);
	new_state[node.id] = node;

	// handle Complex type jsPsych plugin parameter
	let parameter = locateNestedParameterValue(node.parameters, path);

	switch(mode) {
		case ParameterMode.USE_FUNC:
			parameter.func = createFuncObj(value);
			parameter.func.ifEval = !!ifEval;
			parameter.func.language = language;
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
	let node = utils.deepCopy(new_state[new_state.previewId]);
	new_state[node.id] = node;

	let parameter = locateNestedParameterValue(node.parameters, path);

	// toggle effect
	if (toggle) {
		parameter.mode = (mode === parameter.mode) ? ParameterMode.USE_VAL : mode;
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
	let params = utils.injectJsPsychUniversalPluginParameters(jsPsych.plugins[action.newPluginVal].info.parameters);
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
			defaultValue = utils.toNull(paramInfo.default);
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
	node = utils.deepCopy(node);
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
	node = utils.deepCopy(node);
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
	node = utils.deepCopy(node);
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
	node = utils.deepCopy(node);
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
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.repetitions = action.newVal;

	return new_state;
}

export function setLoopFunction(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.loop_function.code = action.newVal;

	return new_state;
}

export function setConditionFunction(state, action) {
	let node = state[state.previewId];
	// update state
	let new_state = Object.assign({}, state);
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.conditional_function.code = action.newVal;

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
	let { colName, rowNum, valueObject } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	// find editting cell
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		node.parameters.timeline_variables[rowNum][colName] = valueObject;
	}

	return new_state;
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
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	// change column name
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let timeline_variables = node.parameters.timeline_variables;
		let inputType = node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType];
		let headers = node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder];

		// update GUI_IGNORE_INFO, header order
		let new_headers = [];
		for (let h of headers) {
			new_headers.push(h === oldName ? newName : h);
		}
		node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder] = new_headers;

		// update GUI_IGNORE_INFO, input type
		inputType[newName] = inputType[oldName];
		delete inputType[oldName];

		// udpate table
		let new_timeline_variables = [];
		for (let i = 0; i < timeline_variables.length; i++) {
			let row = timeline_variables[i];
			let newRow = {};
			for (let h of headers) {
				if (h === oldName) {
					newRow[newName] = row[h];
				} else {
					newRow[h] = row[h];
				}
			}
			new_timeline_variables.push(newRow);
		}
		node.parameters.timeline_variables = new_timeline_variables;
	}

	return new_state;
}

/*
Set timeline variable column name,
action = {
	variableName: string,
	inputType: Enum defined above
}
*/
export function updateTimelineVariableInputType(state, action) {
	let { variableName, inputType, typeCoercion } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;
	let oldType = node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType][variableName];
	node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType][variableName] = inputType;

	if (typeCoercion) {
		switch(inputType) {
			case TimelineVariableInputType.NUMBER:
				for (let row of node.parameters.timeline_variables) {
					row[variableName].value = 0;
				}
				break;
			case TimelineVariableInputType.MEDIA:
			case TimelineVariableInputType.ARRAY:
				for (let row of node.parameters.timeline_variables) {
					row[variableName].value = [];
				}
				break;
			case TimelineVariableInputType.OBJECT:
				for (let row of node.parameters.timeline_variables) {
					row[variableName].value = new Object();
				}
				break;
			case TimelineVariableInputType.TEXT:
			case TimelineVariableInputType.LONG_TEXT:
				for (let row of node.parameters.timeline_variables) {
						row[variableName].value = "";
				}
				break;
			// function
			default:
				for (let row of node.parameters.timeline_variables) {
						row[variableName].mode = ParameterMode.USE_FUNC;
				}
				break;
		}
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
	// let { index } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	// add row
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let timeline_variables = node.parameters.timeline_variables;
		let variables = Object.keys(node.parameters.timeline_variables[0]);
		let row = {};
		
		for (let v of variables) {
			let initVal = null, inputType = node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType][v];
			switch (inputType) {
				case TimelineVariableInputType.NUMBER:
					initVal = 0;
					break;
				case TimelineVariableInputType.MEDIA:
				case TimelineVariableInputType.ARRAY:
					initVal = [];
					break;
				case TimelineVariableInputType.OBJECT:
					initVal = new Object();
					break;
				default:
					break;
			}
			row[v] = createComplexDataObject(initVal);
			if (inputType === TimelineVariableInputType.FUNCTION) {
				row[v].mode = ParameterMode.USE_FUNC;
			}
		}

		timeline_variables.push(row);
		node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVRowIds].push(utils.getUUID());
	}

	return new_state;
}

/*
Add timeline variable col,
action = {
	sourceIndex: number,
	targetIndex: number
}
*/
export function moveRowTo(state, action) {
	let { sourceIndex, targetIndex } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters.timeline_variables.move(sourceIndex, targetIndex);
	node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVRowIds].move(sourceIndex, targetIndex);

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
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	// add column
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let timeline_variables = node.parameters.timeline_variables;
		let variables = Object.keys(node.parameters.timeline_variables[0]);
		let i = 0, name = `V${i}`;
		while (variables.indexOf(name) !== -1) name = `V${++i}`;
		for (let row of timeline_variables) {
			row[name] = createComplexDataObject(null);
		}

		// update header_order, input type (extra info)
		node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder].push(name);
		node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType][name] = TimelineVariableInputType.TEXT;
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
	let new_state;
	// always preserve one row
	if (node.parameters.timeline_variables.length === 1) {
		new_state = addTimelineVariableRow(state);
		node = new_state[new_state.previewId];
	} else {
		new_state = Object.assign({}, state);
	}
	node = utils.deepCopy(node);
	new_state[new_state.previewId] = node;

	// delete row
	node.parameters.timeline_variables.splice(index, 1);
	node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVRowIds].splice(index, 1);

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
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	// delete column
	if (node.parameters.timeline_variables.length > 0) { // no need to check actually
		let timeline_variables = node.parameters.timeline_variables;
		let variables = node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder];
		let target = variables[index];

		// delete header_order, input type (extra info)
		delete node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType][target];
		let new_headers = node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder].filter((n) => (n !== target));
		node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder] = new_headers;

		// delete content
		for (let row of timeline_variables) {
			delete row[target];
		}
		// always preserve one column
		let row = timeline_variables[0];
		if (Object.keys(row).length === 0 && row.constructor === Object) {
			row["V0"] = createComplexDataObject(null);
			node.parameters.timeline_variables = [row];
			node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder] = ["V0"];
			node.parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType].V0 = TimelineVariableInputType.TEXT;
		}
	}

	return new_state;
}

export function setTimelineVariable(state, action) {
	let { table } = action;
	let node = state[state.previewId];

	// update state
	let new_state = Object.assign({}, state);
	node = utils.deepCopy(node);
	new_state[state.previewId] = node;

	node.parameters = table;
	return new_state;
}