import { connect } from 'react-redux';
import * as backendActions from '../../../actions/backendActions';

import ExperimentList from '../../../components/Appbar/ExperimentList';
import { fetchExperimentById, pushUserData } from '../../../backend/dynamoDB';

/*
Fetch experiment data
Sync and Process
Post new user data
*/
const pullExperiment = (dispatch, selected) => {
	if (!selected) return;
	dispatch((dispatch, getState) => {
		if (getState().experimentState.experimentId === selected) return;
		fetchExperimentById(selected).then((data) => {
			dispatch(backendActions.pullExperimentAction(data));
		}).then(() => {
			pushUserData(getState().userState);
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
		experiments: state.userState.experiments
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	pullExperiment: (selected) => { pullExperiment(dispatch, selected); },
})

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentList);
