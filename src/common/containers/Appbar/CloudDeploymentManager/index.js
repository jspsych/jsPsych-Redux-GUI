import { connect } from 'react-redux';
import * as backendActions from '../../../actions/backendActions';
import * as experimentActions from '../../../actions/experimentSettingActions';
import CloudDeploymentManager from '../../../components/Appbar/CloudDeploymentManager';

import { cloudDeploy as $cloudDeploy } from '../../../backend/deploy';
import { listBucketContents, Cloud_Bucket } from '../../../backend/s3';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';
import {
	checkBeforeOpen
} from '../../MediaManager';

const cloudDeploy = (dispatch, setDeloyingStatus) => {
	dispatch((dispatch, getState) => {
		setDeloyingStatus(true);
		$cloudDeploy({
			state: getState()
		}).then(() => {
			setDeloyingStatus(false);
			notifySuccessBySnackbar(dispatch, "Experiment Deployed !");
		}).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
		});
	})
}

const setOsfParentNode = (dispatch, value) => {
	dispatch(experimentActions.setOsfParentNodeAction(value ? value : null));
}

const checkIfOnline = (experimentId, callback) => {
	listBucketContents({
		bucket: Cloud_Bucket,
		Prefix: experimentId
	}).then(data => {
		callback(data.Contents.length > 0)
	})
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	return {
		experimentUrl: `experiments.jspsych.org/${experimentState.experimentId}`,
		osfParentNode: experimentState.osfParentNode,
		checkIfOnline: (callback) => { checkIfOnline(experimentState.experimentId, callback); },
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	cloudDeploy: (setDeloyingStatus) => { cloudDeploy(dispatch, setDeloyingStatus); },
	setOsfParentNode: (value) => { setOsfParentNode(dispatch, value); },
	checkBeforeOpen: (handleOpen) => { checkBeforeOpen(dispatch, handleOpen); }
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
