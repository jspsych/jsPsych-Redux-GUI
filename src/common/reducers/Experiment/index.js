/**
 *@file This file describes the state template and root reducer for Experiment State.
 *@author Junyan Qi <juqi@vassar.edu>
*/
import * as actionTypes from '../../constants/ActionTypes';
import * as organizer from './organizer';
import * as jsPsychInit from './jsPsychInit';
import * as editor from './editor';

/**
 *@typeof {(string|object)} guiStringValue - When the input value is empty string, it should be converted to null for AWS.DynamoDB storage purpose. 
*/

/**
 * Experiment State Template
 * @namespace ExperimentState
 * @property {guiStringValue} experimentName=null - Experiment Name
 * @property {guiStringValue} experimentId=null - Experiment's identifier in DynamoDB, should be generated as a UUID by uuid()
 * @property {Object} owner - Experiment Owner's information { username: string, identityId: id}
 * @property {guiStringValue} owner.username=null - Experiment Owner's username
 * @property {guiStringValue} owner.identityId=null - Experiment Owner's identityId (see docs for AWS.Cognito)
 * @property {boolean} private - True if the experiment is private
 * @property {Object} experimentDetails - Experiment Detail Information
 * @property {object} experimentDetails.createdDate - The date the experiment is created
 * @property {object} experimentDetails.lastEditDate - The date that the last edit happens to the experiment
 * @property {guiStringValue} experimentDetails.description=null - User defined experiment Description
 * @property {guiStringValue} previewId=null - The id of the node that is getting previewed
 * @property {number} timelineCount=0 - The inner tracker for timeline node
 * @property {number} trialCount=0 - The inner tracker for trial node
 * @property {Array.<string>} mainTimeline=[] - The main jsPsych timeline, should hold the id of nodes
 * @property {Object} jsPsychInit - The object that sets jsPsych (initialization/launch) options
 * @property {Object} media={} - An AWS.S3 object, get by API call: listObjects()
 * @property {Object} [timelineNode-{id}] - {@link TimelineNode}
 * @property {Object} [trialNode-{id}] - {@link TrialNode}
 * @description State template for Experiment state. 
 * ***NOTE THAT***: All empty string '' will be converted to null for storage (AWS.DynamoDB) purpose
*/
export const initState = {
	experimentName: "Untitled Experiment",
	experimentId: null,

	owner: null,
 	private: true,

	experimentDetails: {
		createdDate: null,
		lastEditDate: null,
		description: null,
	},

	/********** experiment contents **********/
	previewId: null,
	timelineCount: 0,
	trialCount: 0,
	mainTimeline: [],
	jsPsychInit: jsPsychInit.initState,

	media: {},
}

/**@function(state, action)
 * @name setExperimentName
 * @description Set experiment's name 
 * @param {Object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {string} action.name - The experiment's user defined name
 * @returns {Object} Returns a completely new Experiment State object
*/
const setExperimentName = (state, action) => {
	return Object.assign({}, state, {
		experimentName: action.name
	})
}

/**@function(state, action)
 * @name experimentReducer
 * @description The root reducer for the whole experiment state
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @returns {Object} Returns a completely new Experiment State object
*/
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
		case actionTypes.UPDATE_TIMELINE_VARIABLE_INPUT_TYPE:
			return editor.updateTimelineVariableInputType(state, action);
		case actionTypes.UPDATE_TIMELINE_VARIABLE_CELL:
			return editor.updateTimelineVariableCell(state, action);
		case actionTypes.UPDATE_TIMELINE_VARIABLE_TABLE_HEADER:
			return editor.updateTimelineVariableName(state, action);
		case actionTypes.MOVE_TIMELINE_VARIABLE_ROW_TO:
			return editor.moveRowTo(state, action);
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
		 case actionTypes.SET_TIMELINE_VARIABLE:
		 	return editor.setTimelineVariable(state, action);
		default:
			return state;
	}
}
