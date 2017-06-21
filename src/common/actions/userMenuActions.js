import * as actionTypes from '../constants/ActionTypes';

export function showRegisterWindow() {
	return {
		type: actionTypes.SHOW_REGISTER_WINDOW,
	};
}

export function hideRegisterWindow() {
	return {
		type: actionTypes.HIDE_REGISTER_WINDOW,
	};
}
