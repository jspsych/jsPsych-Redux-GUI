import { connect } from 'react-redux';
import Profile from '../../../../components/Appbar/UserMenu/Profile';
import * as userActions from '../../../../actions/userActions';
import { pushUserData } from '../../../../backend/dynamoDB';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../../Notification';


const setOsfAccess = (dispatch, osfAccess, setReactState) => {
	return dispatch((dispatch, getState) => {
		dispatch(userActions.setOsfAccessAction(osfAccess));
		// setReactState({
		// 	updating: true
		// });
		return pushUserData(getState().userState).then(() => {
			notifySuccessBySnackbar(dispatch, "Profile Updated !");
		}).catch((err) => {
			notifyErrorByDialog(dispatch, err.message);
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	let userState = state.userState;

	return {
		username: userState.user.username,
		osfAccess: userState.osfAccess || [],
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setOsfAccess: (osfAccess, setReactState) => setOsfAccess(dispatch, osfAccess, setReactState),
	notifyWarningBySnackbar: (message) => notifyWarningBySnackbar(dispatch, message),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);