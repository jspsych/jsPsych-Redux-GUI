import reducer, { DEFAULT_TIMELINE_NAME, DEFAULT_TRIAL_NAME , getLevel } from '../timelineNode';
import * as Actions from '../../actions/timelineNodeActions';
import { standardizeTimelineId, standardizeTrialId } from '../../constants/utils'; 

const initState = {
	// id of which is being previewed/editted
	previewId: null,

	// the main timeline. array of ids
	mainTimeline: [], 
}

/*********** Add Actions **************/
let expected_add_timeline_to_main = {
	previewId: null,
	mainTimeline: [standardizeTimelineId(0)]
}
expected_add_timeline_to_main[standardizeTimelineId(0)] = {
	id: standardizeTimelineId(0),
	name: DEFAULT_TIMELINE_NAME,
	parent: null,
	childrenById: [],
	level: getLevel,
	collapsed: false,
	enabled: true,
	parameters: {}
}

let expected_add_timeline_to_another = {
	previewId: null,
	mainTimeline: [standardizeTimelineId(0)]
}
expected_add_timeline_to_another[standardizeTimelineId(0)] = {
	id: standardizeTimelineId(0),
	name: DEFAULT_TIMELINE_NAME,
	parent: null,
	childrenById: [standardizeTimelineId(1)],
	level: getLevel,
	collapsed: false,
	enabled: true,
	parameters: {}
}
expected_add_timeline_to_another[standardizeTimelineId(1)] = {
	id: standardizeTimelineId(1),
	name: DEFAULT_TIMELINE_NAME,
	parent: standardizeTimelineId(0),
	childrenById: [],
	level: getLevel,
	collapsed: false,
	enabled: true,
	parameters: {}
}


let expected_add_trial_to_main = {
	previewId: null,
	mainTimeline: [standardizeTrialId(0)]
}
expected_add_trial_to_main[standardizeTrialId(0)] = {
	id: standardizeTrialId(0),
	name: DEFAULT_TRIAL_NAME,
	parent: null,
	level: getLevel,
	enabled: true,
	parameters: {}
}

let expected_add_trial_to_timeline = {
	previewId: null,
	mainTimeline: [standardizeTimelineId(2)]
}
expected_add_trial_to_timeline[standardizeTimelineId(2)] = {
	id: standardizeTimelineId(2),
	name: DEFAULT_TIMELINE_NAME,
	parent: null,
	childrenById: [standardizeTrialId(1)],
	level: getLevel,
	collapsed: false,
	enabled: true,
	parameters: {}
}
expected_add_trial_to_timeline[standardizeTrialId(1)] = {
	id: standardizeTrialId(1),
	name: DEFAULT_TRIAL_NAME,
	parent: standardizeTimelineId(2),
	level: getLevel,
	enabled: true,
	parameters: {}
}

describe('Timeline Node Reducers for Adding actions', () => {
	it('should handle add actions of timeline', () => {
		// add to main timeline
		let s1 = reducer(initState, Actions.addTimelineAction(DEFAULT_TIMELINE_NAME, null));
		expect(s1).toEqual(expected_add_timeline_to_main)

		// add to another timeline
		let s2 = reducer(s1, Actions.addTimelineAction(DEFAULT_TIMELINE_NAME, standardizeTimelineId(0)));
		expect(s2).toEqual(expected_add_timeline_to_another);
	})

	it('should handle add actions of trial', () => {
		// add to main timeline
		let s1 = reducer(initState, Actions.addTrialAction(DEFAULT_TRIAL_NAME, null));
		expect(s1).toEqual(expected_add_trial_to_main);

		// add to another timeline
		let s2 = reducer(initState, Actions.addTimelineAction(DEFAULT_TIMELINE_NAME, null));
		s2 = reducer(s2, Actions.addTrialAction(DEFAULT_TRIAL_NAME, standardizeTimelineId(2)));
		expect(s2).toEqual(expected_add_trial_to_timeline)
	})
})


/*********** Add actions **************/
