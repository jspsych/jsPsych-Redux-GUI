import * as actionTypes from '../../constants/ActionTypes';

export const Notify_Method = {
	dialog: 'BY_DIALOG',
	snackbar: 'BY_SNACKBAR'
}

export const Notify_Type = {
	warning: 'WARNING',
	success: 'SUCCESS',
	error: 'ERROR',
	confirm: 'CONFIRM'
}


const initState = {
	dialogOpen: false,
	snackbarOpen: false,

	message: '',
	notifyType: null,
	proceedCallback: () => {}
}

/*
action = {
	notifyMethod: string, // how is this message notified
	notifyType: string, // what kind of feed back is this
	confirmType: 
}


*/
function notify(state, action) {
	let { notifyMethod, notifyType, message, proceedCallback } = action;
	let new_state = Object.assign({}, state, {
		message: message,
		notifyType: notifyType,
		proceedCallback: proceedCallback
	});

	if (notifyMethod === Notify_Method.dialog) {
		new_state.dialogOpen = true;
	} else {
		new_state.snackbarOpen = true;
	}

	return new_state;
}

function notificationClose(state, action) {
	return initState;
}

export default function(state=initState, action) {
	switch(action.type) {
		case actionTypes.NOTIFICATION:
			return notify(state, action);
		case actionTypes.NOTIFICATION_CLOSE:
			return notificationClose(state, action);
		default:
			return state;
	}
}