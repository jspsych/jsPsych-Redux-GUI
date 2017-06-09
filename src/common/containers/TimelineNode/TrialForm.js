import { connect } from 'react-redux';
import { isTrial } from '../../constants/utils';
import TrialForm from '../../components/TimelineNode/TrialForm';
import * as trialFormActions from '../../actions/trialFormActions';

const onChangePluginType = (dispatch, key) => {
	dispatch(trialFormActions.onPluginTypeChange(key));
}

const mapStateToProps = (state, ownProps) => {
	console.log("In maps");
	let timelineNodeState = state.timelineNodeState;

	let trial = timelineNodeState[timelineNodeState.previewId];
	return {
		isTrial: isTrial(trial);
		id: ownProps.id === timelineNodeState.previewId,
		pluginType: trial.pluginType,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChange: (e, key, newPluginVal) => { onChangePluginType(dispatch, key) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
