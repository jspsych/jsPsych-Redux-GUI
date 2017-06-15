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

export function moveToAction(sourceId, targetId, isLast) {
	return {
		type: actionTypes.MOVE_TO,
		sourceId: sourceId,
		targetId: targetId,
		isLast: isLast,
	};
}

export function moveIntoAction(id) {
	return {
		type: actionTypes.MOVE_INTO,
		id: id,
	};
}

export function moveByKeyboardAction(id, key) {
	return {
		type: actionTypes.MOVE_BY_KEYBOARD,
		id: id,
		key: key,
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


export function setToggleCollectivelyAction(flag, spec=null) {
	return {
		type: actionTypes.SET_TOGGLE_COLLECTIVELY,
		flag: flag,
		spec: spec,
	};
}

export function setCollapsed(id, toggle=true) {
	return {
		type: actionTypes.SET_COLLAPSED,
		id: id
	};
}

export function insertNodeAfterTrialAction(id, targetId, isTimeline=false) {
	return {
		type: actionTypes.INSERT_NODE_AFTER_TRIAL,
		id: id,
		targetId: targetId,
		isTimeline: isTimeline
	};
}

export function duplicateTimelineAction(dupId, targetId, getTimelineIdCallback, getTrialIdCallback) {
	return {
		type: actionTypes.DUPLICATE_TIMELINE,
		dupId: dupId,
		targetId: targetId,
		getTimelineId: getTimelineIdCallback,
		getTrialId: getTrialIdCallback,
	};
}

export function duplicateTrialAction(dupId, targetId) {
	return {
		type: actionTypes.DUPLICATE_TRIAL,
		dupId: dupId,
		targetId: targetId,
	};
}
