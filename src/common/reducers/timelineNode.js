/*
This file is the reducers for timelineNode class from jsPsych (timeline, trial)

A timeline state = {
	id: string,
	type: string,
	name: string,
	// if its parent is mainTimeline, null
	parent: string,
	childrenById: array,
	collapsed: boolean,
	enabled: boolean,
	// jsPsych timeline properties
	parameters: object,
}

A trial state = {
	id: string,
	type: string,
	name: string,
	// if its parent is mainTimeline, null
	parent: string,
	enabled: boolean,
	// specific parameters decided by which plugin user chooses
	parameters: object,
}

*/

import * as actionTypes from '../constants/ActionTypes';
import * as utils from '../constants/utils';

const DEFAULT_TIMELINE_NAME = 'Untitled Timeline';
const DEFAULT_TRIAL_NAME = 'Untitled Trial';
const DEFAULT_PLUGIN_TYPE = 'text';

var timeline = 0;
var trial = 0;

export const initState = {
	// id of which is being previewed/editted
	previewId: null,

	// the main timeline. array of ids
	mainTimeline: [],
}

export default function(state=initState, action) {
	switch(action.type) {
		case actionTypes.ADD_TIMELINE:
			return addTimeline(state, action);
		case actionTypes.DELETE_TIMELINE:
			return deleteTimeline(state, action);
		case actionTypes.ADD_TRIAL:
			return addTrial(state, action);
		case actionTypes.DELETE_TRIAL:
			return deleteTrial(state, action);
		case actionTypes.MOVE_NODE:
			return moveNode(state, action);
		case actionTypes.ON_PREVIEW:
			return onPreview(state, action);
		case actionTypes.ON_TOGGLE:
			return onToggle(state, action);
		case actionTypes.SET_COLLAPSED:
			return setCollapsed(state, action);
		case actionTypes.CHANGE_PLUGIN_TYPE:
			return changePlugin(state, action);
		case actionTypes.TOGGLE_PARAM_VALUE:
			return changeToggleValue(state, action);
		case actionTypes.CHANGE_PARAM_TEXT:
			return changeParamText(state, action);
		case actionTypes.CHANGE_PARAM_INT: 
			return changeParamInt(state, action);
		case actionTypes.CHANGE_PARAM_FLOAT:
			return changeParamFloat(state, action);
		default:
			return state;
	}
}


/**************************  Helper functions  ********************************/

var __TEST__ = 0;
export function enterTest() {
	__TEST__ = 1;
}

function getNodeById(state, id) {
	if (id === null)
		return null;
	return state[id];
}

export function getLevel(state, node) {
	if (node.parent === null)
		return 0;
	else
		return 1 + getLevel(state, getNodeById(state, node.parent));
}

export function getIndex(state, node) {
	if (node.parent === null) {
		return state.mainTimeline.indexOf(node.id);
	} else {
		return state[node.parent].childrenById.indexOf(node.id);
	}
}

const getDefaultTimelineName = () => {
	if (__TEST__)
		return DEFAULT_TIMELINE_NAME;
	return DEFAULT_TIMELINE_NAME + " " + (timeline++);
};
const getDefaultTrialName = () => {
	if (__TEST__)
		return DEFAULT_TRIAL_NAME;
	return DEFAULT_TRIAL_NAME + " " + (trial++);
};

/*
Decides if source node is ancestor of target node

*/
function isAncestor(state, sourceId, targetId) {
	let target = getNodeById(state, targetId);

	while (target && target.parent !== null) {
		if (target.parent === sourceId)
			return true;
		target = getNodeById(target.parent);
	}

	return false;
}

/*
Decides if source node can be moved under target node
Two case it can't:
1. target node is a trial
2. source node is ancestor of target node

If targetId is null, always true
*/
function canMoveUnder(state, sourceId, targetId) {
	if (!targetId) return true;

	if (utils.isTrial(state[targetId]) ||
		isAncestor(state, sourceId, targetId)) {
		return false;
	}

	return true;
}

export function createTimeline(id,
	parent=null,
	name=getDefaultTimelineName(),
	childrenById=[],
	collapsed=true,
	enabled=true,
	parameters={}) {

	return {
		id: id,
		type: utils.TIMELINE_TYPE,
		name: name,
		parent: parent,
		childrenById: childrenById,
		collapsed: collapsed,
		enabled: enabled,
		parameters: parameters
	};
}

