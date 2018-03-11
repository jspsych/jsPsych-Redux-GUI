import { connect } from 'react-redux';
import * as notificationActions from '../../actions/notificationActions' ;
import { Notify_Method, Notify_Type } from '../../reducers/Notification';
import Notification from '../../components/Notification';

export const notifyErrorByDialog = (dispatch, message) => {
	dispatch(notificationActions.notifyAction(
				Notify_Method.dialog,
				Notify_Type.error,
				message));
}

export const notifySuccessBySnackbar = (dispatch, message) => {
	dispatch(notificationActions.notifyAction(
		Notify_Method.snackbar,
		Notify_Type.success,
		message));
}

export const notifyWarningBySnackbar = (dispatch, message) => {
	dispatch(notificationActions.notifyAction(
		Notify_Method.snackbar,
		Notify_Type.warning,
		message));
}

export const notifyErrorBySnackbar = (dispatch, message) => {
	dispatch(notificationActions.notifyAction(
		Notify_Method.snackbar,
		Notify_Type.error,
		message));
}

export const notifyWarningByDialog = (dispatch, message) => {
	dispatch(notificationActions.notifyAction(
				Notify_Method.dialog,
				Notify_Type.warning,
				message));
}

export const notifyConfirmByDialog = (dispatch, message, proceedCallback=()=>{}) => {
	dispatch(notificationActions.notifyAction(
				Notify_Method.dialog,
				Notify_Type.confirm,
				message,
				proceedCallback));
}

const handleClose = (dispatch) => {
	dispatch(notificationActions.notificationCloseAction());
}

const mapStateToProps = (state, ownProps) => {
  return {
  	...state.notificationState
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleClose: () => { handleClose(dispatch); },
})

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
