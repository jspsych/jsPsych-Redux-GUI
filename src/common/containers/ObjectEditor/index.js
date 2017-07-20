import { connect } from 'react-redux';
import ObjectEditor from '../../components/ObjectEditor';
import { notifySuccessBySnackbar, notifyErrorBySnackbar } from '../Notification';



const mapStateToProps = (state, ownProps) => {
	return {
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	notifySuccess: (m) => { notifySuccessBySnackbar(dispatch, m); },
	notifyError: (m) => { notifyErrorBySnackbar(dispatch, m); }
})

export default connect(mapStateToProps, mapDispatchToProps)(ObjectEditor);

