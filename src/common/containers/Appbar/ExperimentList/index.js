import { connect } from 'react-redux';
import * as backendActions from '../../../actions/backendActions';

import ExperimentList from '../../../components/Appbar/ExperimentList';
import {
	fetchExperimentById,
	pushUserData,
	deleteExperiment as $deleteExperiment,
	pushExperimentData
} from '../../../backend/dynamoDB';
import { getUUID } from '../../../utils';

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

/*
Delete experiment from database
successful: 
	update local state
	update user data remotely

*/
const deleteExperiment = (dispatch, id) => {
	dispatch((dispatch, getState) => {
		$deleteExperiment(id).then((data) => {
			dispatch(backendActions.deleteExperimentAction(id));
			pushUserData(getState().userState);
		});
	});
}

/*
Fetch experiment
Copy it and give new id
Process state
Update user data remotely
Push experiment
*/
const duplicateExperiment = (dispatch, id) => {
	dispatch((dispatch, getState) => {
		fetchExperimentById(id).then((data) => {
			let experimentState = Object.assign({}, data.Item.fetch, {
				experimentId: getUUID()
			});
			dispatch(backendActions.duplicateExperimentAction({
				id: experimentState.experimentId,
				name: experimentState.experimentName
			}));
			pushUserData(getState().userState);
			pushExperimentData(experimentState);
		})
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
		experiments: state.userState.experiments
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	pullExperiment: (selected) => { pullExperiment(dispatch, selected); },
	deleteExperiment: (id) => { deleteExperiment(dispatch, id); },
	duplicateExperiment: (id) => { duplicateExperiment(dispatch, id); },
})

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentList);
