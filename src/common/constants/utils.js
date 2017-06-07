export const TIMELINE_ID_PREFIX = "TIMELINE-";
export const TRIAL_ID_PREFIX = "TRIAL-";

// enum
export const TIMELINE_TYPE = 1;
export const TRIAL_TYPE = 2;

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

export const typeOfNodeById = (node) => {
	if (typeof node !== "string" && typeof node !== "object")
		throw new TypeError("Should pass in a string or an object!");

	if (typeof node === "object")
		node = node.id;

	if (node.startsWith(TIMELINE_ID_PREFIX))
		return TIMELINE_TYPE;
	else if (node.startsWith(TRIAL_ID_PREFIX))
		return TRIAL_TYPE;

	return 0;
}

export const isTimeline = (node) => (node.type === TIMELINE_TYPE);

export const isTrial = (node) => (node.type === TRIAL_TYPE);