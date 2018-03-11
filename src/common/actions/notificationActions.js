import * as actionTypes from '../constants/ActionTypes';

export function notifyAction(notifyMethod, notifyType, message, proceedCallback=()=>{}) {
	return {
		type: actionTypes.NOTIFICATION,
		notifyMethod: notifyMethod,
		notifyType: notifyType,
		message: message, 
		proceedCallback: proceedCallback
	};
}

export function notificationCloseAction() {
	return {
		type: actionTypes.NOTIFICATION_CLOSE
	};
}