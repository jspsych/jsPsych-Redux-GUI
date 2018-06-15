import { connect } from 'react-redux';
import Profile from '../../../../components/Appbar/UserMenu/Profile';
import * as userActions from '../../../../actions/userActions';


const setOsfAccess = (dispatch, osfAccess, setReactState) => {
	return dispatch((dispatch, getState) => {
		dispatch(userActions.setOsfAccessAction(osfAccess));
		return myaws.DynamoDB.pushUserData(getState().userState).then(() => {
			utils.notifications.notifySuccessBySnackbar({
				dispatch, 
				message: "Profile Updated !"
			});
		}).catch((err) => {
			utils.notifications.notifyErrorByDialog({
				dispatch, 
				message: err.message
			});
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	let userState = state.userState;

	return {
		username: userState.username,
		osfAccess: userState.osfAccess || [],
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setOsfAccess: (osfAccess, setReactState) => setOsfAccess(dispatch, osfAccess, setReactState),
	notifyWarningBySnackbar: (message) => notifyWarningBySnackbar(dispatch, message),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);