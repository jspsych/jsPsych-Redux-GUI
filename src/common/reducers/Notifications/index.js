const initState = {
	dialogOpen: false,
	snackbarOpen: false,
	notifyType: enums.Notify_Type.success,
	message: "",

	// confirm
	continueWithOperation: () => Promise.resolve(),
	continueWithoutOperation: () => Promise.resolve(),
	continueWithOperationLabel: "Yes",
	continueWithoutOperationLabel: "No",
	showCancelButton: true,
	withExtraCare: false,
	extraCareText: "Yes, I know what I am doing."
}


const setNotification = (state, action) => {
	action = utils.deepCopy(action);
	let type = action.type;
	delete action[type];
	switch(type) {
		case actions.ActionTypes.NOTIFY_WARNING_DIALOG:
		case actions.ActionTypes.NOTIFY_SUCCESS_DIALOG:
		case actions.ActionTypes.NOTIFY_ERROR_DIALOG:
		case actions.ActionTypes.POP_UP_CONFIRM:
			return Object.assign({}, initState, {
				dialogOpen: true,
				...action
			});
		case actions.ActionTypes.NOTIFY_SUCCESS_SNACKBAR:
		case actions.ActionTypes.NOTIFY_WARNING_SNACKBAR: 
		case actions.ActionTypes.NOTIFY_ERROR_SNACKBAR: 
			return Object.assign({}, initState, {
				snackbarOpen: true,
				...action
			});
		case actions.ActionTypes.NOTIFY_DIALOG_CLOSE: 
		case actions.ActionTypes.NOTIFY_SNACKBAR_CLOSE: 
			return initState;
		default:
			return state;
	}
}

export default function reducer(state=initState, action) {
	switch(action.type) {
		case actions.ActionTypes.NOTIFY_WARNING_DIALOG:
		case actions.ActionTypes.NOTIFY_WARNING_SNACKBAR: 
		case actions.ActionTypes.NOTIFY_SUCCESS_DIALOG:
		case actions.ActionTypes.NOTIFY_SUCCESS_SNACKBAR:
		case actions.ActionTypes.NOTIFY_ERROR_DIALOG:
		case actions.ActionTypes.NOTIFY_ERROR_SNACKBAR: 
		case actions.ActionTypes.NOTIFY_DIALOG_CLOSE: 
		case actions.ActionTypes.NOTIFY_SNACKBAR_CLOSE: 
		case actions.ActionTypes.POP_UP_CONFIRM: 
			return setNotification(state, action);
		default:
			return state;
	}
}