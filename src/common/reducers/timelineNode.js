/*
This file is the reducers for timelineNode class from jsPsych (timeline, trial)

A timeline state = {
	id: string,
	name: string,
	// if its parent is mainTimeline, null
	parent: string, 
	childrenById: array,
	level: function, 
	collapsed: boolean,
	enabled: boolean,
	// for tree menu
	
	// jsPsych timeline properties
	parameters: object,
}

A trial state = {
	id: string,
	name: string,
	// if its parent is mainTimeline, null
	parent: string, 
	enabled: boolean,
	// for tree menu
	level: function, 
	// specific parameters decided by which plugin user chooses
	parameters: object,
}

*/

import * as actionTypes from '../constants/ActionTypes';
import * as utils from '../constants/utils'; 

var timelineId = 0;
var trialId = 0;

const DEFAULT_TIMELINE_NAME = 'Untitled Timeline';
const DEFAULT_TRIAL_NAME = 'Untitled Trial';

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
		case actionTypes.MOVE_TIMELINE:
			return moveTimeline(state, action);
		case actionTypes.ADD_TRIAL:
			return addTrial(state, action);
		case actionTypes.DELETE_TRIAL:
			return deleteTrial(state, action);
		case actionTypes.MOVE_TRIAL:
			return moveTrial(state, action);
		default:
			return state;
	}
} 


/**************************  Helper functions  ********************************/

function getNodeById(state, id) {
	if (id === null) return null;
	return state.id;
}

function getLevel(state, node) {
	if (node.parent === null)
		return 0;
	else
		return 1 + getLevel(state, getNodeById(node.parent));
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
		isAncestor(sourceId, targetId)) {
		return false;
	}

	return true;
}


function createTimeline(id, name=DEFAULT_TIMELINE_NAME, parent=null, 
	childrenById=[], level=getLevel, collapsed=false, 
	enabled=true, parameters={}) {

	return {
		id: id,
		name: name,
		parent: parent,
		childrenById: childrenById,
		level: level,
		collapsed: collapsed,
		enabled: enabled,
		parameters: parameters
	};
}

// define deep copy for parameters later
function copyTimeline(timeline) {
	return createTimeline(timeline.id, timeline.name, timeline.parent,
		timeline.childrenById.slice(), timeline.level, timeline.collapsed,
		timeline.enabled, timeline.parameters)
}

function createTrial(id, name=DEFAULT_TRIAL_NAME, parent=null,
	level=getLevel, enabled=true, parameters={}) {

	return {
		id: utils.standardizeTrialId(trialId++),
		name: name,
		parent: parent,
		level: level,
		enabled: enabled,
		parameters: parameters
	};
}

/*
action = {
	name: string,
	parent: string, 
	childrenById: array,
	level: number, 
	collapsed: boolean,
	enabled: boolean,
	parameters: object,
}
*/
function addTimeline(state, action) {
	let new_state = Object.assign({}, state);

	let id = utils.standardizeTimelineId(timelineId++);
	let parent = getNodeById(action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
	} else {
		// update parent: childrenById
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let timeline = createTimeline(id, action.name, action.parent, 
		action.childrenById, action.level, action.collapsed,
		action.enabled, action.parameters)

	new_state[id] = timeline;
 
	return new_state;
}

/*
action = {
	name: string,
	parent: string, 
	level: number, 
	enabled: boolean,
	parameters: object,
}
*/
function addTrial(state, action) {
	let new_state = Object.assign({}, state);

	let id = utils.standardizeTrialId(trialId++);
	let parent = getNodeById(action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
	} else {
		// update parent: main timeline
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let trial = createTrial(id, action.name, action.parent, 
		action.level, action.enabled, action.parameters)

	new_state[id] = trial;
 
	return new_state;
}

/*
action = {
	id: string
}
*/
function deleteTimeline(state, action) {
	let new_state = Object.assign({}, state);

	let timeline = getNodeById(action.id);
	let parent = timeline.parent;

	if (parent === null) { // that is, main timeline
		new_state.mainTimeline = state.mainTimeline.filter((item) => (item !== action.id));
	} else {
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== action.id));
	}
	delete new_state[action.id];

	return timeline;
}

/*
action = {
	id: string
}
*/
function deleteTrial(state, action) {
	let new_state = Object.assign({}, state);

	let trial = getNodeById(action.id);
	let parent = trial.parent;

	if (parent === null) { // that is, main timeline
		new_state.mainTimeline = state.mainTimeline.filter((item) => (item !== action.id));
	} else {
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== action.id));
	}
	delete new_state[action.id];

	return new_state;
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
		let source = copyTimeline(getNodeById(action.sourceId));

		// delete it from original place
		let new_state = deleteTimeline(state, {id: action.sourceId});

		// update parent
		let parent = getNodeById(action.targetId);
		if (parent === null) {
			new_state.mainTimeline.splice(action.position, 0, action.sourceId); // already deep copied
			// update itself
			source.parent = parent;
		} else {
			parent = copyTimeline(parent);
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
	let source = copyTimeline(getNodeById(action.sourceId));

	// delete it from original place
	let new_state = deleteTrial(state, {id: action.sourceId});

	// update parent
	let parent = getNodeById(action.targetId);
	if (parent === null) {
		new_state.mainTimeline.splice(action.position, 0, action.sourceId); // already deep copied
		// update itself
		source.parent = parent;
	} else {
		parent = copyTimeline(parent);
		new_state[parent.id] = parent;
		parent.childrenById.splice(action.position, 0, action.sourceId);
		// update itself
		source.parent = parent.id;
	}

	new_state[action.sourceId] = source;

	return new_state;
}

