import * as actionTypes from '../../constants/ActionTypes';
import * as organizer from './organizer';
import * as jsPsychInit from './jsPsychInit';
import * as editor from './editor';

export const initState = {
	// id of which is being previewed/editted
	previewId: null,

	// the main timeline. array of ids
	mainTimeline: [],

	// init properties
	jsPsychInit: jsPsychInit.initState
}


export default function(state=initState, action) {
	// console.log(action)

	switch(action.type) {
		// organizer starts
		case actionTypes.ADD_TIMELINE:
			return organizer.addTimeline(state, action);
		case actionTypes.DELETE_TIMELINE:
			return organizer.deleteTimeline(state, action);
		case actionTypes.ADD_TRIAL:
			return organizer.addTrial(state, action);
		case actionTypes.DELETE_TRIAL:
			return organizer.deleteTrial(state, action);
		case actionTypes.INSERT_NODE_AFTER_TRIAL:
			return organizer.insertNodeAfterTrial(state, action);
		case actionTypes.DUPLICATE_TRIAL:
			return organizer.duplicateTrial(state, action);
		case actionTypes.DUPLICATE_TIMELINE:
			return organizer.duplicateTimeline(state, action);
		case actionTypes.MOVE_TO:
			return organizer.moveTo(state, action);
		case actionTypes.MOVE_INTO:
			return organizer.moveInto(state, action);
		case actionTypes.MOVE_BY_KEYBOARD:
			return organizer.moveByKeyboard(state, action);
		case actionTypes.ON_PREVIEW:
			return organizer.onPreview(state, action);
		case actionTypes.ON_TOGGLE:
			return organizer.onToggle(state, action);
		case actionTypes.SET_TOGGLE_COLLECTIVELY:
			return organizer.setToggleCollectively(state, action);
		case actionTypes.SET_COLLAPSED:
			return organizer.setCollapsed(state, action);

		// jspsych.init starts
		case actionTypes.SET_JSPSYCH_INIT:
			return jsPsychInit.setJspyschInit(state, action);

		// editor starts
		case actionTypes.SET_NAME:
			return editor.setName(state, action);
		// case actionTypes.CHANGE_PLUGIN_TYPE:
		// 	return changePlugin(state, action);
		// case actionTypes.TOGGLE_PARAM_VALUE:
		// 	return changeToggleValue(state, action);
		// case actionTypes.CHANGE_PARAM_TEXT:
		// 	return changeParamText(state, action);
		// case actionTypes.CHANGE_PARAM_INT: 
		// 	return changeParamInt(state, action);
		// case actionTypes.CHANGE_PARAM_FLOAT:
		// 	return changeParamFloat(state, action);
		// case actionTypes.CHANGE_HEADER:
		// 	return changeHeader(state, action);

		default:
			return state;
	}
}