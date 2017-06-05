import * as actionTypes from '../constants/ActionTypes';
import { combineReducers } from "redux";
import timelineNodeReducer from './timelineNode';

const initState = {
};


function mainReducer(state = initState, action) {
	switch (action.type) {
		default:
			return state;
	}
	
}


const rootReducer = combineReducers({
	mainState: mainReducer,
	timelineNodeState: timelineNodeReducer 
});

export default rootReducer;