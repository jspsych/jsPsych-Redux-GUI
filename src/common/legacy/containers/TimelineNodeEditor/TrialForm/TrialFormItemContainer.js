import { connect } from 'react-redux';
import TrialFormItem from '../../../components/TimelineNodeEditor/TrialForm/TrialFormItem';
import * as editorActions from '../../../actions/editorActions';
import { ParameterMode, locateNestedParameterValue, createComplexDataObject } from '../../../reducers/Experiment/editor';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(editorActions.onPluginTypeChange(newPluginVal));
}

const setFunc = (dispatch, key, code, ifEval, language) => {
	dispatch(editorActions.setPluginParamAction(key, utils.toNull(code), ParameterMode.USE_FUNC, ifEval, language));
}

const setTimelineVariable = (dispatch, key, tv) => {
	dispatch(editorActions.setPluginParamAction(key, utils.toNull(tv), ParameterMode.USE_TV));
}

const setParamMode = (dispatch, key, mode=ParameterMode.USE_FUNC) => {
	dispatch(editorActions.setPluginParamModeAction(key, mode));
}

const setText = (dispatch, key, value) => {
	dispatch(editorActions.setPluginParamAction(key, utils.toNull(value)));
}

const setObject = (dispatch, key, obj) => {
	dispatch(editorActions.setPluginParamAction(key, obj));
}

const setKey = (dispatch, key, value) => {
	dispatch(editorActions.setPluginParamAction(key, utils.toNull(value)));
}

const setToggle = (dispatch, key, flag) => {
	dispatch(editorActions.setPluginParamAction(key, flag));
}

const setNumber = (dispatch, key, value, isFloat) => {
	dispatch(editorActions.setPluginParamAction(key, utils.toNull(value)));
}

const insertFile = (dispatch, key, value) => {
	dispatch(editorActions.setPluginParamAction(key, value));
}

const populateComplex = (dispatch, key, paramInfo) => {
	let paramPairs = Object.keys(paramInfo).map(k => ({key: k, value: paramInfo[k]}));

	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let node = experimentState[experimentState.previewId];
		let parameterValue = locateNestedParameterValue(node.parameters, key);
		let updatedParameterValue = parameterValue.value.slice();
		let update = {};
		for (let entry of paramPairs) {
			let defaultValue = entry.value.default;
			if (entry.value.array && !entry.value.default) {
				defaultValue = [];
			}
			update[entry.key] = createComplexDataObject(defaultValue);
		}
		updatedParameterValue.push(update);
		dispatch(editorActions.setPluginParamAction(key, updatedParameterValue));
	}) 
}

const depopulateComplex = (dispatch, key, index) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let node = experimentState[experimentState.previewId];
		let parameterValue = locateNestedParameterValue(node.parameters, key);
		let updatedParameterValue = parameterValue.value.slice();
		updatedParameterValue.splice(index, 1);
		dispatch(editorActions.setPluginParamAction(key, updatedParameterValue));
	}) 
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	let node = experimentState[experimentState.previewId];

	return {
		id: node.id,
		parameters: node.parameters,
	};
}

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal); },
	setText: (key, newVal) => { setText(dispatch, key, newVal); },
	setToggle: (key, flag) => { setToggle(dispatch, key, flag); },
	setNumber: (key, newVal, isFloat) => { setNumber(dispatch, key, newVal, isFloat); },
	setFunc: (key, code, ifEval, language) => { setFunc(dispatch, key, code, ifEval, language); },
	setParamMode: (key, mode) => { setParamMode(dispatch, key, mode); },
	setKey: (key, value) => { setKey(dispatch, key, value); },
	setTimelineVariable: (key, tv) => { setTimelineVariable(dispatch, key, tv); },
	insertFile: (key, value) => { insertFile(dispatch, key, value); },
	setObject: (key, obj) => { setObject(dispatch, key, obj); },
	populateComplex: (key, paramInfo) => { populateComplex(dispatch, key, paramInfo); },
	depopulateComplex: (key, index) => { depopulateComplex(dispatch, key, index); }
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialFormItem);
