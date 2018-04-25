import { connect } from 'react-redux';
import deepEqual from 'deep-equal';
import * as experimentActions from '../../../actions/experimentSettingActions';
import DIYDeploymentManager from '../../../components/Appbar/DIYDeploymentManager';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';
import { pureSaveFlow } from '../index.js';
import { diyDeploy as $diyDeploy } from '../../../backend/deploy';

const diyDeploy = ({dispatch, progressHook, ...diyDeployInfo}) => {
	return dispatch((dispatch, getState) => {
		dispatch(experimentActions.setDIYDeployInfoAction({
			...diyDeployInfo
		}));

		return Promise.all([
			pureSaveFlow(dispatch, getState),
			$diyDeploy({state: getState(), progressHook: progressHook})
		]).catch((e) => {
			notifyErrorByDialog(dispatch, e.message)
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState,
		indexedNodeNames = experimentState.mainTimeline.map((id, i) => `${i+1}. ${experimentState[id].name}`);

	return {
		indexedNodeNames: indexedNodeNames,
		...experimentState.diyDeployInfo
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	diyDeploy: ({
		progressHook,
		...diyDeployInfo
	}) => diyDeploy({
		dispatch: dispatch,
		progressHook: progressHook,
		...diyDeployInfo
	}),

})

export default connect(mapStateToProps, mapDispatchToProps)(DIYDeploymentManager);