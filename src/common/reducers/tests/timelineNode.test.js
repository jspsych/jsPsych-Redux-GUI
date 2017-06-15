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
/*
timeline 0
	trial 0
	timeline 2
		timeline 3
timeline 1
*/
let base_move = {
	previewId: null,
	mainTimeline: []
};
base_move = reducer(base_move, Actions.addTimelineAction(standardizeTimelineId(0), null));
base_move = reducer(base_move, Actions.addTimelineAction(standardizeTimelineId(1), null));
base_move = reducer(base_move, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));
base_move = reducer(base_move, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
base_move = reducer(base_move, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));

// node jump, trial 0 jumps out of and is inserted before timeline 0
/*
trial 0
timeline 0
	timeline 2
		timeline 3
timeline 1
*/
let expected_move1 = {
	previewId: null,
	mainTimeline: []
};
expected_move1 = reducer(expected_move1, Actions.addTrialAction(standardizeTrialId(0), null));
expected_move1 = reducer(expected_move1, Actions.addTimelineAction(standardizeTimelineId(0), null));
expected_move1 = reducer(expected_move1, Actions.addTimelineAction(standardizeTimelineId(1), null));
expected_move1 = reducer(expected_move1, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
expected_move1 = reducer(expected_move1, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));

// node displacement, timeline 2 is moved before trial 0
/*
timeline 0
	timeline 2
		timeline 3
	trial 0
timeline 1
*/
let expected_move2 = {
	previewId: null,
	mainTimeline: []
};
expected_move2 = reducer(expected_move2, Actions.addTimelineAction(standardizeTimelineId(0), null));
expected_move2 = reducer(expected_move2, Actions.addTimelineAction(standardizeTimelineId(1), null));
expected_move2 = reducer(expected_move2, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
expected_move2 = reducer(expected_move2, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
expected_move2 = reducer(expected_move2, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));

// node move into, timeline 1 moves into timeline 0
/*
timeline 0
	trial 0
	timeline 2
		timeline 3
	timeline 1
*/
let expected_move3 = {
	previewId: null,
	mainTimeline: []
};
expected_move3 = reducer(expected_move3, Actions.addTimelineAction(standardizeTimelineId(0), null));
expected_move3 = reducer(expected_move3, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));
expected_move3 = reducer(expected_move3, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
expected_move3 = reducer(expected_move3, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
expected_move3 = reducer(expected_move3, Actions.addTimelineAction(standardizeTimelineId(1), standardizeTimelineId(0)));

// node move out, timeline 2 moves out of timeline 0
/*
timeline 0
	trial 0
timeline 2
	timeline 3
timeline 1
*/
let expected_move4 = {
	previewId: null,
	mainTimeline: []
};
expected_move4 = reducer(expected_move4, Actions.addTimelineAction(standardizeTimelineId(0), null));
expected_move4 = reducer(expected_move4, Actions.addTimelineAction(standardizeTimelineId(2), null));
expected_move4 = reducer(expected_move4, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
expected_move4 = reducer(expected_move4, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));
expected_move4 = reducer(expected_move4, Actions.addTimelineAction(standardizeTimelineId(1), null));

describe('Timeline Node Reducers for Moving actions', () => {
	it('should handle node jump', () => {
		let s1 = {
			previewId: null,
			mainTimeline: []
		};
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0), null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), null));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
		s1 = reducer(s1, Actions.moveToAction(standardizeTrialId(0), standardizeTimelineId(0)));
		expect(s1).toEqual(expected_move1);
	})

	it('should handle node displacement', () => {
		let s1 = {
			previewId: null,
			mainTimeline: []
		};
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0), null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), null));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
		s1 = reducer(s1, Actions.moveToAction(standardizeTimelineId(2), standardizeTrialId(0)));
		expect(s1).toEqual(expected_move2);
	})

	it('should handle node moving into', () => {
		let s1 = {
			previewId: null,
			mainTimeline: []
		};
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0), null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), null));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
		s1 = reducer(s1, Actions.moveIntoAction(standardizeTimelineId(1)));
		expect(s1).toEqual(expected_move3);
	})

	it('should handle node moving out', () => {
		let s1 = {
			previewId: null,
			mainTimeline: []
		};
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0), null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), null));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
		s1 = reducer(s1, Actions.moveToAction(standardizeTimelineId(2), standardizeTimelineId(0), true));
		expect(s1).toEqual(expected_move4);
	})

	it('should handle error case: ancestor node wants to move into descendant node', () => {
		let s1 = {
			previewId: null,
			mainTimeline: []
		};
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0), null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), null));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
		s1 = reducer(s1, Actions.moveToAction(standardizeTimelineId(0), standardizeTimelineId(2), true));
		expect(s1).toEqual(base_move);
	})
})
/*********** Move actions **************/

