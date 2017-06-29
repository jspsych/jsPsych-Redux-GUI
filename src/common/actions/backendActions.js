import * as actionTypes from '../constants/ActionTypes';

export function signUpAction() {
	return {
		type: actionTypes.SIGN_UP
	};
}

export function signInPullAction(userData=null, experimentData=null) {
	return {
		type: actionTypes.SIGN_IN_PULL,
		userData: userData,
		experimentData: experimentData,
	};
}