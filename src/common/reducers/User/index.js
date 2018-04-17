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
	tokenName: null,
}

export const initState = {
	user: {
		username: null,
		identityId: null,
	},

	osfAccess: [],
	diyAccess: [],

	// osfToken
	osfToken: null,

	// osf cloud deploy info

	/********** cloud deployment info **********/
	/*
	cloudDeployInfo: {
		osfNode: null,
		saveAfter: 0,
		osfToken: null
	}
	*/
	cloudDeployInfo: {},

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
};


function setLoginWindow(state, action) {
	let { open, mode } = action;
	return Object.assign({}, state, {
		windowOpen: open,
		loginMode: (mode === null) ? LoginModes.signIn : mode
	})
}

function setOsfAccess(state, action) {
	return Object.assign({}, state, {
		osfAccess: action.osfAccess
	});
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

		// cloud
		case actionTypes.SET_OSF_ACCESS:
			return setOsfAccess(state, action);

		default:
			return state;
	}
}

