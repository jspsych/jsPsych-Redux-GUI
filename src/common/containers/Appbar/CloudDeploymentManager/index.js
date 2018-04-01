import { connect } from 'react-redux';
import * as backendActions from '../../../actions/backendActions';
import * as experimentActions from '../../../actions/experimentSettingActions';
import CloudDeploymentManager from '../../../components/Appbar/CloudDeploymentManager';

import { cloudDeploy as $cloudDeploy } from '../../../backend/deploy';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';

const cloudDeploy = (dispatch, startDeployCb, finishDeployCb) => {
	dispatch((dispatch, getState) => {
		startDeployCb();
		$cloudDeploy({
			state: getState()
		}).then(() => {
			finishDeployCb();
			notifySuccessBySnackbar(dispatch, "Experiment Deployed !")
		}).catch(e => {
			notifyErrorByDialog(dispatch, e.message);
		});
	})
}

const setOsfParentNode = (dispatch, value) => {
	dispatch(experimentActions.setOsfParentNodeAction(value ? value : null));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	return {
		experimentUrl: `experiments.jspsych.org/${experimentState.experimentId}`,
		osfParentNode: experimentState.osfParentNode
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	cloudDeploy: (startDeployCb, finishDeployCb) => { cloudDeploy(dispatch, startDeployCb, finishDeployCb); },
	setOsfParentNode: (value) => { setOsfParentNode(dispatch, value); }
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
