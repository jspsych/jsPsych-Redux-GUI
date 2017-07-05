import { connect } from 'react-redux';
import { isTrial } from '../../reducers/Experiment/utils';
import TrialForm from '../../components/TimelineNodeEditor/TrialForm';
import * as trialFormActions from '../../actions/trialFormActions';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(trialFormActions.onPluginTypeChange(newPluginVal));
}

const onToggleParam = (dispatch, e, newVal) => {
	dispatch(trialFormActions.onToggleValue(e, newVal));
}

const onChangeTextParam = (dispatch, e, newVal) => {
	dispatch(trialFormActions.onParamTextChange(e, newVal));
}

const onChangeChoicesParam = (dispatch, e, newVal) => {
	dispatch(trialFormActions.onChoicesChange(e, newVal));
}

const onChangeIntParam = (dispatch, e, newVal) => {
		dispatch(trialFormActions.onParamIntChange(e, newVal));
}

const onChangeFloatParam = (dispatch, e, newVal) => {
	dispatch(trialFormActions.onParamFloatChange(e, newVal));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	let trial = experimentState[experimentState.previewId];
	let choices;
	let joined; 

	if (!trial) {
		return {};
	} else {
	// if(trial.parameters.choices != undefined) {
	// 	choices = trial.parameters.choices;
	// 	console.log(choices);
	// 	for(let i=0; i<choices.length; i++) {
	// 		joined = choices.join('');
	// 		console.log(joined);
	// 	}
	// }
	
	return {
		id: trial.id,
		isTrial: isTrial(trial),
		parameters: trial.parameters,
		//choices: trial.parameters.joined,
		pluginType: trial.parameters.type,
	}
}
};

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal) },
	onToggle: (e, newVal) => { onToggleParam(dispatch, e, newVal) },
	onChangeText: (e, newVal) => { onChangeTextParam(dispatch, e, newVal) },
	onChangeChoices: (e, newVal) => { onChangeChoicesParam(dispatch, e, newVal) },
	onChangeInt: (e, newVal) => { onChangeIntParam(dispatch, e, newVal) },
	onChangeFloat: (e, newVal) => { onChangeFloatParam(dispatch, e, newVal) },
	// onChangeParamSelect: (key) => { onParamSelectChange(dispatch, key) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
