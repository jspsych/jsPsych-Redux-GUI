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

export function showSignInWindow() {
	return {
		type: actionTypes.SHOW_SIGNIN_WINDOW,
	};
}

export function hideSignInWindow() {
	return {
		type: actionTypes.HIDE_SIGNIN_WINDOW,
	};
}
