const TIMELINE_ID_PREFIX = "TIMELINE-";
const TRIAL_ID_PREFIX = "TRIAL-";

export const TIMELINE_TYPE = "TIMELINE";
export const TRIAL_TYPE = "TRIAL";


export const standardizeTimelineId = (id) => {
	return TIMELINE_ID_PREFIX + id;
}

export const standardizeTrialId = (id) => {
	return TRIAL_ID_PREFIX + id;
}

export const isTimeline = (node) => (node.type === TIMELINE_TYPE);

export const isTrial = (node) => (node.type === TRIAL_TYPE);


