import { connect } from 'react-redux';
import deepEqual from 'deep-equal';
import * as experimentSettingActions from '../../../actions/experimentSettingActions';
import DIYDeploymentManager from '../../../components/Appbar/DIYDeploymentManager';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';
import { pureSaveFlow } from '../index.js';
import { diyDeploy as $diyDeploy } from '../../../backend/deploy';

const diyDeploy = (dispatch, progressHook) => {
	return dispatch((dispatch, getState) => {
		return $diyDeploy({state: getState(), progressHook: progressHook}).catch((e) => {
			notifyErrorByDialog(dispatch, e.message)
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	diyDeploy: (progressHook) => diyDeploy(dispatch, progressHook),

})

export default connect(mapStateToProps, mapDispatchToProps)(DIYDeploymentManager);