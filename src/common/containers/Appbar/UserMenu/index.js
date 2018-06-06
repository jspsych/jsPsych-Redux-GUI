import { connect } from 'react-redux';

import UserMenu from '../../../components/Appbar/UserMenu';
import * as userActions from '../../../actions/userActions';
import { LoginModes } from '../../../reducers/User';

const handleSignIn = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(true, LoginModes.signIn));
}

const handleCreateAccount = (dispatch) => {
	dispatch(userActions.setLoginWindowAction(true, LoginModes.register));
}

const handleSignOut = (dispatch) => {
	dispatch(userActions.signOutAction());
}

const mapStateToProps = (state, ownProps) => {
	let userState = state.userState;
	let user = userState.user;
	return {
		username: userState.username
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleSignIn: () => { handleSignIn(dispatch) },
	handleCreateAccount: () => { handleCreateAccount(dispatch) },
	handleSignOut: () => { handleSignOut(dispatch); },
	popSignUp: () => utils.logins.popRegister({dispatch}),
	popSignIn: () => utils.logins.popSignIn({dispatch})
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
