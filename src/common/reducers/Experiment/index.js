import * as actionTypes from '../../constants/ActionTypes';
import * as organizer from './organizer';
import * as jsPsychInit from './jsPsychInit';
import * as editor from './editor';

export const initState = {
	// ********** experiment info
	experimentName: "Untitled Experiment",
	// key in db
	experimentId: null,

	// owner info
	/*{
		username: string,
		identityId: id
	}*/ 
	owner: null,

	// is private?
	private: true,

	// experiment details
	experimentDetails: {
		createdDate: null,
		lastEditDate: null,
		description: null,
	},

	// ********** experiment contents
	// id of which is being previewed/editted
	previewId: null,

	// id counts
	timelineCount: 0,
	trialCount: 0,

	// the main timeline. array of ids
	mainTimeline: [],

	// init properties
	jsPsychInit: jsPsychInit.initState,

	// media, should be s3 object, get by API call: listObjectsV2
	media: {},
}


const setExperimentName = (state, action) => {
	return Object.assign({}, state, {
		experimentName: action.name
	})
}

export default function experimentReducer(state=initState, action) {
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

		// Main
		case actionTypes.SET_EXPERIMENT_NAME:
			return setExperimentName(state, action);

		// editor starts
		case actionTypes.SET_NAME:
			return editor.setName(state, action);

		// Trial form
		case actionTypes.CHANGE_PLUGIN_TYPE:
			return editor.changePlugin(state, action);
		case actionTypes.SET_PLUGIN_PARAMTER:
			return editor.setPluginParam(state, action);
		case actionTypes.SET_PLUGIN_PARAMTER_MODE:
			return editor.setPluginParamMode(state, action);
		case actionTypes.UPDATE_MEDIA:
			return editor.updateMedia(state, action);

		// Timeline form
		case actionTypes.UPDATE_TIMELINE_VARIABLE_TABLE_ROW:
			return editor.updateTimelineVariableRow(state, action);
		case actionTypes.UPDATE_TIMELINE_VARIABLE_TABLE_CELL:
			return editor.updateTimelineVariableCell(state, action);
		case actionTypes.UPDATE_TIMELINE_VARIABLE_TABLE_HEADER:
			return editor.updateTimelineVariableName(state, action);
		case actionTypes.ADD_TIMELINE_VARIABLE_ROW:
			return editor.addTimelineVariableRow(state, action);
		case actionTypes.ADD_TIMELINE_VARIABLE_COLUMN:
			return editor.addTimelineVariableColumn(state, action);
		case actionTypes.DELETE_TIMELINE_VARIABLE_ROW:
			return editor.deleteTimelineVariableRow(state, action);
		case actionTypes.DELETE_TIMELINE_VARIABLE_COLUMN:
			return editor.deleteTimelineVariableColumn(state, action);
		case actionTypes.SET_SAMPLING_METHOD: 
			return editor.setSamplingMethod(state, action);
		case actionTypes.SET_SAMPLE_SIZE:
		 	return editor.setSampleSize(state, action);
		 case actionTypes.SET_RANDOMIZE: 
		 	return editor.setRandomize(state, action); 
		 case actionTypes.SET_REPETITIONS: 
		 	return editor.setRepetitions(state, action);
		 case actionTypes.SET_LOOP_FUNCTION:
		 	return editor.setLoopFunction(state, action);
		 case actionTypes.SET_CONDITION_FUNCTION:
		 	return editor.setConditionFunction(state, action);
		default:
			return state;
	}
}
