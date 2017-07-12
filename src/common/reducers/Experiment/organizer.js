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



import * as utils from './utils';
import { deepCopy } from '../../utils';
import { DEFAULT_TIMELINE_PARAM, DEFAULT_TRIAL_PARAM } from './editor'

const DEFAULT_TIMELINE_NAME = 'Untitled Timeline';
const DEFAULT_TRIAL_NAME = 'Untitled Trial';


/**************************  Helper functions  ********************************/

var __TEST__ = 0;
export function enterTest() {
	__TEST__ = 1;
}

const TIMELINE_ID_PREFIX = "TIMELINE-";
const TRIAL_ID_PREFIX = "TRIAL-";

export const standardizeTimelineId = (id) => {
	return TIMELINE_ID_PREFIX + id;
}

export const standardizeTrialId = (id) => {
	return TRIAL_ID_PREFIX + id;
}

function getNodeById(state, id) {
	if (id === null)
		return null;
	return state[id];
}

const getDefaultTimelineName = (n=null) => {
	if (__TEST__)
		return DEFAULT_TIMELINE_NAME;
	return DEFAULT_TIMELINE_NAME + " " + n;
};
const getDefaultTrialName = (n=null) => {
	if (__TEST__ || n === null)
		return DEFAULT_TRIAL_NAME;
	return DEFAULT_TRIAL_NAME + " " + n;
};

