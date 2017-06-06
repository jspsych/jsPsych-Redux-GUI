import reducer, { DEFAULT_TIMELINE_NAME, DEFAULT_TRIAL_NAME , getLevel } from '../timelineNode';
import * as Actions from '../../actions/timelineNodeActions';
import { standardizeTimelineId, standardizeTrialId } from '../../constants/utils'; 

const initState = {
	// id of which is being previewed/editted
	previewId: null,

	// the main timeline. array of ids
	mainTimeline: [], 
}

let expected_move_timeline_to_another = {
	previewId: null,
	mainTimeline: [standardizeTimelineId(0)]
}
expected_move_timeline_to_another[standardizeTimelineId(0)] = {
	id: standardizeTimelineId(0),
	name: DEFAULT_TIMELINE_NAME,
	parent: null,
	childrenById: [standardizeTrialId(0), standardizeTimelineId(1)],
	level: getLevel,
	collapsed: false,
	enabled: true,
	parameters: {}
}
expected_move_timeline_to_another[standardizeTimelineId(1)] = {
	id: standardizeTimelineId(1),
	name: DEFAULT_TIMELINE_NAME,
	parent: standardizeTimelineId(0),
	childrenById: [],
	level: getLevel,
	collapsed: false,
	enabled: true,
	parameters: {}
}
expected_move_timeline_to_another[standardizeTrialId(0)] = {
	id: standardizeTrialId(0),
	name: DEFAULT_TRIAL_NAME,
	parent: standardizeTimelineId(0),
	level: getLevel,
	enabled: true,
	parameters: {}
}

describe('Timeline Node Reducers for Deleting actions', () => {
	it('should handle move actions', () => {
		// delete from main timeline
		let s1 = reducer(initState, Actions.addTimelineAction(DEFAULT_TIMELINE_NAME, null));
		s1 = reducer(s1, Actions.addTimelineAction(DEFAULT_TIMELINE_NAME, null));
		s1 = reducer(s1, Actions.addTrialAction(DEFAULT_TRIAL_NAME, null));
		s1 = reducer(s1, Actions.moveTimelineAction(standardizeTimelineId(1), standardizeTimelineId(0), 0))
		s1 = reducer(s1, Actions.moveTrialAction(standardizeTrialId(0), standardizeTimelineId(0), 0))
		expect(s1).toEqual(expected_move_timeline_to_another)
	})
})

