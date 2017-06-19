import * as actionTypes from '../constants/ActionTypes';

export function changeCellAction(cellId, newVal) {
	return {
		type: actionTypes.CHANGE_CELL,
		cellId: cellId,
		newVal: newVal
	};
}

export function changeHeaderAction(headerId, newVal) {
	console.log('inside action headerId: ' + headerId);

	return {
		type: actionTypes.CHANGE_HEADER,
		headerId: headerId,
		newVal: newVal
	};
}

export function addColumn(id) {
	return {
		type: actionTypes.ADD_COLUMN,
		id: id
	};
}

export function addRow(id) {
	return {
		type: actionTypes.ADD_ROW,
		id: id
	};
}