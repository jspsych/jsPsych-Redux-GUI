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
		case actionTypes.MOVE_TO:
			return moveTo(state, action);
		case actionTypes.ON_PREVIEW:
			return onPreview(state, action);
		case actionTypes.ON_TOGGLE:
			return onToggle(state, action);
		case actionTypes.SET_COLLAPSED:
			return setCollapsed(state, action);
		case actionTypes.MOVE_INTO:
			return moveInto(state, action);
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

function moveTo(state, action) {
	if (action.sourceId === action.targetId)
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
			arr = new_state.mainTimeline;
		} else {
			targetParent = copyTimeline(new_state[targetParent]);
			new_state[targetParent.id] = targetParent;
			arr = targetParent.childrenById;
		}

		let targetIndex = arr.indexOf(target.id);
		source.parent = target.parent;
		if (arr.indexOf(source.id) === -1)
			arr.splice(targetIndex, 0, source.id);
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

// const pluginParam = (pluginType) => {
// 	switch (pluginType) {
// 		case 1:
// 			return {
// 				text: '',
// 				choices: ''
// 			};
// 		case 2:
// 			return {
// 				stimulus: '',
// 				is_html: false,
// 				choices: '',
// 				prompt: '',
// 				timing_stim: '',
// 				timing_response: '',
// 				response_ends_trial: false
// 			};
// 		default:
// 			return {
// 				text: '',
// 				choices: ''
// 			};
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

// function changeToggleValue(state, action) {
// 	let node = state[state.previewId];
// 	let new_state = Object.assign({}, state);

// 	node = copyTrial(node);
// 	new_state[state.previewId] = node;

// 	node.parameters = Object.assign({}, node.parameters);

// 	node.parameters[action.paramId] = action.newVal;

// 	return new_state;
// }

// function changeParamText(state, action) {
// 	let node = state[state.previewId];
// 	let new_state = Object.assign({}, state);

// 	node = copyTrial(node);
// 	new_state[state.previewId] = node;

// 	node.parameters = Object.assign({}, node.parameters);

// 	node.parameters[action.paramId] = action.newVal;

// 	return new_state;
// }

// function changeParamInt(state, action) {
// 	let node = state[state.previewId];
// 	let new_state = Object.assign({}, state);

// 	node = copyTrial(node);
// 	new_state[state.previewId] = node;

// 	node.parameters = Object.assign({}, node.parameters);

// 	node.parameters[action.paramId] = action.newVal;

// 	return new_state; 
// }

// function changeParamFloat(state, action) {
// 	let node = state[state.previewId];
// 	let new_state = Object.assign({}, state);

// 	node = copyTrial(node);
// 	new_state[state.previewId] = node;

// 	node.parameters = Object.assign({}, node.parameters);

// 	node.parameters[action.paramId] = action.newVal;

// 	return new_state; 
// }
