import { connect } from 'react-redux';
import ArrayEditor from '../../components/ArrayEditor';
import { notifySuccessBySnackbar, notifyErrorBySnackbar } from '../Notification';


const mapStateToProps = (state, ownProps) => {
	return {
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	notifySuccess: (m) => { notifySuccessBySnackbar(dispatch, m); },
	notifyError: (m) => { notifyErrorBySnackbar(dispatch, m); }
})

export default connect(mapStateToProps, mapDispatchToProps)(ArrayEditor);

