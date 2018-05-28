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

export const OsfAccessDefault = {
	token: null,
	alias: null,
}

export const initState = {
	user: {
		username: null,
		identityId: null,
	},

	// osf cloud deploy info

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

	/********** GUI (Should be Ignored) Information **********/
	loginSession: null,
	windowOpen: false,
	loginMode: LoginModes.signIn,
	lastModifiedExperimentState: experimentInitState,
	/********** GUI (Should be Ignored) Information **********/



	// Cognito Identity Id
	userId: null, 
	username: null,
	email: null,

	// osf access information
	osfAccess: [],

	// diy access information
	diyAccess: [],
};

/**
* Reducer that sets OSF access infomation
* @param {Object} action.osfAccess - OSF Access information
* @return A new userState
*/
function setOsfAccess(state, action) {
	return Object.assign({}, state, {
		osfAccess: action.osfAccess
	});
}

/**
* Reducer that loads fetched user data from dynamoDB
* @param {Object} action.userState - fetched user data from dynamoDB
* @return A new userState
*/
function loadUserState(state, action) {
	return action.userState;
}

function setLoginWindow(state, action) {
	let { open, mode } = action;
	return Object.assign({}, state, {
		windowOpen: open,
		loginMode: (mode === null) ? LoginModes.signIn : mode
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

		case actions.ActionTypes.Load_User_State:
			return loadUserState(state, action);

		// cloud
		case actions.ActionTypes.SET_OSF_ACCESS:
			return setOsfAccess(state, action);

		default:
			return state;
	}
}


