import * as actionTypes from '../constants/ActionTypes';

export function resizeTimelineOrganizerAction(percent) {
	return {
		type: actionTypes.RESIZE_TIMELINE_ORGANIZAER_DRAWER,
		percent: percent
	};
}