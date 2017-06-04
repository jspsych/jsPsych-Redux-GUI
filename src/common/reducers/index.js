import * as actionTypes from '../constants/ActionTypes';

const MAX_TIMELINE_ORGANIZER_WIDTH = 60;
const MIN_TIMELINE_ORGANIZER_WIDTH = 20;
const TOTAL_WIDTH = 100;

const initState = {
	timelineOrganizerWidth: 20,
	mainBodyWidth: 80,
	timelineEditorWidth: 0,
}

function resizeTimelineOrganizer(state, action) {
	let percent = action.percent;
	if (percent > MAX_TIMELINE_ORGANIZER_WIDTH)
		percent = MAX_TIMELINE_ORGANIZER_WIDTH;
	if (percent < MIN_TIMELINE_ORGANIZER_WIDTH && !action.close)
		percent = MIN_TIMELINE_ORGANIZER_WIDTH;

	return Object.assign({}, state, {
		timelineOrganizerWidth: percent,
		mainBodyWidth: TOTAL_WIDTH - percent - state.timelineEditorWidth
	});
}


function rootReducer(state = initState, action) {
	switch (action.type) {
		case actionTypes.RESIZE_TIMELINE_ORGANIZAER_DRAWER:
			return resizeTimelineOrganizer(state, action);
		default:
			return state;
	}
	
}


export default rootReducer;