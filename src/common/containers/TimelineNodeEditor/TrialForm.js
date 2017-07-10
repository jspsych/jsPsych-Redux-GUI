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

const setToggle = (dispatch, key) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let flag = experimentState[experimentState.previewId].parameters[key]
		dispatch(trialFormActions.setPluginParamAction(key, !flag));
	});
}

const setNumber = (dispatch, key, value, isFloat) => {
	if (!isNaN(value)) {

	}
	if (isFloat) {
		value = parseFloat(value);
	} else {
		value = parseInt(value);
	}
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
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal); },
	setText: (key, newVal) => { setText(dispatch, key, newVal); },
	setToggle: (key) => { setToggle(dispatch, key); },
	setNumber: (key, newVal, isFloat) => { setNumber(dispatch, key, newVal, isFloat); }
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
