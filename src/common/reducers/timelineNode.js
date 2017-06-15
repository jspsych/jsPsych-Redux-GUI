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
	// console.log(action)

	switch(action.type) {
		case actionTypes.ADD_TIMELINE:
			return addTimeline(state, action);
		case actionTypes.DELETE_TIMELINE:
			return deleteTimeline(state, action);
		case actionTypes.ADD_TRIAL:
			return addTrial(state, action);
		case actionTypes.DELETE_TRIAL:
			return deleteTrial(state, action);
		case actionTypes.INSERT_NODE_AFTER_TRIAL:
			return insertNodeAfterTrial(state, action);
		case actionTypes.DUPLICATE_TRIAL:
			return duplicateTrial(state, action);
		case actionTypes.DUPLICATE_TIMELINE:
			return duplicateTimeline(state, action);
		case actionTypes.MOVE_TO:
			return moveTo(state, action);
		case actionTypes.MOVE_INTO:
			return moveInto(state, action);
		case actionTypes.MOVE_BY_KEYBOARD:
			return moveByKeyboard(state, action);
		case actionTypes.ON_PREVIEW:
			return onPreview(state, action);
		case actionTypes.ON_TOGGLE:
			return onToggle(state, action);
		case actionTypes.SET_TOGGLE_COLLECTIVELY:
			return setToggleCollectively(state, action);
		case actionTypes.SET_COLLAPSED:
			return setCollapsed(state, action);

		// case actionTypes.CHANGE_PLUGIN_TYPE:
		// 	return changePlugin(state, action);
		// case actionTypes.TOGGLE_PARAM_VALUE:
		// 	return changeToggleValue(state, action);
		// case actionTypes.CHANGE_PARAM_TEXT:
		// 	return changeParamText(state, action);
		// case actionTypes.CHANGE_PARAM_INT: 
		// 	return changeParamInt(state, action);
		// case actionTypes.CHANGE_PARAM_FLOAT:
		// 	return changeParamFloat(state, action);
		// case actionTypes.CHANGE_HEADER:
		// 	return changeHeader(state, action);

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

export function createTimeline(id,
	parent=null,
	name=getDefaultTimelineName(),
	childrenById=[],
	collapsed=true,
	enabled=true,
	parameters={},) {

	return {
		id: id,
		type: utils.TIMELINE_TYPE,
		name: name,
		parent: parent,
		childrenById: childrenById,
		collapsed: collapsed,
		enabled: enabled,
		parameters: parameters,
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
		pluginType: pluginType,
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

export function createTable(id,
	timelineId,
	headerId,
	rowId,
	cellValue={}) {

	return {
		id: id,
		timelineId: utils.getTimelineId(),
		headerId: utils.getHeaderId(),
		rowId: utils.getRowId(),
		cellValue: cellValue
	};
}

function copyTable(table) {
	return createTable(table.id,
		table.timelineId,
		table.headerId,
		table.rowId,
		table.cellValue)
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

function insertNodeAfterTrial(state, action) {
	let targetParent = state[action.targetId].parent;
	let new_state;
	if (action.isTimeline) {
		new_state = addTimeline(state, {id: action.id, parent: targetParent});
	} else {
		new_state = addTrial(state, {id: action.id, parent: targetParent});
	}

	let arr;
	if (targetParent === null) {
		arr = new_state.mainTimeline;
	} else {
		arr = new_state[targetParent].childrenById;
	}

	arr.move(arr.indexOf(action.id), arr.indexOf(action.targetId)+1);

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

function duplicateTimelineHelper(state, dupId, targetId, getTimelineId, getTrialId) {

	// find target
	let target = state[targetId];
	// deep copy it but with different id
	let dup = copyTimeline(target);
	dup.id = dupId;

	// clear dup children array
	dup.childrenById = [];
	// populate it
	let dupTargetId;
	let dupTarget;
	let dupChild;
	let newId;
	for (let i = 0; i < target.childrenById.length; i++) {
		dupTargetId = target.childrenById[i];
		dupTarget = state[dupTargetId];
		if (utils.isTimeline(dupTarget)) {
			newId = getTimelineId();
			dupChild = duplicateTimelineHelper(state, newId, dupTargetId, getTimelineId, getTrialId);
		} else {
			newId = getTrialId();
			dupChild = copyTrial(dupTarget);
		}

		// add dup child to dup and state
		dup.childrenById.push(newId);
		state[newId] = dupChild;
		dupChild.id = newId;
		dupChild.parent = dupId;
	}

	return dup;
}

function duplicateTimeline(state, action) {
	const { dupId, targetId, getTimelineId, getTrialId } = action;

	let new_state = Object.assign({}, state);

	let dup = duplicateTimelineHelper(new_state, dupId, targetId, getTimelineId, getTrialId);
	new_state[dup.id] = dup;
	let target = state[targetId];
	let parent = target.parent;

	let arr;
	if (parent === null) {
		new_state.mainTimeline = new_state.mainTimeline.slice();
		arr = new_state.mainTimeline;
	} else {
		parent = copyTimeline(new_state[parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}

	arr.splice(arr.indexOf(targetId)+1, 0, dupId);

	return new_state;
}

function duplicateTrial(state, action) {
	const { dupId, targetId } = action;

	let target = state[targetId];
	let parent = target.parent;

	let new_state = Object.assign({}, state);
	let dup = copyTrial(target);
	dup.id = dupId;
	new_state[dupId] = dup;

	let arr;
	if (parent === null) {
		new_state.mainTimeline = new_state.mainTimeline.slice();
		arr = new_state.mainTimeline;
	} else {
		parent = copyTimeline(new_state[parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}

	arr.splice(arr.indexOf(targetId)+1, 0, dupId);

	return new_state;
} 

function isAncestor(state, sourceId, targetId) {
	let target = getNodeById(state, targetId);

	while (target && target.parent !== null) {
		if (target.parent === sourceId)
			return true;
		target = state[target.parent];
	}

	return false;
}

function moveTo(state, action) {
	if (action.sourceId === action.targetId ||
		!action.sourceId ||
		!action.targetId ||
		isAncestor(state, action.sourceId, action.targetId))
		return state;
	
	let source = state[action.sourceId];
	let target = state[action.targetId];
	let new_state = Object.assign({}, state);
	new_state[source.id] = source;

	if (source.parent === target.parent) {
		let arr;
		if (source.parent === null) {
			new_state.mainTimeline = new_state.mainTimeline.slice();
			arr = new_state.mainTimeline;
		} else {
			let parent = copyTimeline(new_state[source.parent]);
			new_state[parent.id] = parent;
			arr = parent.childrenById;
		}
		let from = arr.indexOf(source.id);
		let to = arr.indexOf(target.id);
		arr.move(from, to);
	} else { 
		// delete source from old parent
		let sourceParent = source.parent;
		if (sourceParent === null) {
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== source.id));
		} else {
			sourceParent = copyTimeline(new_state[sourceParent]);
			new_state[sourceParent.id] = sourceParent;
			sourceParent.childrenById = sourceParent.childrenById.filter((id) => (id !== source.id));
		}

		let targetParent = target.parent;
		let arr;
		if (targetParent === null) {
			new_state.mainTimeline = new_state.mainTimeline.slice();
			arr = new_state.mainTimeline;
		} else {
			targetParent = copyTimeline(new_state[targetParent]);
			new_state[targetParent.id] = targetParent;
			arr = targetParent.childrenById;
		}

		let targetIndex = arr.indexOf(target.id);
		source.parent = target.parent;
		if (arr.indexOf(source.id) === -1) {
			if (action.isLast) {
				targetIndex++;
			}
			arr.splice(targetIndex, 0, source.id);
		}
	}
	return new_state;
}

function moveInto(state, action) {
	let node = state[action.id];
	let parent = node.parent;
	let parentChildren;

	if (parent === null) {
		parentChildren = state.mainTimeline;
	} else {
		parentChildren = state[node.parent].childrenById;
	}

	let index = parentChildren.indexOf(node.id)
	let hasParentCandidate =  index > 0 &&
		utils.isTimeline(state[parentChildren[index-1]]);

	
	if (hasParentCandidate) {
		let new_state = Object.assign({}, state);
		node = copyNode(node);
		new_state[node.id] = node;
		let parentCandidateId;
		if (parent === null) {
			parentCandidateId = new_state.mainTimeline[new_state.mainTimeline.indexOf(node.id)-1];
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== node.id));
		} else {
			parent = copyTimeline(new_state[parent]);
			new_state[parent.id] = parent;
			parentCandidateId = parent.childrenById[parent.childrenById.indexOf(node.id)-1];
			parent.childrenById = parent.childrenById.filter((id) => (id !== node.id));
		}

		let parentCandidate = copyTimeline(new_state[parentCandidateId]);
		new_state[parentCandidateId] = parentCandidate;

		parentCandidate.collapsed = false;
		if (parentCandidate.childrenById.indexOf(node.id) === -1)
			parentCandidate.childrenById.push(node.id);
		node.parent = parentCandidateId;

		return new_state;
	} else {
		return state;
	}
 

}

function moveByKeyboard(state, action) {
	const { id, key } = action;

	let current = state[id];
	let parent = current.parent;
	if (parent === null) {
		parent = state.mainTimeline;
	} else {
		parent = state[parent].childrenById;
	}

	let currentIndex = parent.indexOf(current.id);
	let targetId;
	let isLast = false;
	switch (key) {
		// up
		case 38:
			if (currentIndex === 0) {
				return state;
			} else {
				targetId = parent[currentIndex - 1];
			}
			break;
		// down
		case 40:
			if (currentIndex === parent.length - 1) {
				return state; 
			} else {
				targetId = parent[currentIndex + 1];
			}
			break;
		// left
		case 37:
			if (current.parent === null ||
				current.id !== parent[parent.length - 1]) {
				return state;
			} else {
				targetId = current.parent;
				isLast = true;
			}
			break;
		// right
		case 39:
			return moveInto(state, { id: id });
		default:
			return state;
	}

	return moveTo(state, { sourceId: id, targetId: targetId, isLast: isLast });
}


function onPreview(state, action) {
	let new_state = Object.assign({}, state, {
		previewId: action.id
	});
	console.log(new_state)
	return new_state;
}


function onToggleHelper(state, id, spec=null) {
	let node = copyNode(state[id]);
	state[node.id] = node;
	if (spec === null) {
		node.enabled = !node.enabled;
	} else {
		node.enabled = spec;
	}
	if (utils.isTimeline(node)) {
		for (let cid of node.childrenById) {
			onToggleHelper(state, cid, node.enabled)
		}
	}
}

function onToggle(state, action) {
	let new_state = Object.assign({}, state);

	onToggleHelper(new_state, action.id, null);

	return new_state;
}

/*
action = {
	flag: bool, // whether enable or not
	spec: id, // toggle one only option
}

*/
function setToggleCollectively(state, action) {
	const { flag, spec } = action;
	let new_state = Object.assign({}, state);

	for (let id of new_state.mainTimeline) {
		if (id === spec) {
			continue;
		}
		onToggleHelper(new_state, id, flag);
	}

	if (spec) {
		onToggleHelper(new_state, spec, true);
	}

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



// const pluginType = (type) => {
// 	switch(type) {
// 		case 1: 
// 			return 'text';
// 		case 2: 
// 			return 'single-stim';
// 		default: 
// 			return 'text';
// 	}
// }

// function changePlugin(state, action) {
// 	let node = state[state.previewId];
// 	let new_state = Object.assign({}, state);


// 	let params = jsPsych.plugins[action.newPluginVal].info.parameters;
// 	let paramKeys = Object.keys(params);

// 	var paramsObject = {};

// 	for(let i=0; i<paramKeys.length; i++) {
// 		paramsObject[paramKeys[i]] = params[paramKeys[i]].default;

// 	}

// 	node = copyTrial(node);

// 	node.pluginType = action.newPluginVal; 
// 	node.parameters = paramsObject;
// 	new_state[state.previewId] = node; 

// 	return new_state; 
// }
