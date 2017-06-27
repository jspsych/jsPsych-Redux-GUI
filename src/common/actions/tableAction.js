import * as actionTypes from '../constants/ActionTypes';

export function changeCellAction(cellId, newVal) {
	return {
		type: actionTypes.CHANGE_CELL,
		cellId: cellId,
		newVal: newVal
	};
}

export function changeFirstHeaderAction(headerId, newVal) {
	return {
		type: actionTypes.CHANGE_FIRST_HEADER,
		headerId: headerId,
		newVal: newVal
	};
}

export function changeHeaderAction(headerId, newVal) {
	return {
		type: actionTypes.CHANGE_HEADER,
		headerId: headerId,
		newVal: newVal
	};
}

export function addColumn(id, index) {
	return {
		type: actionTypes.ADD_COLUMN,
		id: id,
	};
}

export function addRow(id) {
	return {
		type: actionTypes.ADD_ROW,
		id: id
	};
}

export function changeSampling(newVal) {
	return {
		type: actionTypes.CHANGE_SAMPLING,
		newVal: newVal
	};
}

export function changeSize(newVal) {
	return {
		type: actionTypes.CHANGE_SIZE,
		newVal: newVal
	};
}

export function changeBool(newBool) {
	return {
		type: actionTypes.CHANGE_RANDOMIZE,
		newBool: newBool
	};
}

export function columnDelete(rowIndex, titleIndex) {
	return {
		type: actionTypes.DELETE_COLUMN,
		rowIndex: rowIndex,
		titleIndex: titleIndex
	};
}

export function rowDelete(rowIndex, titleIndex) {
	return {
		type: actionTypes.DELETE_ROW,
		rowIndex: rowIndex,
		titleIndex: titleIndex
	};
}

export function columnHeaderDelete(rowIndex, titleIndex) {
	return {
		type: actionTypes.DELETE_COLUMN_HEADER,
		rowIndex: rowIndex,
		titleIndex: titleIndex
	};
}


















