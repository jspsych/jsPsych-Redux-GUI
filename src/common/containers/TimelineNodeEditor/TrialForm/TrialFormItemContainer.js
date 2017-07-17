import { connect } from 'react-redux';
import { isTrial } from '../../../reducers/Experiment/utils';
import TrialFormItem from '../../../components/TimelineNodeEditor/TrialForm/TrialFormItem';
import * as trialFormActions from '../../../actions/trialFormActions';
import { convertEmptyStringToNull } from '../../../utils';
import { ParameterMode } from '../../../reducers/Experiment/editor';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(trialFormActions.onPluginTypeChange(newPluginVal));
}

const setFunc = (dispatch, key, code) => {
	dispatch(trialFormActions.setPluginParamAction(key, convertEmptyStringToNull(code), ParameterMode.USE_FUNC));
}

const setTimelineVariable = (dispatch, key, tv) => {
	dispatch(trialFormActions.setPluginParamAction(key, convertEmptyStringToNull(tv), ParameterMode.USE_TV));
}

const setParamMode = (dispatch, key, mode=ParameterMode.USE_FUNC) => {
	dispatch(trialFormActions.setPluginParamModeAction(key, mode));
}

const setText = (dispatch, key, value) => {
	dispatch(trialFormActions.setPluginParamAction(key, convertEmptyStringToNull(value)));
}

const setKey = (dispatch, key, keyListStr, useEnum=false, isArray=false) => {
	if (useEnum || !isArray) {
		dispatch(trialFormActions.setPluginParamAction(key, (keyListStr) ? keyListStr : null));
	} else {
		let val = [];
		let hist = {};
		let i = 0, len = keyListStr.length, part = "", spec = false;
		while (i < len) {
			let c = keyListStr[i++];
			switch(c) {
				case '{':
					spec = true;
					break;
				case '}':
					if (part.trim().length > 0) val.push(part);
					part = "";
					spec = false;
					break;
				default:
					if (spec) part += c;
					else {
						if (!hist[c]) {
							val.push(c);
							hist[c] = true;
						}
					}
			}
		}
		dispatch(trialFormActions.setPluginParamAction(key, val));
	}
}

const setToggle = (dispatch, key) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let flag = experimentState[experimentState.previewId].parameters[key].value;
		dispatch(trialFormActions.setPluginParamAction(key, !flag));
	});
}

const setNumber = (dispatch, key, value, isFloat) => {
	if (isNaN(value)) {
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
	setParamMode: (key, mode) => { setParamMode(dispatch, key, mode); },
	setKey: (key, keyListStr, useEnum, isArray) => { setKey(dispatch, key, keyListStr, useEnum, isArray); },
	setTimelineVariable: (key, tv) => { setTimelineVariable(dispatch, key, tv); }
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialFormItem);
