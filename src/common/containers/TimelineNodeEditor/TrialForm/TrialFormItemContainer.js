import { connect } from 'react-redux';
import { isTrial } from '../../../reducers/Experiment/utils';
import TrialFormItem from '../../../components/TimelineNodeEditor/TrialForm/TrialFormItem';
import * as trialFormActions from '../../../actions/trialFormActions';
import { convertEmptyStringToNull } from '../../../utils';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(trialFormActions.onPluginTypeChange(newPluginVal));
}

const setFunc = (dispatch, key, code) => {
	dispatch(trialFormActions.setPluginParamAction(key, convertEmptyStringToNull(code), true));
}

const setParamMode = (dispatch, key) => {
	dispatch(trialFormActions.setPluginParamModeAction(key));
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
		return;
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
	if (!experimentState.previewId) return {

	};
	let trial = experimentState[experimentState.previewId];
	return {
		parameters: trial.parameters,
	};
}

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal); },
	setText: (key, newVal) => { setText(dispatch, key, newVal); },
	setToggle: (key) => { setToggle(dispatch, key); },
	setNumber: (key, newVal, isFloat) => { setNumber(dispatch, key, newVal, isFloat); },
	setFunc: (key, code) => { setFunc(dispatch, key, code); },
	setParamMode: (key) => { setParamMode(dispatch, key); }
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialFormItem);
