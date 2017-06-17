import * as actionTypes from '../constants/ActionTypes';
import { combineReducers } from "redux";
import timelineNodeReducer from './TimelineNode';
import jsPsychInitReducer from './jsPsychInit';

const initState = {
	experimentName: "Untitled Experiment"
};

const setExperimentName = (state, action) => {
	return Object.assign({}, state, {
		experimentName: action.name
	})
}

function mainReducer(state = initState, action) {
	switch (action.type) {
		case actionTypes.SET_EXPERIMENT_NAME:
			return setExperimentName(state, action);
		default:
			return state;
	}
	
}


const rootReducer = combineReducers({
	mainState: mainReducer,
	timelineNodeState: timelineNodeReducer,
	jsPsychInitState: jsPsychInitReducer,
});

export default rootReducer;