import { connect } from 'react-redux';
import * as notificationActions from '../../actions/notificationActions' ;
import Notification from '../../components/Notification';

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
