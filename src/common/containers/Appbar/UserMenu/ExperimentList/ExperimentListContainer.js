import { connect } from 'react-redux';
import ExperimentList from '../../../../components/Appbar/UserMenu/ExperimentList';

import { pureCloudDelete as cloudDelete } from '../../CloudDeploymentManager';


const pullExperiment = ({dispatch, targetExperimentId, saveFirst=false}) => {
	let $save = () => {
		if (saveFirst) {
			return utils.commonFlows.saveCurrentExperiment({dispatch});
		} else {
			return Promise.resolve();
		}
	}
	return $save().then(() => {
		return myaws.DynamoDB.getExperimentById(targetExperimentId).then((data) => {
			utils.commonFlows.loadExperimentAction({
				dispatch,
				experimentState: data.Item.fetch
			});
			return Promise.resolve();
		});
	});
}

const deleteExperiment = ({dispatch, targetExperimentState}) => {
	let { experimentId, ownerId } = targetExperimentState;
	return myaws.S3.listBucketContents({
		Prefix: `${ownerId}/${sourceExperimentId}/`
	}).then((data) => {
		let filepaths = [];
		if (data && data.Contents) {
			filepaths = data.Contents.map((f) => (f.Key));
		}
		return Promise.all([
			myaws.S3.deleteFiles(filepaths),
			myaws.DynamoDB.deleteExperiment(experimentId)
		]).then(() => {
			return cloudDelete(experimentId);
		}).then(() => {
			utils.notifications.notifySuccessBySnackbar({
				dispatch,
				message: "Deleted !"
			});
		}).catch((err) => {
			console.log(err);
			utils.notifications.notifyErrorByDialog({
				dispatch,
				message: err.message
			});
			return Promise.reject(err);
		});
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
		userId: state.userState.userId,
		currentExperimentId: state.experimentState.experimentId,
		currentExperimentState: state.experimentState
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	pullExperiment: ({...args}) => pullExperiment({dispatch, ...args}),
	deleteExperiment: ({...args}) => deleteExperiment({dispatch, ...args}),
	dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentList);