/*********** Duplicate actions **************/

/*
timeline 0
	timeline 1
		trial 0
*/
let base_dup1 = {
	previewId: null,
	mainTimeline: []
};
base_dup1 = reducer(base_dup1, Actions.addTimelineAction(standardizeTimelineId(0), null));
base_dup1 = reducer(base_dup1, Actions.addTimelineAction(standardizeTimelineId(1), standardizeTimelineId(0)));
base_dup1 = reducer(base_dup1, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(1)));

// duplicate nested timeline
/*
timeline 0
	timeline 1
		trial 0
timeline 2
	timeline 3
		trial 1
*/
let expect_dup1 = {
	previewId: null,
	mainTimeline: []
};
expect_dup1 = reducer(expect_dup1, Actions.addTimelineAction(standardizeTimelineId(0), null));
expect_dup1 = reducer(expect_dup1, Actions.addTimelineAction(standardizeTimelineId(1), standardizeTimelineId(0)));
expect_dup1 = reducer(expect_dup1, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(1)));
expect_dup1 = reducer(expect_dup1, Actions.addTimelineAction(standardizeTimelineId(2), null));
expect_dup1 = reducer(expect_dup1, Actions.addTimelineAction(standardizeTimelineId(3), standardizeTimelineId(2)));
expect_dup1 = reducer(expect_dup1, Actions.addTrialAction(standardizeTrialId(1), standardizeTimelineId(3)));

// duplicate single trial
/*
timeline 0
	timeline 1
		trial 0
		trial 1
*/
let expect_dup2 = {
	previewId: null,
	mainTimeline: []
};
expect_dup2 = reducer(expect_dup2, Actions.addTimelineAction(standardizeTimelineId(0), null));
expect_dup2 = reducer(expect_dup2, Actions.addTimelineAction(standardizeTimelineId(1), standardizeTimelineId(0)));
expect_dup2 = reducer(expect_dup2, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(1)));
expect_dup2 = reducer(expect_dup2, Actions.addTrialAction(standardizeTrialId(1), standardizeTimelineId(1)));

let expect_dup3 = {
	previewId: null,
	mainTimeline: []
};
expect_dup3 = reducer(expect_dup3, Actions.addTimelineAction(standardizeTimelineId(0), null));
expect_dup3 = reducer(expect_dup3, Actions.addTimelineAction(standardizeTimelineId(1), null));

describe('Timeline Node Reducers for Duplicating actions', () => {
	it('should handle duplicating nested timeline', () => {
		let s1 = {
			previewId: null,
			mainTimeline: []
		};
		let timelineId = 0;
		let trialId = 0;
		let getTimelineId = () => {
			return standardizeTimelineId(timelineId++);
		}

		let getTrialId = () => {
			return standardizeTrialId(trialId++);
		}

		s1 = reducer(s1, Actions.addTimelineAction(getTimelineId(), null));
		s1 = reducer(s1, Actions.addTimelineAction(getTimelineId(), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTrialAction(getTrialId(), standardizeTimelineId(1)));
		s1 = reducer(s1, Actions.duplicateTimelineAction(getTimelineId(), standardizeTimelineId(0), getTimelineId, getTrialId));
		expect(s1).toEqual(expect_dup1);
	})

	it('should handle duplicating single trial', () => {
		let s1 = {
			previewId: null,
			mainTimeline: []
		};
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0), null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1), standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTrialId(0), standardizeTimelineId(1)));
		s1 = reducer(s1, Actions.duplicateTrialAction(standardizeTrialId(1), standardizeTrialId(0)));
		expect(s1).toEqual(expect_dup2);
	})

	it('should handle duplicating single timeline', () => {
		let s1 = {
			previewId: null,
			mainTimeline: []
		};
		let timelineId = 0;
		let trialId = 0;
		let getTimelineId = () => {
			return standardizeTimelineId(timelineId++);
		}

		let getTrialId = () => {
			return standardizeTrialId(trialId++);
		}

		s1 = reducer(s1, Actions.addTimelineAction(getTimelineId(), null));
		s1 = reducer(s1, Actions.duplicateTimelineAction(getTimelineId(), standardizeTimelineId(0), getTimelineId, getTrialId));
		expect(s1).toEqual(expect_dup3);
	})

})