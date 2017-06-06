import reducer, { DEFAULT_TIMELINE_NAME, DEFAULT_TRIAL_NAME , getLevel } from '../timelineNode';
import * as Actions from '../../actions/timelineNodeActions';
import { standardizeTimelineId, standardizeTrialId } from '../../constants/utils'; 

const initState = {
	// id of which is being previewed/editted
	previewId: null,

	// the main timeline. array of ids
	mainTimeline: [], 
}


describe('Timeline Node Reducers for Deleting actions', () => {
	it('should handle delete actions', () => {
		// delete from main timeline
		let s1 = reducer(initState, Actions.addTimelineAction(DEFAULT_TIMELINE_NAME, null));
		s1 = reducer(s1, Actions.addTimelineAction(DEFAULT_TIMELINE_NAME, standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(DEFAULT_TIMELINE_NAME, standardizeTimelineId(1)));
		s1 = reducer(s1, Actions.addTrialAction(DEFAULT_TRIAL_NAME, null));
		s1 = reducer(s1, Actions.addTrialAction(DEFAULT_TRIAL_NAME, standardizeTimelineId(1)));
		s1 = reducer(s1, Actions.deleteTimelineAction(standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.deleteTrialAction(standardizeTrialId(0)));
		expect(s1).toEqual(initState)
	})
})

