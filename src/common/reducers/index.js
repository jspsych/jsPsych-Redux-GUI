import * as actionTypes from '../constants/ActionTypes';

const initState = {
	// id of which is being previewed/editted
	previewId: null,

	// the main timeline
	mainTimeline: [], 
};


function rootReducer(state = initState, action) {
	switch (action.type) {
		default:
			return state;
	}
	
}


export default rootReducer;