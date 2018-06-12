import { connect } from 'react-redux';
import deepEqual from 'deep-equal';
import * as experimentActions from '../../../actions/experimentSettingActions';
import DIYDeploymentManager from '../../../components/Appbar/DIYDeploymentManager';
import {
	notifyErrorByDialog,
	notifySuccessBySnackbar,
	notifyWarningBySnackbar
} from '../../Notification';
import { diyDeploy as $diyDeploy } from '../../../backend/deploy';

const diyDeploy = ({dispatch, progressHook, ...diyDeployInfo}) => {
	return dispatch((dispatch, getState) => {
		dispatch(experimentActions.setDIYDeployInfoAction({
			...diyDeployInfo
		}));

		return utils.commonFlows.isUserSignedIn().then((signedIn) => {
			if (signedIn) {
				let experimentState = getState().experimentState,
					Prefix = [experimentState.ownerId, experimentState.experimentId].join(myaws.S3.Delimiter);

				return utils.commonFlows.saveCurrentExperiment({
					dispatch,
					displayNotification: false
				}).then(() => {
					return myaws.S3.listBucketContents({ Prefix }).then((media) => {
						$diyDeploy({
							state: getState(),
							progressHook: progressHook,
							media
						});
					});
				});
			} else {
				$diyDeploy({
					state: getState(),
					progressHook: progressHook,
				});
			}
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