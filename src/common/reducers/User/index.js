import { awsConfig } from '../../../../config/aws.js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
// var AWS = require('aws-sdk');

const userPool = new CognitoUserPool({
  UserPoolId: awsConfig.UserPoolId,
  ClientId: awsConfig.ClientId,
});

var cognitoUser = userPool.getCurrentUser();
var session = null;
if (cognitoUser !== null) {
	cognitoUser.getSession(function(err, result) {
		if (err) {
			alert(err);
			return;
		}
		if (!result.isValid()) {
			alert('You have been signed out due to overtime.');
		} else {
			session = result;
			console.log(getTokens(session));
		}
	});
}


import * as actionTypes from '../../constants/ActionTypes';

export const LoginModes = {
	signIn: 0,
	register: 1,
	verification: 2,
}

export const initState = {
	// a cognito object
	user: cognitoUser,

	// repository
	experiments: [],
	medias: [],

	// gui
	windowOpen: false,
	loginMode: LoginModes.signIn,
};

function getTokens(session) {
	if (session === null) {
		return null;
	} else {
		return {
			idToken: session.getIdToken().getJwtToken(),
			accessToken: session.getAccessToken().getJwtToken(),
			refreshToken: session.getRefreshToken().token
		}
	}
}

function setLoginWindow(state, action) {
	let { open, mode } = action;
	return Object.assign({}, state, {
		windowOpen: open,
		loginMode: (mode === null) ? LoginModes.signIn : mode
	})
}

function signInOut(state, action) {
	let { user } = action;
	let new_state = Object.assign({}, state);
	if (user !== null) {
		new_state.windowOpen = false;
	} else {
		if (new_state.user) {
			new_state.user.signOut();
		}
	}
	new_state.user = user;
	return new_state;
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

