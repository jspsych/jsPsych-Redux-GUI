import { connect } from 'react-redux';
import { isTrial } from '../../reducers/Experiment/utils';
import TrialForm from '../../components/TimelineNodeEditor/TrialForm';
import * as trialFormActions from '../../actions/trialFormActions';
import { convertEmptyStringToNull } from '../../utils';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(trialFormActions.onPluginTypeChange(newPluginVal));
}

const setText = (dispatch, key, value) => {
	dispatch(trialFormActions.setPluginParamAction(key, convertEmptyStringToNull(value)));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	if (!experimentState.previewId) return {};

	let trial = experimentState[experimentState.previewId];
	let choices;
	let joined; 

	return {
		id: trial.id,
		isTrial: isTrial(trial),
		parameters: trial.parameters,
		choices: joined,
		pluginType: trial.parameters.type,
	};
}

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal) },
	setText: (key, newVal) => { setText(dispatch, key, newVal) },
	// onChangeParamSelect: (key) => { onParamSelectChange(dispatch, key) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