// define deep copy for parameters later
function copyTimeline(timeline) {
	return createTimeline(timeline.id,
		timeline.parent,
		timeline.name,
		timeline.childrenById.slice(),
		timeline.collapsed,
		timeline.enabled,
		timeline.parameters)
}


export function createTrial(id,
	parent=null,
	name=getDefaultTrialName(),
	enabled=true,
	parameters={text: '', choices: ''},
	pluginType=DEFAULT_PLUGIN_TYPE) {

	return {
		id: id,
		type: utils.TRIAL_TYPE,
		name: name,
		parent: parent,
		enabled: enabled,
		parameters: parameters,
		pluginType: pluginType
	};
}

function copyTrial(trial) {
	return createTrial(trial.id,
		trial.parent,
		trial.name,
		trial.enabled,
		trial.parameters,
		trial.pluginType)
}

/*
action = {
	id: id,
	parent: string,
}
*/
function addTimeline(state, action) {
	let new_state = Object.assign({}, state);

	let id = action.id;
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: childrenById
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let timeline = createTimeline(id, action.parent)

	new_state[id] = timeline;

	return new_state;
}

/*
action = {
	id: string,
	parent: string,
}
*/
function addTrial(state, action) {
	let new_state = Object.assign({}, state);

	let id = action.id;
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: main timeline
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let trial = createTrial(id, action.parent)

	new_state[id] = trial;
	return new_state;
}

function deleteTimelineHelper(state, id) {
	let timeline = getNodeById(state, id);

	// delete its children
	timeline.childrenById.map((childId) => {
		if (utils.isTimeline(state[childId])) {
			state = deleteTimelineHelper(state, childId);
		} else {
			state = deleteTrialHelper(state, childId)
		}
	});

	// delete itself
	let parent = timeline.parent;
	if (parent === null) { // that is, main timeline
		state.mainTimeline = state.mainTimeline.filter((item) => (item !== id));
	} else {
		parent =  getNodeById(state, parent)
		parent = copyTimeline(parent);
		state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== id));
	}
	if (state.previewId === id) state.previewId = null;
	delete state[id];

	return state;
}

/*
action = {
	id: string
}
*/
function deleteTimeline(state, action) {
	let new_state = Object.assign({}, state);

	return deleteTimelineHelper(new_state, action.id);
}



function deleteTrialHelper(state, id) {
	let trial = getNodeById(state, id);
	let parent = trial.parent;

	if (parent === null) { // that is, main timeline
		state.mainTimeline = state.mainTimeline.filter((item) => (item !== id));
	} else {
		parent = getNodeById(state, parent);
		parent = copyTimeline(parent);
		state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== id));
	}

	if (state.previewId === id) state.previewId = null;
	delete state[id];

	return state;
}

/*
action = {
	id: string
}
*/
function deleteTrial(state, action) {
	let new_state = Object.assign({}, state);

	return deleteTrialHelper(new_state, action.id);
}


/*
Move Node

action = {
	sourceId: string,
	targetId: string,
	up: boolean,
}

*/
export const DRAG_TYPE = {
	// source and target have the same parent
	DISPLACEMENT: 1,
	// source takes target as new parent
	TRANSPLANT: 2,
	// different level displacement
	JUMP: 3,
}

function moveNode(state, action) {
	if (action.sourceId === action.targetId) return state;

	console.log(action)

	switch (action.dragType) {
		case DRAG_TYPE.TRANSPLANT:
			return nodeTransplant(state, action);
		case DRAG_TYPE.DISPLACEMENT:
			return nodeDisplacement(state, action);
		case DRAG_TYPE.JUMP:
			return nodeJump(state, action);
		default:
			return state;
	}
}

function handleIndex(up, index) {
	if (up) index--;
	else index++;
	return (index < 0) ? 0 : index;
}

