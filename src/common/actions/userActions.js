import * as actionTypes from '../constants/ActionTypes';

export function setLoginWindowAction(open, mode=null) {
	return {
		type: actionTypes.SET_LOGIN_WINDOW,
		open: open,
		mode: mode
	};
}

export function signInAction() {
	return {
		type: actionTypes.SIGN_IN_OUT,
		signIn: true,
	};
}

export function signOutAction() {
	return {
		type: actionTypes.SIGN_IN_OUT,
		signIn: false,
	};
}

export function setOsfTokenAction(osfToken) {
	return {
		type: actionTypes.SET_OSFTOKEN,
		osfToken: osfToken
	}
}

export function setOsfTokenMapAction(map) {
	return {
		type: actionTypes.SET_OSF_TOKEN_MAP,
		map: map
	}
}