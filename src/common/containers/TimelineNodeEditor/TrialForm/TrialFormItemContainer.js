import { connect } from 'react-redux';
import TrialFormItem from '../../../components/TimelineNodeEditor/TrialForm/TrialFormItem';
import * as trialFormActions from '../../../actions/trialFormActions';
import { convertEmptyStringToNull } from '../../../utils';
import { ParameterMode } from '../../../reducers/Experiment/editor';
import { MediaPathTag } from '../../../backend/deploy';
import * as notify from '../../Notification';

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

const setObject = (dispatch, key, obj) => {
	dispatch(trialFormActions.setPluginParamAction(key, obj));
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
	dispatch(trialFormActions.setPluginParamAction(key, convertEmptyStringToNull(value)));
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

	dispatch(trialFormActions.setPluginParamAction(key, filePaths));
	notify.notifySuccessBySnackbar(dispatch, "Media Inserted !");
	handleClose();
}

const autoFileInput = (dispatch, key, filename, prefix, filenames) => {
	if (!filename.trim()) return;
	if (filenames.indexOf(filename) === -1) {
		notify.notifyWarningByDialog(dispatch, `${filename} is not found !`);
		return;
	}
	dispatch(trialFormActions.setPluginParamAction(key, MediaPathTag(filename)));
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
	dispatch(trialFormActions.setPluginParamAction(key, fileList.map((f) => (MediaPathTag(f)))));
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
	setFunc: (key, code) => { setFunc(dispatch, key, code); },
	setParamMode: (key, mode) => { setParamMode(dispatch, key, mode); },
	setKey: (key, keyListStr, useEnum, isArray) => { setKey(dispatch, key, keyListStr, useEnum, isArray); },
	setTimelineVariable: (key, tv) => { setTimelineVariable(dispatch, key, tv); },
	insertFile: (key, s3files, multiSelect, selected, handleClose) => { insertFile(dispatch, key, s3files, multiSelect, selected, handleClose); },
	autoFileInput: (key, filename, prefix, filenames) => { autoFileInput(dispatch, key, filename, prefix, filenames); },
	fileArrayInput: (key, filelistStr, prefix, filenames) => { fileArrayInput(dispatch, key, filelistStr, prefix, filenames); },
	setObject: (key, obj) => { setObject(dispatch, key, obj); }
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialFormItem);
