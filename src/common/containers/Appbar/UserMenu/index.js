import { connect } from 'react-redux';

import UserMenu from '../../../components/Appbar/UserMenu';

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.userState.user
  }
}

const mapDispatchToProps = (dispath, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
