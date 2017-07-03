import * as actionTypes from '../constants/ActionTypes';

export function notifyAction(notifyMethod, notifyType, message) {
	return {
		type: actionTypes.NOTIFICATION,
		notifyMethod: notifyMethod,
		notifyType: notifyType,
		message: message
	};
}

export function notificationCloseAction() {
	return {
		type: actionTypes.NOTIFICATION_CLOSE
	};
}