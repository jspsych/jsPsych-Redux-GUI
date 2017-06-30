import { experimentReducer as reducer, initState } from '../';
import { 	
	enterTest,
	createTimeline, 
	createTrial,
} from '../organizer';
import * as Actions from '../../../actions/organizerActions';
import { standardizeTimelineId, standardizeTrialId, TIMELINE_TYPE, TRIAL_TYPE } from '../utils'; 

enterTest();
if (!Array.prototype.move) {
  Array.prototype.move = function(from,to){
    this.splice(to,0,this.splice(from,1)[0]);
    return this;
  };
}

/*********** Add Actions **************/
let expected_add_timeline_to_main = Object.assign({}, initState);
expected_add_timeline_to_main.mainTimeline = [standardizeTimelineId(0)];
expected_add_timeline_to_main[standardizeTimelineId(0)] = createTimeline(standardizeTimelineId(0));

let expected_add_timeline_to_another = Object.assign({}, initState);
expected_add_timeline_to_another.mainTimeline = [standardizeTimelineId(0)];
expected_add_timeline_to_another[standardizeTimelineId(0)] = createTimeline(standardizeTimelineId(0));
expected_add_timeline_to_another[standardizeTimelineId(0)].collapsed = false ;									  
expected_add_timeline_to_another[standardizeTimelineId(0)].childrenById = [standardizeTimelineId(1)];

expected_add_timeline_to_another[standardizeTimelineId(1)] = createTimeline(standardizeTimelineId(1));
expected_add_timeline_to_another[standardizeTimelineId(1)].parent = standardizeTimelineId(0);

let expected_add_trial_to_main = Object.assign({}, initState);
expected_add_trial_to_main.mainTimeline = [standardizeTrialId(0)];
expected_add_trial_to_main[standardizeTrialId(0)] = createTrial(standardizeTrialId(0));

let expected_add_trial_to_timeline = Object.assign({}, initState);
expected_add_trial_to_timeline.mainTimeline = [standardizeTimelineId(0)];
expected_add_trial_to_timeline[standardizeTimelineId(0)] = createTimeline(standardizeTimelineId(0));
expected_add_trial_to_timeline[standardizeTimelineId(0)].collapsed = false;
expected_add_trial_to_timeline[standardizeTimelineId(0)].childrenById = [standardizeTrialId(0)];
expected_add_trial_to_timeline[standardizeTrialId(0)] = createTrial(standardizeTrialId(0));
expected_add_trial_to_timeline[standardizeTrialId(0)].parent = standardizeTimelineId(0);

describe('Timeline Node Reducers for Adding actions', () => {
	it('should handle add actions of timeline', () => {
		// add to main timeline
		let s1 = reducer(initState, Actions.addTimelineAction(null));
		expected_add_timeline_to_main.timelineCount = s1.timelineCount;
		expected_add_timeline_to_main.trialCount = s1.trialCount;
		expect(s1).toEqual(expected_add_timeline_to_main)

		// add to another timeline
		let s2 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
		expected_add_timeline_to_another.timelineCount = s2.timelineCount;
		expected_add_timeline_to_another.trialCount = s2.trialCount;
		expect(s2).toEqual(expected_add_timeline_to_another);
	})

	it('should handle add actions of trial', () => {
		// add to main timeline
		let s1 = reducer(initState, Actions.addTrialAction(null));
		s1.timelineCount = 0;
		s1.trialCount = 0;
		expect(s1).toEqual(expected_add_trial_to_main);
		// add to another timeline
		let s2 = reducer(initState, Actions.addTimelineAction(null));
		s2 = reducer(s2, Actions.addTrialAction(standardizeTimelineId(0)));
		expected_add_trial_to_timeline.timelineCount = s2.timelineCount;
		expected_add_trial_to_timeline.trialCount = s2.trialCount;
		expect(s2).toEqual(expected_add_trial_to_timeline)
	})
})

/*********** Add actions **************/

/*********** Delete actions **************/

describe('Timeline Node Reducers for Deleting actions', () => {
	it('should handle delete actions', () => {
		// delete from main timeline
		let s1 = reducer(initState, Actions.addTimelineAction(null));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(1)));
		s1 = reducer(s1, Actions.addTrialAction(null));
		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(1)));
		s1 = reducer(s1, Actions.deleteTimelineAction(standardizeTimelineId(0)));
		s1 = reducer(s1, Actions.deleteTrialAction(standardizeTrialId(0)));
		s1.timelineCount = 0;
		s1.trialCount = 0;
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
let base_move = Object.assign({}, initState);
base_move = reducer(base_move, Actions.addTimelineAction(null));
base_move = reducer(base_move, Actions.addTimelineAction(null));
base_move = reducer(base_move, Actions.addTrialAction(standardizeTimelineId(0)));
base_move = reducer(base_move, Actions.addTimelineAction(standardizeTimelineId(0)));
base_move = reducer(base_move, Actions.addTimelineAction(standardizeTimelineId(2)));

