import * as actionTypes from '../constants/ActionTypes';

export function resizeTimelineOrganizerAction(percent, close=false) {
	return {
		type: actionTypes.RESIZE_TIMELINE_ORGANIZAER_DRAWER,
		percent: percent,
		close: close
	};
}