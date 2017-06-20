// track id
var timelineId = 0;
var trialId = 0;
var index = 2; 

const TIMELINE_ID_PREFIX = "TIMELINE-";
const TRIAL_ID_PREFIX = "TRIAL-";

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

export function startFromTwo(array, index) {
	if(array[0] != array[1]) {
		index = 2;
	} else {
		index++;
	}

	return index;
}

export const isTimeline = (node) => (node.type === TIMELINE_TYPE);

export const isTrial = (node) => (node.type === TRIAL_TYPE);


