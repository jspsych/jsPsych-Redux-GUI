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

import * as utils from './timelineNodeUtils'; 


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
		case actionTypes.UPDATE_TREE:
			return updateTree(state, action);
		case actionTypes.ON_PREVIEW:
			return onPreview(state, action);
		case actionTypes.ON_TOGGLE:
			return onToggle(state, action);
		case actionTypes.SET_COLLAPSED:
			return setCollapsed(state, action);
		case actionTypes.CHANGE_PLUGIN_TYPE:
			return changePlugin(state, action);
		case actionTypes.TOGGLE_PARAM_VAL:
			return changeToggleValue(state, action);
		case actionTypes.CHANGE_PARAM_TEXT:
			return changeParamText(state, action);
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
export function isAncestor(state, sourceId, targetId) {
	let target = getNodeById(state, targetId);

	while (target && target.parent !== null) {
		if (target.parent === sourceId)
			return true;
		target = state[target.parent];
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

function copyNode(node) {
	if (utils.isTimeline(node)) {
		return copyTimeline(node);
	} else {
		return copyTrial(node);
	}
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


function updateTree(state, action) {
	let tree = action.tree;

	let new_state = Object.assign({}, state, {
		mainTimeline: []
	});

	let treeNode;
	let len = tree.length;
	for (let i = 0; i < len; i++) {
		treeNode = tree[i];
		new_state.mainTimeline.push(treeNode.id);
		normalizeTree(new_state, treeNode, null);
	}

	return new_state;
}

function normalizeTree(state, treeNode, parent) {
	let timelineNode = copyNode(state[treeNode.id]);
	state[timelineNode.id] = timelineNode;
	timelineNode.parent = parent;

	if (utils.isTimeline(timelineNode)) {
		let len = treeNode.children.length;
		timelineNode.childrenById = treeNode.children.map((t) => (t.id));
		if (timelineNode.childrenById.length > 0)
			timelineNode.collapsed = false;
		
		let child;
		for (let i = 0; i < len; i++) {
			child = treeNode.children[i];
			normalizeTree(state, child, treeNode.id);
		}
	}

}


function onPreview(state, action) {
	let new_state = Object.assign({}, state, {
		previewId: action.id
	});
	console.log(new_state)
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


const pluginType = (type) => {
	switch(type) {
		case 1: 
			return 'text';
		case 2: 
			return 'single-stim';
		default: 
			return 'text';
	}
}

const pluginParam = (pluginType) => {
	switch (pluginType) {
		case 1:
			return {
				text: '',
				choices: ''
			};
		case 2:
			return {
				stimulus: '',
				is_html: false,
				choices: '',
				prompt: '',
				timing_stim: '',
				timing_response: '',
				response_ends_trial: false
			};
		default:
			return {
				text: '',
				choices: ''
			};
	}
}

function changePlugin(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = copyTrial(node);

	node.pluginType = pluginType(action.key);
	node.parameters = pluginParam(action.key);
	new_state[state.previewId] = node;

	return new_state;
}

function changeToggleValue(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = copyTrial(node);

	parameters: [node.parameters, action.newVal]
	new_state[state.previewId] = node;

	return new_state;
}

function changeParamText(state, action) {
	let node = state[state.previewId];
	let new_state = Object.assign({}, state);

	node = copyTrial(node);
	new_state[state.previewId] = node;

	node.parameters = Object.assign({}, node.parameters);

	//console.log("node.parameters[action.paramId] " + node.parameters[action.paramId]);
	node.parameters[action.paramId] = action.newVal;

	console.log('INSIDE REDUCER:')
	console.log(new_state);

	return new_state;
}
