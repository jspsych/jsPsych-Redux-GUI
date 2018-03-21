import { connect } from 'react-redux';
import * as backendActions from '../../../actions/backendActions';

import CloudDeploymentManager from '../../../components/Appbar/CloudDeploymentManager';

const mapStateToProps = (state, ownProps) => {

	return {
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CloudDeploymentManager);
