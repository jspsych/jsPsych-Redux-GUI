/**
 *@file This file describes the state template and root reducer for Experiment State.
*/
import * as organizer from './organizer';
import * as jsPsychInit from './jsPsychInit';
import * as editor from './editor';

export const getDefaultInitCloudDeployInfo = () => ({
	osfNode: null,
	osfAccess: null, // check userState.osfAccess[i]
	saveAfter: 0
})

export const getDefaultInitDiyDeployInfo = () => ({
	mode: enums.DIY_Deploy_Mode.disk,
	saveAfter: 0,
})

/**
 * @typeof {(string|number|object)} guiValue - A native javascript value. 
 * It is important that if the input value is empty string, it should be converted to null for AWS.DynamoDB storage purpose. 
*/

/**
 * Experiment State Template
 * @namespace ExperimentState
 * @property {guiValue} experimentName=null - Experiment Name
 * @property {guiValue} experimentId=null - Experiment's identifier in DynamoDB, should be generated as a UUID by uuid()
 * @property {Object} owner - Experiment Owner's information { username: string, identityId: id}
 * @property {guiValue} owner.username=null - Experiment Owner's username
 * @property {guiValue} owner.identityId=null - Experiment Owner's identityId (see docs for AWS.Cognito)
 * @property {boolean} private - True if the experiment is private
 * @property {Object} experimentDetails - Experiment Detail Information
 * @property {object} experimentDetails.createdDate - The date the experiment is created
 * @property {object} experimentDetails.lastEditDate - The date that the last edit happens to the experiment
 * @property {guiValue} experimentDetails.description=null - User defined experiment Description
 * @property {guiValue} previewId=null - The id of the node that is getting previewed
 * @property {Array.<string>} mainTimeline=[] - The main jsPsych timeline, should hold the id of nodes
 * @property {Object} jsPsychInit - The object that sets jsPsych (initialization/launch) options
 * @property {Object} media={} - An AWS.S3 object, get by API call: listObjects()
 * @property {Object} [timelineNode-{id}] - {@link TimelineNode}
 * @property {Object} [trialNode-{id}] - {@link TrialNode}
 * @description State template for Experiment state. 
 * ***NOTE THAT***: All empty string '' will be converted to null for storage (AWS.DynamoDB) purpose
*/
export const initState = core.getInitExperimentState();

/**@function(state, action)
 * @name setExperimentName
 * @description Set experiment's name 
 * @param {Object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {guiValue} action.name - The experiment's user defined name
 * @returns {object} Returns a completely new Experiment State object
*/
const setExperimentName = (state, action) => {
	return Object.assign({}, state, {
		experimentName: action.name
	})
}

const setCloudDeployInfo = (state, action) => {
	return Object.assign({}, state, {
		cloudDeployInfo: action.cloudDeployInfo
	})
}

const setDIYDeployInfo = (state, action) => {
	return Object.assign({}, state, {
		diyDeployInfo: action.diyDeployInfo
	})
}

/**@function(state, action)
* Always init view to preview the first timeline node
* @param {Object} action.experimentState
*
*/
const loadExperiment = (state, action) => {
	let { experimentState } = action;
	let mainTimeline = experimentState.mainTimeline;
	return Object.assign({}, experimentState, {
		previewId: mainTimeline.length > 0 ? mainTimeline[0] : null
	});
}