// node jump, trial 0 jumps out of and is inserted before timeline 0
/*
trial 0
timeline 0
	timeline 2
		timeline 3
timeline 1
*/
let expected_move1 = Object.assign({}, initState);
expected_move1 = reducer(expected_move1, Actions.addTrialAction(null));
expected_move1 = reducer(expected_move1, Actions.addTimelineAction(null));
expected_move1 = reducer(expected_move1, Actions.addTimelineAction(null));
expected_move1 = reducer(expected_move1, Actions.addTimelineAction(standardizeTimelineId(0)));
expected_move1 = reducer(expected_move1, Actions.addTimelineAction(standardizeTimelineId(2)));

// node displacement, timeline 2 is moved before trial 0
/*
timeline 0
	timeline 2
		timeline 3
	trial 0
timeline 1
*/
let expected_move2 = Object.assign({}, initState);
expected_move2 = reducer(expected_move2, Actions.addTimelineAction(null));
expected_move2 = reducer(expected_move2, Actions.addTimelineAction(null));
expected_move2 = reducer(expected_move2, Actions.addTimelineAction(standardizeTimelineId(0)));
expected_move2 = reducer(expected_move2, Actions.addTimelineAction(standardizeTimelineId(2)));
expected_move2 = reducer(expected_move2, Actions.addTrialAction(standardizeTimelineId(0)));

// node move into, timeline 1 moves into timeline 0
/*
timeline 0
	trial 0
	timeline 2
		timeline 3
	timeline 1
*/
let expected_move3 = Object.assign({}, initState);
expected_move3 = reducer(expected_move3, Actions.addTimelineAction(null));
expected_move3 = reducer(expected_move3, Actions.addTrialAction(standardizeTimelineId(0)));
expected_move3 = reducer(expected_move3, Actions.addTimelineAction(standardizeTimelineId(0)));
expected_move3 = reducer(expected_move3, Actions.addTimelineAction(standardizeTimelineId()));
expected_move3 = reducer(expected_move3, Actions.addTimelineAction(standardizeTimelineId(0)));

// // node move out, timeline 2 moves out of timeline 0
// /*
// timeline 0
// 	trial 0
// timeline 2
// 	timeline 3
// timeline 1
// */
// let expected_move4 = Object.assign({}, initState);
// expected_move4 = reducer(expected_move4, Actions.addTimelineAction(null));
// expected_move4 = reducer(expected_move4, Actions.addTimelineAction(null));
// expected_move4 = reducer(expected_move4, Actions.addTimelineAction(standardizeTimelineId(2)));
// expected_move4 = reducer(expected_move4, Actions.addTrialAction(standardizeTimelineId(0)));
// expected_move4 = reducer(expected_move4, Actions.addTimelineAction(null));

// describe('Timeline Node Reducers for Moving actions', () => {
// 	it('should handle node jump', () => {
// 		let s1 = Object.assign({}, initState);
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2)));
// 		s1 = reducer(s1, Actions.moveToAction(standardizeTrialId(0), standardizeTimelineId(0)));
// 		expect(s1).toEqual(expected_move1);
// 	})

// 	it('should handle node displacement', () => {
// 		let s1 = Object.assign({}, initState);
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2)));
// 		s1 = reducer(s1, Actions.moveToAction(standardizeTimelineId(2), standardizeTrialId(0)));
// 		expect(s1).toEqual(expected_move2);
// 	})

// 	it('should handle node moving into', () => {
// 		let s1 = Object.assign({}, initState);
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2)));
// 		s1 = reducer(s1, Actions.moveIntoAction(standardizeTimelineId(1)));
// 		expect(s1).toEqual(expected_move3);
// 	})

// 	it('should handle node moving out', () => {
// 		let s1 = Object.assign({}, initState);
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2)));
// 		s1 = reducer(s1, Actions.moveToAction(standardizeTimelineId(2), standardizeTimelineId(0), true));
// 		expect(s1).toEqual(expected_move4);
// 	})

