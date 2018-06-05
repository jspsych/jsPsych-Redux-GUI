import { connect } from 'react-redux';
import Notifications from '../../components/Notifications';


const handleDialogClose = ({dispatch}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.NOTIFY_DIALOG_CLOSE,
	}))
}

const handleSnackbarClose = ({dispatch}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.NOTIFY_SNACKBAR_CLOSE,
	}))
}

export const notifySuccessByDialog = ({dispatch, message}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.NOTIFY_SUCCESS_DIALOG, 
		notifyType: enums.Notify_Type.success,
		message
	}))
}

export const notifyWarningByDialog = ({dispatch, message}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.NOTIFY_WARNING_DIALOG, 
		notifyType: enums.Notify_Type.warning,
		message
	}))
}

export const notifyErrorByDialog = ({dispatch, message}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.NOTIFY_ERROR_DIALOG, 
		notifyType: enums.Notify_Type.error,
		message
	}))
}

export const notifySuccessBySnackbar = ({dispatch, message}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.NOTIFY_SUCCESS_SNACKBAR, 
		notifyType: enums.Notify_Type.success,
		message
	}));
}

export const notifyWarningBySnackbar = ({dispatch, message}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.NOTIFY_WARNING_SNACKBAR, 
		notifyType: enums.Notify_Type.warning,
		message
	}));
}

export const notifyErrorBySnackbar = ({dispatch, message}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.NOTIFY_ERROR_SNACKBAR, 
		notifyType: enums.Notify_Type.error,
		message
	}));
}

export const popUpConfirmation = (args = {
	dispatch,
	message: "",
	continueWithOperation: () => {},
	continueWithoutOperation: () => {},
	continueWithOperationLabel: "Yes",
	continueWithoutOperationLabel: "No",
	showCancelButton: true,
	withExtraCare: false,
	extraCareText: "Yes, I know what I am doing."
}) => {
	dispatch(actions.emitAction({
		type: actions.ActionTypes.POP_UP_CONFIRM, 
		notifyType: enums.Notify_Type.confirm,
		...args
	}));
}

const mapStateToProps = (state, ownProps) => {
  return {
  	...state.notifications
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleDialogClose: () => { return handleDialogClose({dispatch,}) },
	handleSnackbarClose: () => { return handleSnackbarClose({dispatch,}) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);