// track id
var timelineId = 0;
var trialId = 0;
var headerId = 0;
var rowId = 0;

const TIMELINE_ID_PREFIX = "TIMELINE-";
const TRIAL_ID_PREFIX = "TRIAL-";
const HEADER_ID_PREFIX = "HEADER-";
const ROW_ID_PREFIX = "ROW-";

export const TIMELINE_TYPE = "TIMELINE";
export const TRIAL_TYPE = "TRIAL";


export const standardizeTimelineId = (id) => {
	if (isNaN(id))
		throw new TypeError("Should pass in a number!");
	return TIMELINE_ID_PREFIX + id;
}

export const standardizeTrialId = (id) => {
	if (isNaN(id))
		throw new TypeError("Should pass in a number!");
	return TRIAL_ID_PREFIX + id;
}

export const standerdizeHeaderId = (id) => {
	if(isNaN(id))
		throw new TypeError("Should pass in a number!");
	return HEADER_ID_PREFIX + id;
}

export const standerdizeRowId = (id) => {
	if(isNaN(id))
		throw new TypeError("Should pass in a number!");
	return ROW_ID_PREFIX + id; 
}

export function getTimelineId() {
	return standardizeTimelineId(timelineId++);
}

export function getTrialId() {
	return standardizeTrialId(trialId++);
}

export function getHeaderId() {
	return standerdizeHeaderId(headerId++);
}

export function getRowId() {
	return standerdizeRowId(rowId++);
}

export const isTimeline = (node) => (node.type === TIMELINE_TYPE);

export const isTrial = (node) => (node.type === TRIAL_TYPE);

export function preOrderTraversal(state, from=null, presentedIds=[]) {
	let childrenById = state.mainTimeline;
	if (from && isTimeline(from))
		childrenById = from.childrenById;

	preOrderTraversalHelper(state, childrenById, presentedIds);
	return presentedIds;
}

function preOrderTraversalHelper(state, childrenById, presentedIds) {
	let len = childrenById.length;
	if (len === 0)
		return;
	let node, nodeId;
	for (let i = 0; i < len; i++) {
		nodeId = childrenById[i];
		node = state[nodeId];
		presentedIds.push(nodeId);
		if (isTimeline(node) && node.collapsed === false)
			preOrderTraversalHelper(state, state[nodeId].childrenById, presentedIds);
	}
}