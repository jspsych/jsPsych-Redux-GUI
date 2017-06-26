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


const mapStateToProps = (state, ownProps) => {
  return {
    username: state.userState.username
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleSignIn: () => { handleSignIn(dispatch) },
	handleCreateAccount: () => { handleCreateAccount(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