/**@function(state, action)
 * @name experimentReducer
 * @description The root reducer for the whole experiment state
 * @param {object} state - The Experiment State Object 
 * @param {object} action - Describes the action user invokes
 * @returns {object} Returns a completely new Experiment State object
*/
export default function experimentReducer(state=initState, action) {
	switch(action.type) {
		// organizer starts
		case actions.ActionTypes.ADD_TIMELINE:
			return organizer.addTimeline(state, action);
		case actions.ActionTypes.DELETE_TIMELINE:
			return organizer.deleteTimeline(state, action);
		case actions.ActionTypes.ADD_TRIAL:
			return organizer.addTrial(state, action);
		case actions.ActionTypes.DELETE_TRIAL:
			return organizer.deleteTrial(state, action);
		case actions.ActionTypes.INSERT_NODE_AFTER_TRIAL:
			return organizer.insertNodeAfterTrial(state, action);
		case actions.ActionTypes.DUPLICATE_TRIAL:
			return organizer.duplicateTrial(state, action);
		case actions.ActionTypes.DUPLICATE_TIMELINE:
			return organizer.duplicateTimeline(state, action);
		case actions.ActionTypes.MOVE_TO:
			return organizer.moveTo(state, action);
		case actions.ActionTypes.MOVE_INTO:
			return organizer.moveInto(state, action);
		case actions.ActionTypes.MOVE_BY_KEYBOARD:
			return organizer.moveByKeyboard(state, action);
		case actions.ActionTypes.ON_PREVIEW:
			return organizer.onPreview(state, action);
		case actions.ActionTypes.ON_TOGGLE:
			return organizer.onToggle(state, action);
		case actions.ActionTypes.SET_COLLAPSED:
			return organizer.setCollapsed(state, action);

		// jspsych.init starts
		case actions.ActionTypes.SET_JSPSYCH_INIT:
			return jsPsychInit.setJspyschInit(state, action);

		// Main
		case actions.ActionTypes.SET_EXPERIMENT_NAME:
			return setExperimentName(state, action);
		case actions.ActionTypes.LOAD_EXPERIMENT:
			return loadExperiment(state, action);

		// Deploy
		case actions.ActionTypes.SET_CLOUD_DEPLOY_INFO:
			return setCloudDeployInfo(state, action);
		case actions.ActionTypes.SET_DIY_DEPLOY_INFO:
			return setDIYDeployInfo(state, action);

		// editor starts
		case actions.ActionTypes.SET_NAME:
			return editor.setName(state, action);

		// Trial form
		case actions.ActionTypes.CHANGE_PLUGIN_TYPE:
			return editor.changePlugin(state, action);
		case actions.ActionTypes.SET_PLUGIN_PARAMTER:
			return editor.setPluginParam(state, action);
		case actions.ActionTypes.SET_PLUGIN_PARAMTER_MODE:
			return editor.setPluginParamMode(state, action);
		case actions.ActionTypes.UPDATE_MEDIA:
			return editor.updateMedia(state, action);

		// Timeline form
		case actions.ActionTypes.UPDATE_TIMELINE_VARIABLE_TABLE_ROW:
			return editor.updateTimelineVariableRow(state, action);
		case actions.ActionTypes.UPDATE_TIMELINE_VARIABLE_INPUT_TYPE:
			return editor.updateTimelineVariableInputType(state, action);
		case actions.ActionTypes.UPDATE_TIMELINE_VARIABLE_CELL:
			return editor.updateTimelineVariableCell(state, action);
		case actions.ActionTypes.UPDATE_TIMELINE_VARIABLE_TABLE_HEADER:
			return editor.updateTimelineVariableName(state, action);
		case actions.ActionTypes.MOVE_TIMELINE_VARIABLE_ROW_TO:
			return editor.moveRowTo(state, action);
		case actions.ActionTypes.ADD_TIMELINE_VARIABLE_ROW:
			return editor.addTimelineVariableRow(state, action);
		case actions.ActionTypes.ADD_TIMELINE_VARIABLE_COLUMN:
			return editor.addTimelineVariableColumn(state, action);
		case actions.ActionTypes.DELETE_TIMELINE_VARIABLE_ROW:
			return editor.deleteTimelineVariableRow(state, action);
		case actions.ActionTypes.DELETE_TIMELINE_VARIABLE_COLUMN:
			return editor.deleteTimelineVariableColumn(state, action);
		case actions.ActionTypes.SET_SAMPLING_METHOD: 
			return editor.setSamplingMethod(state, action);
		case actions.ActionTypes.SET_SAMPLE_SIZE:
		 	return editor.setSampleSize(state, action);
		 case actions.ActionTypes.SET_RANDOMIZE: 
		 	return editor.setRandomize(state, action); 
		 case actions.ActionTypes.SET_REPETITIONS: 
		 	return editor.setRepetitions(state, action);
		 case actions.ActionTypes.SET_LOOP_FUNCTION:
		 	return editor.setLoopFunction(state, action);
		 case actions.ActionTypes.SET_CONDITION_FUNCTION:
		 	return editor.setConditionFunction(state, action);
		 case actions.ActionTypes.SET_TIMELINE_VARIABLE:
		 	return editor.setTimelineVariable(state, action);
		default:
			return state;
	}
}