// 	it('should handle error case: ancestor node wants to move into descendant node', () => {
// 		let s1 = Object.assign({}, initState);
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(2)));
// 		s1 = reducer(s1, Actions.moveToAction(standardizeTimelineId(0), standardizeTimelineId(2), true));
// 		expect(s1).toEqual(base_move);
// 	})
// })
/*********** Move actions **************/

// /*********** Duplicate actions **************/

// /*
// timeline 0
// 	timeline 1
// 		trial 0
// */
// let base_dup1 = Object.assign({}, initState);
// base_dup1 = reducer(base_dup1, Actions.addTimelineAction(null));
// base_dup1 = reducer(base_dup1, Actions.addTimelineAction(standardizeTimelineId(0)));
// base_dup1 = reducer(base_dup1, Actions.addTrialAction(standardizeTimelineId(1)));

// // duplicate nested timeline
// /*
// timeline 0
// 	timeline 1
// 		trial 0
// timeline 2
// 	timeline 3
// 		trial 1
// */
// let expect_dup1 = Object.assign({}, initState);
// expect_dup1 = reducer(expect_dup1, Actions.addTimelineAction(null));
// expect_dup1 = reducer(expect_dup1, Actions.addTimelineAction(standardizeTimelineId(0)));
// expect_dup1 = reducer(expect_dup1, Actions.addTrialAction(standardizeTimelineId(1)));
// expect_dup1 = reducer(expect_dup1, Actions.addTimelineAction(null));
// expect_dup1 = reducer(expect_dup1, Actions.addTimelineAction(standardizeTimelineId(2)));
// expect_dup1 = reducer(expect_dup1, Actions.addTrialAction(standardizeTimelineId(3)));

// // duplicate single trial
// /*
// timeline 0
// 	timeline 1
// 		trial 0
// 		trial 1
// */
// let expect_dup2 = Object.assign({}, initState);
// expect_dup2 = reducer(expect_dup2, Actions.addTimelineAction(null));
// expect_dup2 = reducer(expect_dup2, Actions.addTimelineAction(standardizeTimelineId(0)));
// expect_dup2 = reducer(expect_dup2, Actions.addTrialAction(standardizeTimelineId(1)));
// expect_dup2 = reducer(expect_dup2, Actions.addTrialAction(standardizeTimelineId(1)));

// let expect_dup3 = Object.assign({}, initState);
// expect_dup3 = reducer(expect_dup3, Actions.addTimelineAction(null));
// expect_dup3 = reducer(expect_dup3, Actions.addTimelineAction(null));

// describe('Timeline Node Reducers for Duplicating actions', () => {
// 	it('should handle duplicating nested timeline', () => {
// 		let s1 = Object.assign({}, initState);
// 		let timelineId = 0;
// 		let trialId = 0;
// 		let getTimelineId = () => {
// 			return standardizeTimelineId(timelineId++);
// 		}

// 		let getTrialId = () => {
// 			return standardizeTrialId(trialId++);
// 		}

// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(1)));
// 		s1 = reducer(s1, Actions.duplicateTimelineAction(standardizeTimelineId(0)));
// 		expect(s1).toEqual(expect_dup1);
// 	})

// 	it('should handle duplicating single trial', () => {
// 		let s1 = Object.assign({}, initState);
// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(1)));
// 		s1 = reducer(s1, Actions.duplicateTrialAction(standardizeTrialId(0)));
// 		expect(s1).toEqual(expect_dup2);
// 	})

// 	it('should handle duplicating single timeline', () => {
// 		let s1 = Object.assign({}, initState);
// 		let timelineId = 0;
// 		let trialId = 0;
// 		let getTimelineId = () => {
// 			return standardizeTimelineId(timelineId++);
// 		}

// 		let getTrialId = () => {
// 			return standardizeTrialId(trialId++);
// 		}

// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.duplicateTimelineAction(standardizeTimelineId(0)));
// 		expect(s1).toEqual(expect_dup3);
// 	})

// })

// /*********** Toggle actions **************/

// // toggle off single trial 1
// /*
// timeline 0 true
// 	timeline 1 true
// 		trial 0 true
// trial 1 false
// */
// let expect_toggle1 = Object.assign({}, initState);
// expect_toggle1 = reducer(expect_toggle1, Actions.addTimelineAction(null));
// expect_toggle1 = reducer(expect_toggle1, Actions.addTimelineAction(standardizeTimelineId(0)));
// expect_toggle1 = reducer(expect_toggle1, Actions.addTrialAction(standardizeTimelineId(1)));
// expect_toggle1 = reducer(expect_toggle1, Actions.addTrialAction(null));
// expect_toggle1[standardizeTrialId(1)].enabled = false;

