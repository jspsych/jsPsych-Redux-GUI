/**
 *@file This file describes the reducers for timelineNode class from jsPsych (timeline, trial)
*/
import * as experimentUtils from './utils';
import { DEFAULT_TIMELINE_PARAM, DEFAULT_TRIAL_PARAM } from './editor'

const DEFAULT_TIMELINE_NAME = 'Untitled Timeline';
const DEFAULT_TRIAL_NAME = 'Untitled Trial';

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

const getDefaultTimelineName = (n=null) => {
	if (__TEST__)
		return DEFAULT_TIMELINE_NAME;
	return DEFAULT_TIMELINE_NAME;
	// return DEFAULT_TIMELINE_NAME + " " + n;
};
const getDefaultTrialName = (n=null) => {
	if (__TEST__ || n === null)
		return DEFAULT_TRIAL_NAME;
	return DEFAULT_TRIAL_NAME;
	// return DEFAULT_TRIAL_NAME + " " + n;
};

/**
 *@namespace Timeline
 *@property {string} id - The id of this node
 *@property {string} parent - Its parent node's id
 *@property {string} name - Node's name
 *@property {boolean} enabled - Is the node enabled
 *@property {Object} parameters - {@link jsPsychTimelineParameters}
*/
export function createTimeline(id,
	parent=null,
	name=getDefaultTimelineName(),
	childrenById=[],
	collapsed=true,
	enabled=true,
	parameters=utils.deepCopy(DEFAULT_TIMELINE_PARAM)
	) {

	return {
		id: id,
		type: experimentUtils.TIMELINE_TYPE,
		name: name,
		parent: parent,
		childrenById: childrenById,
		collapsed: collapsed,
		enabled: enabled,
		parameters: parameters,
	};
}

/**
 *@namespace Trial
 *@property {string} id - The id of this node
 *@property {string} parent - Its parent node's id
 *@property {string} name - Node's name
 *@property {boolean} enabled - Is the node enabled
 *@property {Object} parameters - {@link jsPsychTrialParameters}
*/
export function createTrial(id,
	parent=null,
	name=getDefaultTrialName(),
	enabled=true,
	parameters=utils.deepCopy(DEFAULT_TRIAL_PARAM)) {

	return {
		id: id,
		type: experimentUtils.TRIAL_TYPE,
		name: name,
		parent: parent,
		enabled: enabled,
		parameters: parameters,
	};
}

const isEnabled = (parent, isEnabled) => (parent ? parent.enabled && isEnabled : isEnabled);

