import { connect } from 'react-redux';
import TrialFormItem from '../../../components/TimelineNodeEditor/TrialForm/TrialFormItem';
import * as editorActions from '../../../actions/editorActions';
import { convertEmptyStringToNull } from '../../../utils';
import { ParameterMode, locateNestedParameterValue, createComplexDataObject } from '../../../reducers/Experiment/editor';
import { MediaPathTag } from '../../../backend/deploy';
import * as notify from '../../Notification';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(editorActions.onPluginTypeChange(newPluginVal));
}

const setFunc = (dispatch, key, code, funcOnly=false) => {
	dispatch(editorActions.setPluginParamAction(key, convertEmptyStringToNull(code), ParameterMode.USE_FUNC));
	if (funcOnly) {
		dispatch(editorActions.setPluginParamModeAction(key, ParameterMode.USE_FUNC, false));
	}
}

const setTimelineVariable = (dispatch, key, tv) => {
	dispatch(editorActions.setPluginParamAction(key, convertEmptyStringToNull(tv), ParameterMode.USE_TV));
}

const setParamMode = (dispatch, key, mode=ParameterMode.USE_FUNC) => {
	dispatch(editorActions.setPluginParamModeAction(key, mode));
}

const setText = (dispatch, key, value) => {
	dispatch(editorActions.setPluginParamAction(key, convertEmptyStringToNull(value)));
}

const setObject = (dispatch, key, obj) => {
	dispatch(editorActions.setPluginParamAction(key, obj));
}

const setKey = (dispatch, key, keyListStr, useEnum=false, isArray=false) => {
	if (useEnum || !isArray) {
		dispatch(editorActions.setPluginParamAction(key, (keyListStr) ? keyListStr : null));
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
					if (part.trim().length > 0 && !hist[part]) {
						val.push(part);
						hist[part] = true;
					}
					part = "";
					spec = false;
					break;
				case ' ':
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
		dispatch(editorActions.setPluginParamAction(key, val));
	}
}

const setToggle = (dispatch, key) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let flag = experimentState[experimentState.previewId].parameters[key].value;
		dispatch(editorActions.setPluginParamAction(key, !flag));
	});
}

const setNumber = (dispatch, key, value, isFloat) => {
	dispatch(editorActions.setPluginParamAction(key, convertEmptyStringToNull(value)));
}

const insertFile = (dispatch, key, s3files, multiSelect, selected, handleClose) => {
	let filePaths = s3files.Contents.filter((item, i) => (selected[i])).map((item) => (item.Key));
	let prefix = s3files.Prefix;

	if (filePaths.length === 0) {
		return;
	}
	if (!multiSelect) {
		if (filePaths.length > 1) {
			notify.notifyWarningByDialog(dispatch, "You can insert only one file here !");
			return;
		}
		filePaths = MediaPathTag(filePaths[0].replace(prefix, ''));
	} else {
		filePaths = filePaths.map((f) => (MediaPathTag(f.replace(prefix, ''))));
	}

	dispatch(editorActions.setPluginParamAction(key, filePaths));
	notify.notifySuccessBySnackbar(dispatch, "Media Inserted !");
	handleClose();
}

const autoFileInput = (dispatch, key, filename, prefix, filenames) => {
	if (!filename.trim()) return;
	if (filenames.indexOf(filename) === -1) {
		notify.notifyWarningByDialog(dispatch, `${filename} is not found !`);
		return;
	}
	dispatch(editorActions.setPluginParamAction(key, MediaPathTag(filename)));
}

const fileArrayInput = (dispatch, key, filelistStr, prefix, filenames) => {
	filelistStr = filelistStr.trim();
	if (!filelistStr) return;
	let i = 0;
	let fileList = [];
	let ignoreSpace = false;
	let part = "", c = "";
	while (i < filelistStr.length) {
		c = filelistStr[i++];
		switch(c) {
			case ',':
				ignoreSpace = true;
				if (part.length > 0) {
					if (filenames.indexOf(part) === -1) {
						notify.notifyWarningByDialog(dispatch, `${part} is not found !`);
						return;
					}
					fileList.push(part);
					part = "";
				}
				break;
			case ' ':
				if (!ignoreSpace) part += c;
				break;
			default:
				part += c;
		}
	}
	if (part.length > 0) {
		if (filenames.indexOf(part) === -1) {
			notify.notifyWarningByDialog(dispatch, `${part} is not found !`);
			return;
		}
		fileList.push(part);
	}
	dispatch(editorActions.setPluginParamAction(key, fileList.map((f) => (MediaPathTag(f)))));
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

	let filenames = [];
	let media = state.experimentState.media;
	if (media.Contents) {
		filenames = media.Contents.map((f) => (f.Key.replace(media.Prefix, '')));
	}

	return {
		id: node.id,
		parameters: node.parameters,
		s3files: media,
 		filenames: filenames,
	};
}

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal); },
	setText: (key, newVal) => { setText(dispatch, key, newVal); },
	setToggle: (key) => { setToggle(dispatch, key); },
	setNumber: (key, newVal, isFloat) => { setNumber(dispatch, key, newVal, isFloat); },
	setFunc: (key, code, funcOnly) => { setFunc(dispatch, key, code, funcOnly); },
	setParamMode: (key, mode) => { setParamMode(dispatch, key, mode); },
	setKey: (key, keyListStr, useEnum, isArray) => { setKey(dispatch, key, keyListStr, useEnum, isArray); },
	setTimelineVariable: (key, tv) => { setTimelineVariable(dispatch, key, tv); },
	insertFile: (key, s3files, multiSelect, selected, handleClose) => { insertFile(dispatch, key, s3files, multiSelect, selected, handleClose); },
	autoFileInput: (key, filename, prefix, filenames) => { autoFileInput(dispatch, key, filename, prefix, filenames); },
	fileArrayInput: (key, filelistStr, prefix, filenames) => { fileArrayInput(dispatch, key, filelistStr, prefix, filenames); },
	setObject: (key, obj) => { setObject(dispatch, key, obj); },
	populateComplex: (key, paramInfo) => { populateComplex(dispatch, key, paramInfo); },
	depopulateComplex: (key, index) => { depopulateComplex(dispatch, key, index); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialFormItem);
