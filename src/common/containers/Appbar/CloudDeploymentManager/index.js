import { connect } from 'react-redux';
import * as backendActions from '../../../actions/backendActions';

import CloudDeploymentManager from '../../../components/Appbar/CloudDeploymentManager';

import { cloudDeploy as $cloudDeploy } from '../../../backend/deploy';

const cloudDeploy = (dispatch) => {
	dispatch((dispatch, getState) => {
		$cloudDeploy(getState());
	})
}

const mapStateToProps = (state, ownProps) => {

	return {
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	cloudDeploy: () => { cloudDeploy(dispatch); }
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