// source and target have the same parent
function nodeDisplacement(state, action) {
	let source = state[action.sourceId];
	if (utils.isTimeline(source)) {
		source = copyTimeline(source);
	} else {
		source = copyTrial(source);
	}
	let target = state[action.targetId];
	let targetIndex = getIndex(state, target);

	let new_state = Object.assign({}, state);

	let arr;
	// source was in the main timeline
	if (source.parent === null) {
		new_state.mainTimeline = state.mainTimeline.slice();
		arr = new_state.mainTimeline;
	} else {
		let parent = copyTimeline(new_state[source.parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}

	let from = arr.indexOf(source.id);
	let to = handleIndex(action.up, targetIndex);
	arr.move(from, to);

	return new_state;
}

// source takes target as new parent
function nodeTransplant(state, action) {
	if (canMoveUnder(state, action.sourceId, action.targetId)) {
		let new_state = Object.assign({}, state);

		let source = new_state[action.sourceId];
		if (utils.isTimeline(source)) {
			source = copyTimeline(source);
		} else {
			source = copyTrial(source);
		}
		let target = copyTimeline(new_state[action.targetId]);

		new_state[source.id] = source;
		new_state[target.id] = target;
		target.collapsed = false;

		if (source.parent === target.id)
			return new_state;

		// source was in the main timeline
		if (source.parent === null) {
			new_state.mainTimeline = state.mainTimeline.slice();
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== source.id));
		} else {
			let oldParent = copyTimeline(new_state[source.parent]);
			new_state[oldParent.id] = oldParent;
			oldParent.childrenById = oldParent.childrenById.filter((id) => (id !== source.id));
		}

		source.parent = target.id;
		if (target.childrenById.indexOf(source.id) === -1) {
			target.childrenById.push(source.id);
		}

		return new_state;
	} else {
		return state;
	}
}

// different level displacement
// that is, two items have different parent
function nodeJump(state, action) {
	let canJump = true;
	if (utils.isTimeline(state[action.sourceId])) {
		canJump = !isAncestor(state, action.sourceId, action.targetId);
	}

	if (canJump) {
		let new_state = Object.assign({}, state);

		let source = new_state[action.sourceId];
		if (utils.isTimeline(source)) {
			source = copyTimeline(source);
		} else {
			source = copyTrial(source);
		}
		let target = new_state[action.targetId];

		new_state[source.id] = source;

		let targetParentId = target.parent;
		// source was in the main timeline
		// delete itself from old parent
		if (source.parent === null) {
			new_state.mainTimeline = state.mainTimeline.slice();
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== source.id));
		} else {
			let oldParent = copyTimeline(new_state[source.parent]);
			new_state[oldParent.id] = oldParent;
			oldParent.childrenById = oldParent.childrenById.filter((id) => (id !== source.id));
		}

		// add source to new parent
		source.parent = targetParentId;
		// target parent is main timeline
		let targetIndex, arr;
		if (targetParentId === null) {
			new_state.mainTimeline = state.mainTimeline.slice();
			arr = new_state.mainTimeline;
		} else {
			let targetParent = copyTimeline(new_state[targetParentId]);
			new_state[targetParentId] = targetParent;
			arr = targetParent.childrenById;
		}

		targetIndex = arr.indexOf(target.id)
		if (!action.up) targetIndex++;
		arr.splice(targetIndex, 0, source.id);

		return new_state;

	} else {
		return state;
	}
}


function onPreview(state, action) {
	let new_state = Object.assign({}, state, {
		previewId: action.id
	});
	return new_state;
}

function onToggle(state, action) {
	let node = state[action.id];

	let new_state = Object.assign({}, state);

	if (utils.isTimeline(node)) {
		node = copyTimeline(node);
	} else {
		node = copyTrial(node);
	}

	node.enabled = !node.enabled;
	new_state[node.id] = node;

	return new_state;
}

function setCollapsed(state, action) {
	let timeline = state[action.id];

	let new_state = Object.assign({}, state);

	timeline = copyTimeline(timeline);
 	timeline.collapsed = !timeline.collapsed;

	new_state[timeline.id] = timeline;

	return new_state;
}

function changePlugin(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);


	let params = jsPsych.plugins[action.newPluginVal].info.parameters;
	let paramKeys = Object.keys(params);

	var paramsObject = {};

	for(let i=0; i<paramKeys.length; i++) {
		paramsObject[paramKeys[i]] = params[paramKeys[i]].default;
	}

	node = copyTrial(node);

	node.pluginType = action.newPluginVal; 
	node.parameters = paramsObject;
	new_state[state.previewId] = node; 
	
	return new_state;
}

function changeToggleValue(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = copyTrial(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state;
}

function changeParamText(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = copyTrial(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state;
}

function changeParamInt(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = copyTrial(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state; 
}

function changeParamFloat(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = copyTrial(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	node.parameters[action.paramId] = action.newVal;

	return new_state; 
}
