import * as actionTypes from '../../constants/ActionTypes';
import * as organizer from './organizer';
import * as jsPsychInit from './jsPsychInit';
import * as preview from './preview';
import * as editor from './editor';

export const initState = {
	// id of which is being previewed/editted
	previewId: null,
	// if want to play all
	previewAll: false,

	// the main timeline. array of ids
	// mainTimeline: [],

	// init properties
	jsPsychInit: jsPsychInit.initState,

	mainTimeline: ["TIMTELINE--1"],
	"TIMTELINE--1": {
		id: "TIMTELINE--1",
		type: "TIMELINE",
		name: "Timeline -1",
		parent: null,
		enabled: true,
		collapsed: false,
		childrenById: ["TRIAL--1", "TRIAL--2"],
		parameters: {
			timeline_variables: undefined,
			randomize_order: true,
			sample: undefined,
			conditional_function: undefined,
			loop_function: undefined,
		}
	},

	"TRIAL--1": {
		id: "TRIAL--1",
		type: "TRIAL",
		name: "Trial -1",
		parent: "TIMTELINE--1",
		enabled: true,
		parameters: { type: 'text', text: "Test -1", choices: ['A'], allow_mouse_click: false },
	},

	"TRIAL--2": {
		id: "TRIAL--2",
		type: "TRIAL",
		name: "Trial -2",
		parent: "TIMTELINE--1",
		enabled: true,
		parameters: { type: 'text', text: "Test -2", choices: ['D'], allow_mouse_click: false },
	},
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

		// prevew
		case actionTypes.PLAY_ALL:
			return preview.playAll(state, action);

		// editor starts
		case actionTypes.SET_NAME:
			return editor.setName(state, action);
		case actionTypes.CHANGE_PLUGIN_TYPE:
			return editor.changePlugin(state, action);
		case actionTypes.TOGGLE_PARAM_VALUE:
			return editor.changeToggleValue(state, action);
		case actionTypes.CHANGE_PARAM_TEXT:
			return editor.changeParamText(state, action);
		case actionTypes.CHANGE_PARAM_INT: 
			return editor.changeParamInt(state, action);
		case actionTypes.CHANGE_PARAM_FLOAT:
			return editor.changeParamFloat(state, action);
		case actionTypes.CHANGE_HEADER:
			return editor.changeHeader(state, action);
		case actionTypes.CHANGE_CELL:
			return editor.changeCell(state, action);
		case actionTypes.ADD_COLUMN:
			return editor.addColumn(state, action);
		case actionTypes.ADD_ROW:
			return editor.addRow(state, action);
		case actionTypes.CHANGE_SAMPLING: 
			return editor.changeSampling(state, action);
		case actionTypes.CHANGE_SIZE:
		 	return editor.changeSize(state, action);
		 case actionTypes.CHANGE_RANDOMIZE: 
		 	return editor.changeRandomize(state, action); 
		default:
			return state;
	}
}

