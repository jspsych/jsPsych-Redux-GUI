import { connect } from 'react-redux';
import ObjectEditor from '../../components/ObjectEditor';


const mapStateToProps = (state, ownProps) => {
	return {
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	notifySuccess: (message) => { utils.notifications.notifySuccessBySnackbar({dispatch, message}); },
	notifyError: (message) => { utils.notifications.notifyErrorBySnackbar({dispatch, message}); }
})

export default connect(mapStateToProps, mapDispatchToProps)(ObjectEditor);

