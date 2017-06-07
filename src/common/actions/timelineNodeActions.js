import * as actionTypes from '../constants/ActionTypes';

export function addTimelineAction(id, parent) {
	return {
		type: actionTypes.ADD_TIMELINE,
		id: id,
		parent: parent, 
	};
}

export function addTrialAction(id, parent) {
	return {
		type: actionTypes.ADD_TRIAL,
		id: id,
		parent: parent, 
	};
}

export function deleteTimelineAction(id) {
	return {
		type: actionTypes.DELETE_TIMELINE,
		id: id
	};
}

export function deleteTrialAction(id) {
	return {
		type: actionTypes.DELETE_TRIAL,
		id: id
	};
}

export function moveNodeAction(sourceId, targetId, position) {
	return {
		type: actionTypes.MOVE_NODE,
		sourceId: sourceId,
		targetId: targetId,
		position: position
	};
}


export function onPreviewAction(id) {
	return {
		type: actionTypes.ON_PREVIEW,
		id: id
	};
}

export function onToggleAction(id) {
	return {
		type: actionTypes.ON_TOGGLE,
		id: id
	};
}

export function setCollapsed(id, toggle=true) {
	return {
		type: actionTypes.SET_COLLAPSED,
		id: id
	}
}