/**@function(state, action)
 * @name addTimeline
 * @description Add a timeline node to a parent node (Timeline node or the mainTimeline array)
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.parent - Refers to id of the timeline node that will contain the newly added timeline node. If value is null, then the new node is added to the mainTimline/
 * @returns {Object} Returns a completely new Experiment State object
*/
export function addTimeline(state, action) {
	let new_state = Object.assign({}, state);

	let id = experimentUtils.genTimelineId();
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = utils.deepCopy(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: childrenById
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let timeline = createTimeline(id, action.parent, getDefaultTimelineName());
	timeline.enabled = isEnabled(parent, timeline.enabled);

	new_state[id] = timeline;

	return new_state;
}

/**@function(state, action)
 * @name addTrial
 * @description Add a trial node to a parent node (Timeline node or the mainTimeline array)
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.parent - Refers to id of the timeline node that will contain the newly added timeline node. If value is null, then the new node is added to the mainTimline/
 * @returns {Object} Returns a completely new Experiment State object
*/
export function addTrial(state, action) {
	let new_state = Object.assign({}, state);

	let id = experimentUtils.genTrialId();
	let parent = getNodeById(new_state, action.parent);
	if (parent !== null) {
		// update parent: childrenById
		parent = utils.deepCopy(parent);
		new_state[parent.id] = parent;
		parent.childrenById.push(id);
		parent.collapsed = false;
	} else {
		// update parent: main timeline
		new_state.mainTimeline = state.mainTimeline.slice();
		new_state.mainTimeline.push(id);
	}

	let trial = createTrial(id, action.parent, getDefaultTrialName());
	// check if the trial is enabled
	trial.enabled = isEnabled(parent, trial.enabled);

	new_state[id] = trial;
	return new_state;
}

/**@function(state, action)
 * @name insertNodeAfterTrial
 * @description Add a node after targeted node
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.targetId - Refers to id of the node to be inserted after
 * @returns {Object} Returns a completely new Experiment State object
*/
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

/**@function(state, action)
 * @private
 * @name deleteTimelineHelper
 * @description Hepler function that deals with deleting a timeline from the experiment
 * @param {object} state - The Experiment State Object 
 * @param {string} id - The id of the node to be deleted
 * @returns {Object} Returns a modified Experiment State object
*/
function deleteTimelineHelper(state, id) {
	let timeline = getNodeById(state, id);

	// delete its children
	timeline.childrenById.map((childId) => {
		if (experimentUtils.isTimeline(state[childId])) {
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
		parent = utils.deepCopy(parent);
		state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== id));
	}
	if (state.previewId === id) state.previewId = null;
	delete state[id];

	return state;
}

/**@function(state, action)
 * @name deleteTimeline
 * @description Delete a timeline node from the experiment 
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.id - The id of the node to be deleted
 * @returns {Object} Returns a completely new Experiment State object
*/
export function deleteTimeline(state, action) {
	return deleteTimelineHelper(utils.deepCopy(state), action.id);
}

/**@function(state, action)
 * @private
 * @name deleteTrialHelper
 * @description Hepler function that deals with deleting a trial from the experiment
 * @param {object} state - The Experiment State Object 
 * @param {string} id - The id of the node to be deleted
 * @returns {Object} Returns a modified Experiment State object
*/
function deleteTrialHelper(state, id) {
	let trial = getNodeById(state, id);
	let parent = trial.parent;

	if (parent === null) { // that is, main timeline
		state.mainTimeline = state.mainTimeline.filter((item) => (item !== id));
	} else {
		parent = getNodeById(state, parent);
		parent = utils.deepCopy(parent);
		state[parent.id] = parent;
		parent.childrenById = parent.childrenById.filter((item) => (item !== id));
	}

	if (state.previewId === id) state.previewId = null;
	delete state[id];

	return state;
}

/**@function(state, action)
 * @name deleteTrial
 * @description Delete a trial node from the experiment 
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.id - The id of the node to be deleted
 * @returns {Object} Returns a completely new Experiment State object
*/
export function deleteTrial(state, action) {
	return deleteTrialHelper(utils.deepCopy(state), action.id);
}

/**@function(state, action)
 * @private
 * @name duplicateTimelineHelper
 * @description Hepler function that deals with duplicating a timeline from the experiment
 * @param {string} dupId - The id of the new node
 * @param {stinrg} targetId - The id of the node to be copied
 * @returns {Object} Returns a modified Experiment State object
*/
function duplicateTimelineHelper(state, dupId, targetId) {

	// find target
	let target = state[targetId];
	// deep copy it but with different id
	let dup = utils.deepCopy(target);
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
		if (experimentUtils.isTimeline(dupTarget)) {
			newId = experimentUtils.genTimelineId();
			dupChild = duplicateTimelineHelper(state, newId, dupTargetId);
		// if this descendant is a trial, simply duplicated it
		} else {
			newId = experimentUtils.genTrialId();
			dupChild = utils.deepCopy(dupTarget);
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

/**@function(state, action)
 * @name duplicateTimeline
 * @description Duplicate a timeline node from the experiment 
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.targetId - The id of the node to be duplicated
 * @returns {Object} Returns a completely new Experiment State object
*/
export function duplicateTimeline(state, action) {
	const { targetId } = action;

	let new_state = Object.assign({}, state);
	let dupId = experimentUtils.genTimelineId();

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
		parent = utils.deepCopy(new_state[parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}
	arr.splice(arr.indexOf(targetId)+1, 0, dupId);

	return new_state;
}

/**@function(state, action)
 * @name duplicateTrial
 * @description Duplicate a trial node from the experiment 
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.targetId - The id of the node to be duplicated
 * @returns {Object} Returns a completely new Experiment State object
*/
export function duplicateTrial(state, action) {
	const { targetId } = action;

	let target = state[targetId];
	let parent = target.parent;

	// duplicate
	let new_state = Object.assign({}, state);
	let dupId = experimentUtils.genTrialId();
	let dup = utils.deepCopy(target);
	// get its own id
	dup.id = dupId;
	new_state[dupId] = dup;

	// push behind target
	let arr;
	if (parent === null) {
		new_state.mainTimeline = new_state.mainTimeline.slice();
		arr = new_state.mainTimeline;
	} else {
		parent = utils.deepCopy(new_state[parent]);
		new_state[parent.id] = parent;
		arr = parent.childrenById;
	}
	arr.splice(arr.indexOf(targetId)+1, 0, dupId);

	return new_state;
}

/**@function(state, action)
 * @private
 * @name isAncestor
 * @description Check if one node is another node's ancestor
 * @param {string} sourceId
 * @param {stinrg} targetId
 * @returns {boolean}
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


/**@function(state, action)
 * @name moveTo
 * @description Move the node to be the child or sibiling of another node
 * Can't move if
 * 1. it is moving to itself
 * 2. self or target is null
 * 3. ancestor to descendant
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.sourceId - The id of the node to be moved
 * @param {string} action.targetId - The target node's id to which the source node is moving
 * @returns {Object} Returns a completely new Experiment State object
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
			let parent = utils.deepCopy(new_state[source.parent]);
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
			sourceParent = utils.deepCopy(new_state[sourceParent]);
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
			targetParent = utils.deepCopy(new_state[targetParent]);
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

/**@function(state, action)
 * @name moveInto
 * @description Find a potential parent node and move the node as its child. More specifically, if node right above source node can take children, move the source into that node. (The new parent will automatically expand)
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.id - The id of the node to be moved
 * @returns {Object} Returns a completely new Experiment State object
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
		experimentUtils.isTimeline(state[parentChildren[index-1]]);

	if (hasParentCandidate) {
		// deep copies
		let new_state = Object.assign({}, state);
		node = utils.deepCopy(node);
		new_state[node.id] = node;

		// delete source from old parent
		let parentCandidateId;
		if (parent === null) {
			parentCandidateId = new_state.mainTimeline[new_state.mainTimeline.indexOf(node.id)-1];
			new_state.mainTimeline = new_state.mainTimeline.filter((id) => (id !== node.id));
		} else {
			parent = utils.deepCopy(new_state[parent]);
			new_state[parent.id] = parent;
			parentCandidateId = parent.childrenById[parent.childrenById.indexOf(node.id)-1];
			parent.childrenById = parent.childrenById.filter((id) => (id !== node.id));
		}

		// deep copy new parent
		let parentCandidate = utils.deepCopy(new_state[parentCandidateId]);
		new_state[parentCandidateId] = parentCandidate;

		// insert source into new parent, new parent automatically expands
		parentCandidate.collapsed = false;
		if (parentCandidate.childrenById.indexOf(node.id) === -1)
			parentCandidate.childrenById.push(node.id);
		node.parent = parentCandidateId;
		node.enabled = isEnabled(parentCandidate, node.enabled);

		return new_state;
	} else {
		return state;
	}
}

/**@function(state, action)
 * @name moveByKeyboard
 * @description Move the node by keyboard input (arrows)
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {number} action.key - Event key
 * @returns {Object} Returns a completely new Experiment State object
*/
export function moveByKeyboard(state, action) {
	const { key } = action;
	let id = state.previewId;
	let current = state[id];
	if (!current) return state;
	
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

/**@function(state, action)
 * @name onPreview
 * @description Preview the selected node
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.id - The id of the node to be previewed
 * @param {boolean} action.previewAll - Indicates if all items on timeline shall be played
 * @returns {Object} Returns a completely new Experiment State object
*/
export function onPreview(state, action) {
	let { id } = action;

	let new_state = Object.assign({}, state, {
		previewId: id,
	});

	return new_state;
}

/**@function(state, action)
 * @private
 * @name onToggleHelper
 * @description Recursive hepler function that deals with toggling (enable or disable) a node (and its descendants if it has any)
 * @param {Object} state - The experiment state object
 * @param {string} id - The id of the node to be enabled or disabled
 * @param {stinrg} spec - The value that user sets to indicate if the node should be toggled
*/
function onToggleHelper(state, id, spec=null) {
	let node = utils.deepCopy(state[id]);
	state[node.id] = node;
	if (spec === null) {
		node.enabled = !node.enabled;
	} else {
		node.enabled = spec;
	}

	// recusive call to set all descendants of timeline
	// to have the same enabled attrib
	if (experimentUtils.isTimeline(node)) {
		for (let cid of node.childrenById) {
			onToggleHelper(state, cid, node.enabled)
		}
	}
}

/**@function(state, action)
 * @private
 * @name enableTrackBack
 * @description Recursive hepler function that deals with toggling (enable or disable) a node (and its ancestors if it has any)
 * @param {Object} state - The experiment state object
 * @param {string} parent - The toggled id's parent's id
*/
function enableTrackBack(state, parent) {
	if (parent && !state[parent].enabled) {
		parent = utils.deepCopy(state[parent]);
		state[parent.id] = parent;
		parent.enabled = true;
		enableTrackBack(state, parent.parent);
	}
}

/**@function(state, action)
 * @name onToggle
 * @description Enable or disable a node (and its possible descendants and ancestors)
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.id - The id of the node to be toggled
 * @returns {Object} Returns a completely new Experiment State object
*/
export function onToggle(state, action) {
	let new_state = Object.assign({}, state);

	onToggleHelper(new_state, action.id, null);
	enableTrackBack(new_state, new_state[action.id].parent);

	return new_state;
}

/**@function(state, action)
 * @name setCollapsed
 * @description GUI setting. Collapse a tree node
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.id - The id of the node to be collapsed
 * @returns {Object} Returns a completely new Experiment State object
*/
export function setCollapsed(state, action) {
	let timeline = state[action.id];

	let new_state = Object.assign({}, state);

	timeline = utils.deepCopy(timeline);
 	timeline.collapsed = !timeline.collapsed;

	new_state[timeline.id] = timeline;

	return new_state;
}
