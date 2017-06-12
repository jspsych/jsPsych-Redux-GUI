import { connect } from 'react-redux';
import { isTrial } from '../../constants/utils';
import TrialForm from '../../components/TimelineNode/TrialForm';
import * as trialFormActions from '../../actions/trialFormActions';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(trialFormActions.onPluginTypeChange(newPluginVal));
}

const onToggleParam = (dispatch, e, newVal) => {
	console.log(e);
	console.log(newVal);
	dispatch(trialFormActions.onToggleValue(e, newVal));
}

const onChangeTextParam = (dispatch, e, newVal) => {
	console.log('change text param '+e+' '+newVal);
	dispatch(trialFormActions.onParamTextChange(e, newVal));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let trial = timelineNodeState[timelineNodeState.previewId];
	console.log(trial);
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

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal) },
	onChangeText: (e, newVal) => { onChangeTextParam(dispatch, e, newVal)},
	onToggle: (e, newVal) => { onToggleParam(dispatch, e, newVal) },
	onChangeParamSelect: (key) => { onParamSelectChange(dispatch, key) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
