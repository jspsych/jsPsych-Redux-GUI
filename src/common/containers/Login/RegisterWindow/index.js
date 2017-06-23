import { connect } from 'react-redux';
import * as userMenuActions from '../../../actions/userMenuActions';
import RegisterWindow from '../../../components/Login/RegisterWindow';

const hideRegisterWindow = (dispatch) => {
  dispatch(userMenuActions.hideRegisterWindow());
}

const mapStateToProps = (state, ownProps) => {
  return {
    open: state.userState.registerWindowVisible
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  hideRegisterWindow: () => { hideRegisterWindow(dispatch); }
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWindow);
