import { connect } from 'react-redux';
import Profile from '../../../../components/Appbar/UserMenu/Profile';
import * as userActions from '../../../../actions/userActions';
import {
	pushUserData,
} from '../../../../backend/dynamoDB';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar
} from '../../../Notification';

const setOsfToken = (dispatch, osfToken) => {
	dispatch((dispatch, getState) => {
		dispatch(userActions.setOsfTokenAction(osfToken ? osfToken : null));
		pushUserData(getState().userState).then(() => {
			notifySuccessBySnackbar(dispatch, "Token Updated !");
		}, (err) => {
			notifyErrorByDialog(dispatch, err.message);
		});
	})
}

const mapStateToProps = (state, ownProps) => {
	return {
		osfToken: state.userState.osfToken ? state.userState.osfToken : '',
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setOsfToken: (osfToken) => { setOsfToken(dispatch, osfToken); }
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);