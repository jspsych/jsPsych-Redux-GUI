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

export const DEFAULT_TIMELINE_NAME = 'Untitled Timeline';
export const DEFAULT_TRIAL_NAME = 'Untitled Trial';

const initState = {
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
		default:
			return state;
	}
} 


/**************************  Helper functions  ********************************/

function getNodeById(state, id) {
	if (id === null) return null;
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

/*
Decides if source node is ancestor of target node 

*/ 
function isAncestor(state, sourceId, targetId) {
	let target = getNodeById(state, targetId);
	while (target.parent !== null) {
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
	if (targetId === null) return true;

	if (utils.isTrial(targetId) || 
		isAncestor(state, sourceId, targetId)) {
		return false;
	}

	return true;
}

// let temp0 = 0; +" "+(temp0++)
function createTimeline(id,  parent=null, name=DEFAULT_TIMELINE_NAME,
	childrenById=[], collapsed=true, enabled=true, parameters={}) {

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
	return createTimeline(timeline.id, timeline.parent, timeline.name, 
		timeline.childrenById.slice(), timeline.collapsed,
		timeline.enabled, timeline.parameters)
}

// let temp1 = 0; +" "+(temp1++)
function createTrial(id, parent=null, name=DEFAULT_TRIAL_NAME,
	enabled=true, parameters={}) {

	return {
		id: id,
		type: utils.TRIAL_TYPE,
		name: name,
		parent: parent,
		enabled: enabled,
		parameters: parameters
	};
}

function copyTrial(trial) {
	return createTrial(trial.id, trial.parent, trial.name, trial.enabled, trial.parameters);
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
	timeline['childrenById'].map((childId) => {
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
action = {
	sourceId: string,
	targetId: string,
	position: number, 
}

*/
function moveTimeline(state, action) {
	if (canMoveUnder(state, action.sourceId, action.targetId)) {
		// create a deep copy
		let source = copyTimeline(getNodeById(state, action.sourceId));

		// delete it from original place
		let new_state = deleteTimeline(state, {id: action.sourceId});

		// update parent
		let target = getNodeById(new_state, action.targetId);
		let parent;
		if (target === null) {
			parent = null;
		} else if(utils.isTimeline(target)) {
			parent = target.id;
		} else {
			parent = target.parent;
		}
		if (parent === null) {
			new_state.mainTimeline.splice(action.position, 0, action.sourceId); // already deep copied
			// update itself
			source.parent = parent.id;
		} else {
			parent = copyTimeline(new_state[parent]);
			new_state[parent.id] = parent;
			parent.childrenById.splice(action.position, 0, action.sourceId);
			// update itself
			source.parent = parent.id;
		}

		new_state[action.sourceId] = source;

		return new_state;
	} else {
		return state;
	}
}

/*
action = {
	sourceId: string,
	targetId: string,
	position: number,
}

*/
function moveTrial(state, action) {
	let source = copyTrial(getNodeById(state, action.sourceId));

	// delete it from original place
	let new_state = deleteTrial(state, {id: action.sourceId});

	// update parent
	let target = getNodeById(new_state, action.targetId);
	let parent;
	if (target === null) {
		parent = null;
	} else if(utils.isTimeline(target)) {
		parent = target.id;
	} else {
		parent = target.parent;
	}
	if (parent === null) {
		new_state.mainTimeline.splice(action.position, 0, action.sourceId); // already deep copied
		// update itself
		source.parent = parent;
	} else {
		parent = copyTimeline(new_state[parent]);
		new_state[parent.id] = parent;
		parent.childrenById.splice(action.position, 0, action.sourceId);
		// update itself
		source.parent = parent.id;
	}

	new_state[action.sourceId] = source;

	return new_state;
}

function moveNode(state, action) {
	if (utils.isTimeline(getNodeById(state, action.sourceId))) {
		return moveTimeline(state, action);
	} else {
		return moveTrial(state, action);
	}
}

function onPreview(state, action) {
	return Object.assign({}, state, {
		previewId: action.id
	});
}

function onToggle(state, action) {
	let node = getNodeById(state, action.id);

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
	let timeline = getNodeById(state, action.id);

	let new_state = Object.assign({}, state);

	timeline = copyTimeline(timeline);
 	timeline.collapsed = !timeline.collapsed;

	new_state[timeline.id] = timeline;

	return new_state;
}