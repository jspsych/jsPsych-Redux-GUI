import { connect } from 'react-redux';

import UserMenu from '../../../components/Appbar/UserMenu';
import * as userMenuActions from '../../../actions/userMenuActions';


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.userState.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