// // toggle off top most timeline
// /*
// timeline 0 false
// 	timeline 1 false
// 		trial 0 false
// trial 1 true
// */
// let expect_toggle2 = Object.assign({}, initState);
// expect_toggle2 = reducer(expect_toggle2, Actions.addTimelineAction(null));
// expect_toggle2 = reducer(expect_toggle2, Actions.addTimelineAction(standardizeTimelineId(0)));
// expect_toggle2 = reducer(expect_toggle2, Actions.addTrialAction(standardizeTimelineId(1)));
// expect_toggle2 = reducer(expect_toggle2, Actions.addTrialAction(null));
// expect_toggle2[standardizeTimelineId(0)].enabled = false;
// expect_toggle2[standardizeTimelineId(1)].enabled = false;
// expect_toggle2[standardizeTrialId(0)].enabled = false;


// // deselect option
// /*
// timeline 0 false
// 	timeline 1 false
// 		trial 0 false
// trial 1 false
// */
// let expect_toggle3 = Object.assign({}, initState);
// expect_toggle3 = reducer(expect_toggle3, Actions.addTimelineAction(null));
// expect_toggle3 = reducer(expect_toggle3, Actions.addTimelineAction(standardizeTimelineId(0)));
// expect_toggle3 = reducer(expect_toggle3, Actions.addTrialAction(standardizeTimelineId(1)));
// expect_toggle3 = reducer(expect_toggle3, Actions.addTrialAction(null));
// expect_toggle3[standardizeTimelineId(0)].enabled = false;
// expect_toggle3[standardizeTimelineId(1)].enabled = false;
// expect_toggle3[standardizeTrialId(0)].enabled = false;
// expect_toggle3[standardizeTrialId(1)].enabled = false;

// // toggle only timeline 1 on
// /*
// timeline 0 true
// 	timeline 1 true
// 		trial 0 true
// trial 1 false
// */
// let expect_toggle4 = Object.assign({}, initState);
// expect_toggle4 = reducer(expect_toggle4, Actions.addTimelineAction(null));
// expect_toggle4 = reducer(expect_toggle4, Actions.addTimelineAction(standardizeTimelineId(0)));
// expect_toggle4 = reducer(expect_toggle4, Actions.addTrialAction(standardizeTimelineId(1)));
// expect_toggle4 = reducer(expect_toggle4, Actions.addTrialAction(null));
// expect_toggle4[standardizeTimelineId(0)].enabled = true;
// expect_toggle4[standardizeTimelineId(1)].enabled = true;
// expect_toggle4[standardizeTrialId(0)].enabled = true;
// expect_toggle4[standardizeTrialId(1)].enabled = false;

// describe('Timeline Node Reducers for Toggle actions', () => {
// 	it('should handle toggling off single trial', () => {
// 		let s1 = Object.assign({}, initState);

// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(1)));
// 		s1 = reducer(s1, Actions.addTrialAction(null));
// 		s1 = reducer(s1, Actions.onToggleAction(standardizeTrialId(1)));
// 		expect(s1).toEqual(expect_toggle1);
// 	})

// 	it('should handle toggle of nested timeline', () => {
// 		let s1 = Object.assign({}, initState);

// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(1)));
// 		s1 = reducer(s1, Actions.addTrialAction(null));
// 		s1 = reducer(s1, Actions.onToggleAction(standardizeTimelineId(0)));
// 		expect(s1).toEqual(expect_toggle2);
// 	})

// 	it('should handle deselect option', () => {
// 		let s1 = Object.assign({}, initState);

// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(1)));
// 		s1 = reducer(s1, Actions.addTrialAction(null));
// 		s1 = reducer(s1, Actions.setToggleCollectivelyAction(false));
// 		expect(s1).toEqual(expect_toggle3);
// 	})

// 	it('should handle selecting only one', () => {
// 		let s1 = Object.assign({}, initState);

// 		s1 = reducer(s1, Actions.addTimelineAction(null));
// 		s1 = reducer(s1, Actions.addTimelineAction(standardizeTimelineId(0)));
// 		s1 = reducer(s1, Actions.addTrialAction(standardizeTimelineId(1)));
// 		s1 = reducer(s1, Actions.addTrialAction(null));
// 		s1 = reducer(s1, Actions.setToggleCollectivelyAction(false, standardizeTimelineId(1)));
// 		expect(s1).toEqual(expect_toggle4);
// 	})

// })