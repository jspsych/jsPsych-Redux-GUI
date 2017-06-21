import { connect } from 'react-redux';

import UserMenu from '../../../components/Appbar/UserMenu';
import * as userMenuActions from '../../../actions/userMenuActions';

const showRegisterWindow = (dispatch) => {
  dispatch(userMenuActions.showRegisterWindow());
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.userState.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  showRegisterWindow: () => { showRegisterWindow(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
