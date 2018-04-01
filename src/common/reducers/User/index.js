import { logout, getLoginSessionFromCognito, getUserInfoFromCognito } from '../../backend/cognito';
import { initState as experimentInitState } from '../Experiment';
import * as actionTypes from '../../constants/ActionTypes';

export const GUI_IGNORE = ['loginSession', 'windowOpen', 'loginMode', 'lastModifiedExperimentState'];

export const LoginModes = {
	signIn: 0,
	register: 1,
	verification: 2,
	forgotPassword: 3,
}

export const initState = {
	user: {
		username: null,
		identityId: null,
	},

	// osfToken
	osfToken: null,

	// last
	lastModifiedExperimentId: null,

	// repository
	/*
	{
	name: experiment name,
	id: experiment id,
	/*
	{
	createdDate: date,
	lasEditDate: date,
	description: string
	}
	/
	details: experiment details
	}
	*/ 
	experiments: [],

	// gui
	loginSession: null,
	windowOpen: false,
	loginMode: LoginModes.signIn,
	lastModifiedExperimentState: experimentInitState,
};


function setLoginWindow(state, action) {
	let { open, mode } = action;
	return Object.assign({}, state, {
		windowOpen: open,
		loginMode: (mode === null) ? LoginModes.signIn : mode
	})
}

function setOsfToken(state, action) {
	return Object.assign({}, state, {
		osfToken: action.osfToken
	})
}


export function signInOut(state, action) {
	let { signIn } = action;

	let new_state = Object.assign({}, state);
	if (signIn) {
		new_state.windowOpen = false;
	} else {
		logout();
		window.location.reload(false); // will intiate all
	}
	new_state.user = getUserInfoFromCognito();
	new_state.loginSession = getLoginSessionFromCognito();
	
	return new_state;
}


export default function userReducer(state = initState, action) {
	switch (action.type) {
		case actionTypes.SET_LOGIN_WINDOW:
			return setLoginWindow(state, action);
		case actionTypes.SIGN_IN_OUT:
			return signInOut(state, action);
		case actionTypes.SET_OSFTOKEN:
			return setOsfToken(state, action);
		default:
			return state;
	}
}

