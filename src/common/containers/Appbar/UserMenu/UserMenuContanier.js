import { connect } from 'react-redux';

import UserMenu from '../../../components/Appbar/UserMenu';


const handleSignOut = ({dispatch}) => {
	return myaws.Auth.signOut().then(() => {
		window.location.reload(false);
	});
}

const mapStateToProps = (state, ownProps) => {
	let userState = state.userState;
	return {
		username: userState.username
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleSignOut: () => handleSignOut({dispatch}),
	popSignUp: () => utils.loginWindows.popRegister({dispatch}),
	popSignIn: () => utils.loginWindows.popSignIn({dispatch})
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
