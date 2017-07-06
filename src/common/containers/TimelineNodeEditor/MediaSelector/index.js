import { connect } from 'react-redux';
import MediaSelector from '../../../components/TimelineNodeEditor/MediaSelector';
import * as trialFormActions from '../../../actions/trialFormActions';
import * as notify from '../../Notification';
import { getSignedUrl, listBucketContents } from '../../../backend/s3';
import { convertEmptyStringToNull } from '../../../utils';

const updateFileList = (dispatch, setState, feedback=false) => {
	dispatch((dispatch, getState) => {
		listBucketContents(getState().experimentState.experimentId).then((data) => {
			setState({
				s3files: data,
			});
			if (feedback) {
				notify.notifySuccessBySnackbar(dispatch, "List updated !");
			}
		}, (err) => {
			notify.notifyErrorByDialog(dispatch, err.message);
		});
	})
}

const insertFile = (dispatch, key, filePath) => {
	dispatch(trialFormActions.setPluginParamAction(key, convertEmptyStringToNull(getSignedUrl(filePath))));
	// dispatch(trialFormActions.setPluginParamAction(key, [getSignedUrl(filePath)]));
}

const mapStateToProps = (state, ownProps) => {	
	let experimentState = state.experimentState;

	return {
		param: experimentState[experimentState.previewId].parameters
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	updateFileList: (setState) => { updateFileList(dispatch, setState); },
	insertFile: (key, filePath) => { insertFile(dispatch, key, filePath); }
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaSelector);

