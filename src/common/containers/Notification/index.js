import { connect } from 'react-redux';
import * as notificationActions from '../../actions/notificationActions' ;
import { Notify_Method, Notify_Type } from '../../reducers/Notification';
import Notification from '../../components/Notification';

export const notifyError = (dispatch, message) => {
	dispatch(notificationActions.notifyAction(
				Notify_Method.dialog,
				Notify_Type.error,
				message));
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
	handleClose: () => { handleClose(dispatch); }
})

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
