import * as actionTypes from '../constants/ActionTypes';

export function signUpPushAction() {
	return {
		type: actionTypes.SIGN_UP_PUSH
	};
}

export function signInPullAction(userData=null, experimentData=null) {
	return {
		type: actionTypes.SIGN_IN_PULL,
		userData: userData,
		experimentData: experimentData,
	};
}

export function clickSavePushAction() {
	return {
		type: actionTypes.CLICK_SAVE_PUSH
	};
}