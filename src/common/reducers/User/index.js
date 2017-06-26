import * as actionTypes from '../../constants/ActionTypes';

export const LoginModes = {
	signIn: 0,
	register: 1,
	verification: 2,
}

export const initState = {
  username: null,
  windowOpen: false,
  loginMode: LoginModes.signIn,
};

function setLoginWindow(state, action) {
	let { open, mode } = action;
	return Object.assign({}, state, {
		windowOpen: open,
		loginMode: (mode === null) ? LoginModes.signIn : mode
	})
}

function signIn(state, action) {
	return Object.assign({}, state, {
		username: action.username,
		windowOpen: false
	})
}

export default function userReducer(state = initState, action) {
	switch (action.type) {
		case actionTypes.SET_LOGIN_WINDOW:
			return setLoginWindow(state, action);
		case actionTypes.SIGN_IN:
			return signIn(state, action);
		default:
			return state;
	}
}
