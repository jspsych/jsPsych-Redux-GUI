import { connect } from 'react-redux';
import { isTrial } from '../../constants/utils';
import TrialForm from '../../components/TimelineNode/TrialForm';
import * as trialFormActions from '../../actions/trialFormActions';

const onChangePluginType = (dispatch, key) => {
	dispatch(trialFormActions.onPluginTypeChange(key));
}

const onToggleParam = (dispatch, newVal) => {
	dispatch(trialFormActions.onToggleValue(newVal));
}

const onChangeParam = (dispatch, newVal) => {
	dispatch(trialFormActions.onChangeText(newVal));
}

const onAddToParam = (dispatch, id, val) =>  {
	dispatch(trialFormActions.addingToParam(id, val));
}

const onChangeTextParam = (dispatch, e, newVal) => {
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
	onChange: (e, key, newPluginVal) => { onChangePluginType(dispatch, key) },
	onChangeText: (e, newVal) => { onChangeTextParam(dispatch, e, newVal)},
	addToParameters: (id, val) => { onAddToParam(dispatch, id, val) },
	onToggleParam: (e, newVal) => { onToggleParam(dispatch, newVal) },
	onChangeTextField: (newVal) => { onChangeParam(dispatch, newVal) },
	onChangeParamSelect: (key) => { onParamSelectChange(dispatch, key) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
