import { connect } from 'react-redux';
import { isTrial } from '../../constants/utils';
import TrialForm from '../../components/TimelineNode/TrialForm';
import * as trialFormActions from '../../actions/trialFormActions';

const onChangePluginType = (dispatch, key) => {
	dispatch(trialFormActions.onPluginTypeChange(key));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let trial = timelineNodeState[timelineNodeState.previewId];
	if(trial != null) {
	return {
		isTrial: isTrial(trial),
		parameters: trial.parameters,
		pluginType: trial.pluginType,
		}
	} else {
		return {
		}
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChange: (e, key, newPluginVal) => { onChangePluginType(dispatch, key) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
