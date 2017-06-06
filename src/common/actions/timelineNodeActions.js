import * as actionTypes from '../constants/ActionTypes';

export function addTimelineAction(name, parent) {
	return {
		type: actionTypes.ADD_TIMELINE,
		name: name,
		parent: parent, 
	};
}

export function addTrialAction(name, parent) {
	return {
		type: actionTypes.ADD_TRIAL,
		name: name,
		parent: parent, 
	};
}

export function deleteTimelineAction(id) {
	return {
		type: actionTypes.DELETE_TIMELINE,
		id: id
	}
}

export function deleteTrialAction(id) {
	return {
		type: actionTypes.DELETE_TRIAL,
		id: id
	}
}

export function moveTimelineAction(sourceId, targetId, position) {
	return {
		type: actionTypes.MOVE_TIMELINE,
		sourceId: sourceId,
		targetId: targetId,
		position: position
	}
}

export function moveTrialAction(sourceId, targetId, position) {
	return {
		type: actionTypes.MOVE_TRIAL,
		sourceId: sourceId,
		targetId: targetId,
		position: position
	}
}