import { connect } from 'react-redux';
import Profile from '../../../../components/Appbar/UserMenu/Profile';
import * as userActions from '../../../../actions/userActions';
import { pushUserData } from '../../../../backend/dynamoDB';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../../Notification';

const setOsfToken = (dispatch, osfToken) => {
	dispatch((dispatch, getState) => {
		// if (osfToken === getState().userState.osfToken) {
		// 	notifyWarningBySnackbar(dispatch, "Nothing has changed !");
		// 	return;
		// }
		dispatch(userActions.setOsfTokenAction(osfToken ? osfToken : null));
		pushUserData(getState().userState).then(() => {
			notifySuccessBySnackbar(dispatch, "Token Updated !");
		}, (err) => {
			notifyErrorByDialog(dispatch, err.message);
		});
	})
}

const setOsfAccess = (dispatch, osfAccess) => {
	return dispatch(userActions.setOsfAccessAction(osfAccess));
}

const mapStateToProps = (state, ownProps) => {
	let userState = state.userState;

	return {
		osfToken: userState.osfToken ? state.userState.osfToken : '',
		username: userState.user.username,
		osfAccess: userState.osfAccess,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setOsfToken: (osfToken) => { setOsfToken(dispatch, osfToken); },
	setOsfAccess: (osfAccess) => setOsfAccess(dispatch, osfAccess),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);