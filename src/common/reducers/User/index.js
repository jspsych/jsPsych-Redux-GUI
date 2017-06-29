import {
	fetchCredential,
	logout,
	getLoginSessionFromLocalStorage,
	getUserInfoFromLocalStorage,
} from '../../backend/cognito';
import * as actionTypes from '../../constants/ActionTypes';

export const LoginModes = {
	signIn: 0,
	register: 1,
	verification: 2,
}

fetchCredential();
export const initState = {
	user: getUserInfoFromLocalStorage(),
	loginSession: getLoginSessionFromLocalStorage(),

	// last
	lastEdittingId: null,

	// repository
	experiments: [],

	// gui
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

// simple update user info from localstorage which was set by cognito
export function signInOut(state, action) {
	let { signIn } = action;
	let new_state = Object.assign({}, state);
	if (signIn) {
		new_state.windowOpen = false;
	} else {
		logout();
	}
	new_state.user = getUserInfoFromLocalStorage();
	new_state.loginSession = getLoginSessionFromLocalStorage();
	// console.log(new_state.user);
	// console.log(new_state.loginSession)
	return new_state;
}

function test(a) {
	return new Promise(function(resolve, reject) {
		resolve(a);
	})
}


export default function userReducer(state = initState, action) {
	switch (action.type) {
		case actionTypes.SET_LOGIN_WINDOW:
			return setLoginWindow(state, action);
		case actionTypes.SIGN_IN_OUT:
			return signInOut(state, action);
		default:
			return state;
	}
}

