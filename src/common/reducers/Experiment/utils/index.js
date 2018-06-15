const TIMELINE_ID_PREFIX = "TIMELINE";
const TRIAL_ID_PREFIX = "TRIAL";

export const TIMELINE_TYPE = "TIMELINE";
export const TRIAL_TYPE = "TRIAL";


export const genTimelineId = () => `${TIMELINE_TYPE}-${utils.getUUID()}`

export const genTrialId = () => `${TRIAL_TYPE}-${utils.getUUID()}`

export const isTimeline = (node) => (node.type === TIMELINE_TYPE);

export const isTrial = (node) => (node.type === TRIAL_TYPE);