export function createTimeline(id,
	parent=null,
	name=getDefaultTimelineName(),
	childrenById=[],
	collapsed=true,
	enabled=true,
	parameters=deepCopy(DEFAULT_TIMELINE_PARAM)
	) {

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


export function createTrial(id,
	parent=null,
	name=getDefaultTrialName(),
	enabled=true,
	parameters=deepCopy(DEFAULT_TRIAL_PARAM)) {

	return {
		id: id,
		type: utils.TRIAL_TYPE,
		name: name,
		parent: parent,
		enabled: enabled,
		parameters: parameters,
	};
}
/*
action = {
	id: id,
	parent: string,
}
*/

export function addTimeline(state, action) {
	let new_state = Object.assign({}, state);

	let n = new_state.timelineCount++;
	let id = standardizeTimelineId(n);
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = deepCopy(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: childrenById
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let timeline = createTimeline(id, action.parent, getDefaultTimelineName(n));

	new_state[id] = timeline;

	return new_state;
}

/*
action = {
	id: string,
	parent: string,
}
*/
export function addTrial(state, action) {
	let new_state = Object.assign({}, state);

	let n = new_state.trialCount++;
	let id = standardizeTrialId(n);
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = deepCopy(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: main timeline
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let trial = createTrial(id, action.parent, getDefaultTrialName(n));

	new_state[id] = trial;
	return new_state;
}

export function insertNodeAfterTrial(state, action) {
	let targetParent = state[action.targetId].parent;
	let new_state;

	// if inserted node is a timeline
	if (action.isTimeline) {
		new_state = addTimeline(state, { parent: targetParent});
	// if it is a trial
	} else {
		new_state = addTrial(state, { parent: targetParent});
	}

	let arr;
	if (targetParent === null) {
		arr = new_state.mainTimeline;
	} else {
		arr = new_state[targetParent].childrenById;
	}

	// move source after target
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
		return null;
	});

	// delete itself
	let parent = timeline.parent;
	if (parent === null) { // that is, main timeline
		state.mainTimeline = state.mainTimeline.filter((item) => (item !== id));
	} else {
		parent =  getNodeById(state, parent)
		parent = deepCopy(parent);
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
export function deleteTimeline(state, action) {
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
		parent = deepCopy(parent);
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
export function deleteTrial(state, action) {
	let new_state = Object.assign({}, state);

	return deleteTrialHelper(new_state, action.id);
}

function duplicateTimelineHelper(state, dupId, targetId) {

	// find target
	let target = state[targetId];
	// deep copy it but with different id
	let dup = deepCopy(target);
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
		// if this descendant is a timeline, call duplicate recusively to
		// reach all nodes
		if (utils.isTimeline(dupTarget)) {
			newId = standardizeTimelineId(state.timelineCount++);
			dupChild = duplicateTimelineHelper(state, newId, dupTargetId);
		// if this descendant is a trial, simply duplicated it
		} else {
			newId = standardizeTrialId(state.trialCount++);
			dupChild = deepCopy(dupTarget);
		}

		// add dup child to dup and state
		dup.childrenById.push(newId);
		state[newId] = dupChild;
		// have its own id and parent
		dupChild.id = newId;
		dupChild.parent = dupId;
	}

	return dup;
}

/*
action = {
	dupId: id, // assigned id
	targetId: id, // target to be copyed
}
*/
export function duplicateTimeline(state, action) {
	const { targetId } = action;

	let new_state = Object.assign({}, state);
	let dupId = standardizeTimelineId(new_state.timelineCount++);

	// duplicate
	let dup = duplicateTimelineHelper(new_state, dupId, targetId);
	new_state[dup.id] = dup;
	let target = state[targetId];
	let parent = target.parent;

	// push behind target
	let arr;
	if (parent === null) {
		new_state.mainTimeline = new_state.mainTimeline.slice();
		arr = new_state.mainTimeline;
	} else {
		parent = deepCopy(new_state[parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}
	arr.splice(arr.indexOf(targetId)+1, 0, dupId);

	return new_state;
}

/*
action = {
	dupId: id, // assigned id
	targetId: id, // target to be copyed
}
*/
export function duplicateTrial(state, action) {
	const { targetId } = action;

	let target = state[targetId];
	let parent = target.parent;

	// duplicate
	let new_state = Object.assign({}, state);
	let dupId = standardizeTrialId(new_state.trialCount++);
	let dup = deepCopy(target);
	// get its own id
	dup.id = dupId;
	new_state[dupId] = dup;

	// push behind target
	let arr;
	if (parent === null) {
		new_state.mainTimeline = new_state.mainTimeline.slice();
		arr = new_state.mainTimeline;
	} else {
		parent = deepCopy(new_state[parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}
	arr.splice(arr.indexOf(targetId)+1, 0, dupId);

	return new_state;
}

/*
See if source is an ancestor of target
*/
function isAncestor(state, sourceId, targetId) {
	let target = getNodeById(state, targetId);

	while (target && target.parent !== null) {
		if (target.parent === sourceId)
			return true;
		target = state[target.parent];
	}

	return false;
}

/*
Move source to a wanted position in the tree.
Either right at or one slot behind the original node at that pos.
action = {
	sourceId: id, // source
	targetId: id, // target
}
*/
export function moveTo(state, action) {
	// can't move if
	// 1. it is moving to itself
	// 2. self or target is null
	// 3. Ancestor to descendant
	if (action.sourceId === action.targetId ||
		!action.sourceId ||
		!action.targetId ||
		isAncestor(state, action.sourceId, action.targetId))
		return state;

	let source = state[action.sourceId];
	let target = state[action.targetId];

	// get new state
	let new_state = Object.assign({}, state);
	// replace old source with a new deep copied source
	new_state[source.id] = source;

	// if source and target have the same parent
	if (source.parent === target.parent) {

		// deep copy parent array
		let arr;
		if (source.parent === null) {
			new_state.mainTimeline = new_state.mainTimeline.slice();
			arr = new_state.mainTimeline;
		} else {
			let parent = deepCopy(new_state[source.parent]);
			new_state[parent.id] = parent;
			arr = parent.childrenById;
		}
		// move source to pos of target
		let from = arr.indexOf(source.id);
		let to = arr.indexOf(target.id);
		arr.move(from, to);

	// if not
	} else {
		// delete source from old parent
		let sourceParent = source.parent;
		if (sourceParent === null) {
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== source.id));
		} else {
			sourceParent = deepCopy(new_state[sourceParent]);
			new_state[sourceParent.id] = sourceParent;
			sourceParent.childrenById = sourceParent.childrenById.filter((id) => (id !== source.id));
		}

		// deep copy parent array
		let targetParent = target.parent;
		let arr;
		if (targetParent === null) {
			new_state.mainTimeline = new_state.mainTimeline.slice();
			arr = new_state.mainTimeline;
		} else {
			targetParent = deepCopy(new_state[targetParent]);
			new_state[targetParent.id] = targetParent;
			arr = targetParent.childrenById;
		}

		// move source into wanted pos in parent
		let targetIndex = arr.indexOf(target.id);
		source.parent = target.parent;
		if (arr.indexOf(source.id) === -1) {
			// if we are moving out, we put source behind target
			if (action.isLast) {
				targetIndex++;
			}
			arr.splice(targetIndex, 0, source.id);
		}
	}

	return new_state;
}

/*
If node right above source node can take children,
move source into that node.
New parent automatically expands.
action = {
	id: id, // source
}
*/
export function moveInto(state, action) {
	let node = state[action.id];
	let parent = node.parent;
	let parentChildren;

	if (parent === null) {
		parentChildren = state.mainTimeline;
	} else {
		parentChildren = state[node.parent].childrenById;
	}

	let index = parentChildren.indexOf(node.id)
	// we have a candidate if
	// 1. source is not the first child of its parent
	// 2. the node above source is a timeline
	let hasParentCandidate =  index > 0 &&
		utils.isTimeline(state[parentChildren[index-1]]);


	if (hasParentCandidate) {
		// deep copies
		let new_state = Object.assign({}, state);
		node = deepCopy(node);
		new_state[node.id] = node;

		// delete source from old parent
		let parentCandidateId;
		if (parent === null) {
			parentCandidateId = new_state.mainTimeline[new_state.mainTimeline.indexOf(node.id)-1];
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== node.id));
		} else {
			parent = deepCopy(new_state[parent]);
			new_state[parent.id] = parent;
			parentCandidateId = parent.childrenById[parent.childrenById.indexOf(node.id)-1];
			parent.childrenById = parent.childrenById.filter((id) => (id !== node.id));
		}

		// deep copy new parent
		let parentCandidate = deepCopy(new_state[parentCandidateId]);
		new_state[parentCandidateId] = parentCandidate;

		// insert source into new parent, new parent automatically expands
		parentCandidate.collapsed = false;
		if (parentCandidate.childrenById.indexOf(node.id) === -1)
			parentCandidate.childrenById.push(node.id);
		node.parent = parentCandidateId;

		return new_state;
	} else {
		return state;
	}


}

/*
Move node by keyboard input.
action = {
	id: id, // source
	key: number, // denote arrow keys
}
*/
export function moveByKeyboard(state, action) {
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
			// if already first
			if (currentIndex === 0) {
				return state;
			} else {
				targetId = parent[currentIndex - 1];
			}
			break;
		// down
		case 40:
			// if already last
			if (currentIndex === parent.length - 1) {
				return state;
			} else {
				targetId = parent[currentIndex + 1];
			}
			break;
		// left
		case 37:
			// can't move left if
			// 1. has no parent, Or
			// 2. it is not the last child of its parent
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

/*
action = {
	id: selected id,
	previewAll: bool, // indicate if all items on timeline shall be played
}

*/
export function onPreview(state, action) {
	let { id } = action;

	let new_state = Object.assign({}, state, {
		previewId: id,
	});

	return new_state;
}

/*
action = {
	id: id, // target

	 // if is bool, meaning we set enabled to a specific value
	spec: bool or null,
}
*/
function onToggleHelper(state, id, spec=null) {
	let node = deepCopy(state[id]);
	state[node.id] = node;
	if (spec === null) {
		node.enabled = !node.enabled;
	} else {
		node.enabled = spec;
	}

	// recusive call to set all descendants of timeline
	// to have the same enabled attrib
	if (utils.isTimeline(node)) {
		for (let cid of node.childrenById) {
			onToggleHelper(state, cid, node.enabled)
		}
	}
}

export function onToggle(state, action) {
	let new_state = Object.assign({}, state);

	onToggleHelper(new_state, action.id, null);
	enableTrackBack(new_state, new_state[action.id].parent);

	return new_state;
}

// When enable one only, enable its ancestors too
function enableTrackBack(state, parent) {
	if (parent && !state[parent].enabled) {
		parent = deepCopy(state[parent]);
		state[parent.id] = parent;
		parent.enabled = true;
		enableTrackBack(state, parent.parent);
	}
}


/*
action = {
	flag: bool, // whether enable or not
	spec: id, // toggle one only option
}
*/
export function setToggleCollectively(state, action) {
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
		let specNode = new_state[spec];
		enableTrackBack(new_state, specNode.parent);
	}

	return new_state;
}


export function setCollapsed(state, action) {
	let timeline = state[action.id];

	let new_state = Object.assign({}, state);

	timeline = deepCopy(timeline);
 	timeline.collapsed = !timeline.collapsed;

	new_state[timeline.id] = timeline;

	return new_state;
}
