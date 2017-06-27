import * as actionTypes from '../constants/ActionTypes';

export function setLoginWindowAction(open, mode=null) {
	return {
		type: actionTypes.SET_LOGIN_WINDOW,
		open: open,
		mode: mode
	};
}

export function signInAction(user) {
	return {
		type: actionTypes.SIGN_IN_OUT,
		user: user,
	};
}

export function signOutAction() {
	return {
		type: actionTypes.SIGN_IN_OUT,
		user: null,
	};
}