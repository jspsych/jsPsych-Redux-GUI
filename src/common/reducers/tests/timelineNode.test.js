import reducer, 
{ 	enterTest,
	createTimeline, 
	createTrial,
	initState,
	DRAG_TYPE
} from '../timelineNode';
import * as Actions from '../../actions/timelineNodeActions';
import { standardizeTimelineId, standardizeTrialId, TIMELINE_TYPE, TRIAL_TYPE } from '../timelineNodeUtils'; 

enterTest();

/*********** Add Actions **************/
let expected_add_timeline_to_main = {
	previewId: null,
	mainTimeline: [standardizeTimelineId(0)]
}
expected_add_timeline_to_main[standardizeTimelineId(0)] = createTimeline(standardizeTimelineId(0));

let expected_add_timeline_to_another = {
	previewId: null,
	mainTimeline: [standardizeTimelineId(0)]
}
expected_add_timeline_to_another[standardizeTimelineId(0)] = createTimeline(standardizeTimelineId(0));
expected_add_timeline_to_another[standardizeTimelineId(0)].collapsed = false ;									  
expected_add_timeline_to_another[standardizeTimelineId(0)].childrenById = [standardizeTimelineId(1)];

expected_add_timeline_to_another[standardizeTimelineId(1)] = createTimeline(standardizeTimelineId(1));
expected_add_timeline_to_another[standardizeTimelineId(1)].parent = standardizeTimelineId(0);

let expected_add_trial_to_main = {
	previewId: null,
	mainTimeline: [standardizeTrialId(0)]
}
expected_add_trial_to_main[standardizeTrialId(0)] = createTrial(standardizeTrialId(0));

let expected_add_trial_to_timeline = {
	previewId: null,
	mainTimeline: [standardizeTimelineId(2)]
}
expected_add_trial_to_timeline[standardizeTimelineId(2)] = createTimeline(standardizeTimelineId(2));
expected_add_trial_to_timeline[standardizeTimelineId(2)].collapsed = false;
expected_add_trial_to_timeline[standardizeTimelineId(2)].childrenById = [standardizeTrialId(1)];
expected_add_trial_to_timeline[standardizeTrialId(1)] = createTrial(standardizeTrialId(1));
expected_add_trial_to_timeline[standardizeTrialId(1)].parent = standardizeTimelineId(2);

describe('Timeline Node Reducers for Adding actions', () => {
	it('should handle add actions of timeline', () => {
		// add to main timeline
		let s1 = reducer(initState, Actions.addTimelineAction(standardizeTimelineId(0), null));
		expect(s1).toEqual(expected_add_timeline_to_main)

		// add to another timeline
		let s2 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), standardizeTimelineId(0)));
		expect(s2).toEqual(expected_add_timeline_to_another);
	})

	it('should handle add actions of trial', () => {
		// add to main timeline
		let s1 = reducer(initState, Actions.addTrialAction(standardizeTrialId(0), null));
		expect(s1).toEqual(expected_add_trial_to_main);
		// add to another timeline
		let s2 = reducer(initState, Actions.addTimelineAction(standardizeTimelineId(2), null));
		s2 = reducer(s2, Actions.addTrialAction(standardizeTrialId(1), standardizeTimelineId(2)));
		expect(s2).toEqual(expected_add_trial_to_timeline)
	})
})


/*********** Add actions **************/

/*********** Delete actions **************/

describe('Timeline Node Reducers for Deleting actions', () => {
	it('should handle delete actions', () => {
		// delete from main timeline
		let s1 = reducer(initState, Actions.addTimelineAction(standardizeTimelineId(0), null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(1)));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(0), null));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(1), standardizeTimelineId(1)));
		s1 = reducer(s1, Actions.deleteTimelineAction(standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.deleteTrialAction(standardizeTrialId(0)));
		expect(s1).toEqual(initState)
	})
})

/*********** Delete actions **************/

/*********** Move actions **************/

let expected_move_timeline_to_another = {
	previewId: null,
	mainTimeline: [standardizeTimelineId(0)]
}
expected_move_timeline_to_another[standardizeTimelineId(0)] = createTimeline(
	standardizeTimelineId(0)
	);
expected_move_timeline_to_another[standardizeTimelineId(0)].childrenById = [standardizeTimelineId(1), standardizeTrialId(0)];
expected_move_timeline_to_another[standardizeTimelineId(0)].collapsed = false;

expected_move_timeline_to_another[standardizeTimelineId(1)] = createTimeline(
	standardizeTimelineId(1),
);
expected_move_timeline_to_another[standardizeTimelineId(1)].parent = standardizeTimelineId(0);

expected_move_timeline_to_another[standardizeTrialId(0)] = createTrial(
	standardizeTrialId(0),
)
expected_move_timeline_to_another[standardizeTrialId(0)].parent = standardizeTimelineId(0);

describe('Timeline Node Reducers for Moving actions', () => {
	it('should handle move actions', () => {
		// delete from main timeline
		let s1 = reducer(initState, Actions.addTimelineAction(standardizeTimelineId(0), null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), null));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(0), null));
		s1 = reducer(s1, Actions.moveNodeAction(standardizeTimelineId(1), standardizeTimelineId(0), 0, DRAG_TYPE.TRANSPLANT))
		s1 = reducer(s1, Actions.moveNodeAction(standardizeTrialId(0), standardizeTimelineId(0), 0, DRAG_TYPE.TRANSPLANT))
		expect(s1).toEqual(expected_move_timeline_to_another)
	})
})

/*********** Move actions **************/