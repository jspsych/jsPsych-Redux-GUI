import { connect } from 'react-redux';
import TrialForm from '../../../components/TimelineNodeEditor/TrialForm';
import * as trialFormActions from '../../../actions/trialFormActions';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(trialFormActions.onPluginTypeChange(newPluginVal));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	if (!experimentState.previewId) return {

	};
	let trial = experimentState[experimentState.previewId];
	return {
		pluginType: trial.parameters.type,
	};
}

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
