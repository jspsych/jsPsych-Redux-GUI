
export const ActionTypes = {
	// organizer
	ADD_TIMELINE: "ADD_TIMELINE",
	DELETE_TIMELINE: "DELETE_TIMELINE",
	ADD_TRIAL: "ADD_TRIAL",
	DELETE_TRIAL: "DELETE_TRIAL",
	MOVE_TO: "MOVE_TO",
	MOVE_INTO: "MOVE_INTO",
	MOVE_BY_KEYBOARD: "MOVE_BY_KEYBOARD",
	ON_PREVIEW: "ON_PREVIEW",
	ON_TOGGLE: "ON_TOGGLE",
	SET_COLLAPSED: "SET_COLLAPSED",
	INSERT_NODE_AFTER_TRIAL: "INSERT_NODE_AFTER_TRIAL",
	DUPLICATE_TIMELINE: "DUPLICATE_TIMELINE",
	DUPLICATE_TRIAL: "DUPLICATE_TRIAL",
	SET_NAME: "SET_NAME",

	// jsPsych init editor
	SET_JSPSYCH_INIT: "SET_JSPSYCH_INIT",

	// preview
	PLAY_ALL: "PLAY_ALL",

	// main
	SET_EXPERIMENT_NAME: "SET_EXPERIMENT_NAME",
	LOAD_EXPERIMENT: "LOAD_EXPERIMENT",
	LOAD_USER: "LOAD_USER",

	// editor
	SET_PLUGIN_PARAMTER: "SET_PLUGIN_PARAMTER",
	SET_PLUGIN_PARAMTER_MODE: "SET_PLUGIN_PARAMTER_MODE",
	UPDATE_MEDIA: "UPDATE_MEDIA",

	// editor - TrialForm Actions
	CHANGE_PLUGIN_TYPE: "CHANGE_PLUGIN_TYPE",

	// editor - TimelineForm Actions
	UPDATE_TIMELINE_VARIABLE_INPUT_TYPE: "UPDATE_TIMELINE_VARIABLE_INPUT_TYPE",
	UPDATE_TIMELINE_VARIABLE_CELL: "UPDATE_TIMELINE_VARIABLE_CELL",
	UPDATE_TIMELINE_VARIABLE_TABLE_HEADER: "UPDATE_TIMELINE_VARIABLE_TABLE_HEADER",
	ADD_TIMELINE_VARIABLE_ROW: "ADD_TIMELINE_VARIABLE_ROW",
	ADD_TIMELINE_VARIABLE_COLUMN: "ADD_TIMELINE_VARIABLE_COLUMN",
	DELETE_TIMELINE_VARIABLE_ROW: "DELETE_TIMELINE_VARIABLE_ROW",
	DELETE_TIMELINE_VARIABLE_COLUMN: "DELETE_TIMELINE_VARIABLE_COLUMN",
	MOVE_TIMELINE_VARIABLE_ROW_TO: "MOVE_TIMELINE_VARIABLE_ROW_TO",
	SET_SAMPLING_METHOD: "SET_SAMPLING_METHOD",
	SET_SAMPLE_SIZE: "SET_SAMPLE_SIZE",
	SET_RANDOMIZE: "SET_RANDOMIZE",
	SET_REPETITIONS: "SET_REPETITIONS",
	SET_LOOP_FUNCTION: "SET_LOOP_FUNCTION",
	SET_CONDITION_FUNCTION: "SET_CONDITION_FUNCTION",
	SET_TIMELINE_VARIABLE: "SET_TIMELINE_VARIABLE",

	// Cloud
	SET_OSF_ACCESS: "SET_OSF_ACCESS",
	SET_CLOUD_DEPLOY_INFO: "SET_CLOUD_DEPLOY_INFO",
	SET_DIY_DEPLOY_INFO: "SET_DIY_DEPLOY_INFO",

	/************ GUI States ************/

	// Notifcations Window
	NOTIFY_WARNING_DIALOG: "NOTIFY_WARNING_DIALOG",
	NOTIFY_WARNING_SNACKBAR: "NOTIFY_WARNING_SNACKBAR",
	NOTIFY_SUCCESS_DIALOG: "NOTIFY_SUCCESS_DIALOG",
	NOTIFY_SUCCESS_SNACKBAR: "NOTIFY_SUCCESS_SNACKBAR",
	NOTIFY_ERROR_DIALOG: "NOTIFY_ERROR_DIALOG",
	NOTIFY_ERROR_SNACKBAR: "NOTIFY_ERROR_SNACKBAR",
	NOTIFY_DIALOG_CLOSE: "NOTIFY_DIALOG_CLOSE",
	NOTIFY_SNACKBAR_CLOSE: "NOTIFY_SNACKBAR_CLOSE",
	POP_UP_CONFIRM: "POP_UP_CONFIRM",

	// Authentications Window
	SET_AUTH_WINDOW: "SET_AUTH_WINDOW",
}


export const actionCreator = ({type, ...args}) => ({
	type: type,
	...args
})


// organizer
export const ADD_TIMELINE = "ADD_TIMELINE";
export const DELETE_TIMELINE = "DELETE_TIMELINE";
export const ADD_TRIAL = "ADD_TRIAL";
export const DELETE_TRIAL = "DELETE_TRIAL";
export const MOVE_TO = "MOVE_TO";
export const MOVE_INTO = "MOVE_INTO";
export const MOVE_BY_KEYBOARD = "MOVE_BY_KEYBOARD";
export const ON_PREVIEW = "ON_PREVIEW";
export const ON_TOGGLE = "ON_TOGGLE";
export const SET_COLLAPSED = "SET_COLLAPSED";
export const INSERT_NODE_AFTER_TRIAL = "INSERT_NODE_AFTER_TRIAL";
export const DUPLICATE_TIMELINE = "DUPLICATE_TIMELINE";
export const DUPLICATE_TRIAL = "DUPLICATE_TRIAL";
export const SET_NAME = "SET_NAME";

// jsPsych init editor
export const SET_JSPSYCH_INIT = "SET_JSPSYCH_INIT";

// preview
export const PLAY_ALL = "PLAY_ALL";

// main
export const SET_EXPERIMENT_NAME = "SET_EXPERIMENT_NAME";

// editor
export const SET_PLUGIN_PARAMTER = "SET_PLUGIN_PARAMTER";
export const SET_PLUGIN_PARAMTER_MODE = "SET_PLUGIN_PARAMTER_MODE";
export const UPDATE_MEDIA = "UPDATE_MEDIA";

// editor - TrialForm Actions
export const CHANGE_PLUGIN_TYPE = "CHANGE_PLUGIN_TYPE";

// editor - TimelineForm Actions
export const UPDATE_TIMELINE_VARIABLE_INPUT_TYPE = "UPDATE_TIMELINE_VARIABLE_INPUT_TYPE";
export const UPDATE_TIMELINE_VARIABLE_CELL = "UPDATE_TIMELINE_VARIABLE_CELL";
export const UPDATE_TIMELINE_VARIABLE_TABLE_HEADER = "UPDATE_TIMELINE_VARIABLE_TABLE_HEADER";
export const ADD_TIMELINE_VARIABLE_ROW = "ADD_TIMELINE_VARIABLE_ROW";
export const ADD_TIMELINE_VARIABLE_COLUMN = "ADD_TIMELINE_VARIABLE_COLUMN";
export const DELETE_TIMELINE_VARIABLE_ROW = "DELETE_TIMELINE_VARIABLE_ROW";
export const DELETE_TIMELINE_VARIABLE_COLUMN = "DELETE_TIMELINE_VARIABLE_COLUMN";
export const MOVE_TIMELINE_VARIABLE_ROW_TO = "MOVE_TIMELINE_VARIABLE_ROW_TO"
export const SET_SAMPLING_METHOD = "SET_SAMPLING_METHOD";
export const SET_SAMPLE_SIZE = "SET_SAMPLE_SIZE";
export const SET_RANDOMIZE = "SET_RANDOMIZE";
export const SET_REPETITIONS = "SET_REPETITIONS";
export const SET_LOOP_FUNCTION = "SET_LOOP_FUNCTION";
export const SET_CONDITION_FUNCTION = "SET_CONDITION_FUNCTION";
export const SET_TIMELINE_VARIABLE = "SET_TIMELINE_VARIABLE";

// Cloud
export const SET_OSF_ACCESS = "SET_OSF_ACCESS";
export const SET_CLOUD_DEPLOY_INFO = "SET_CLOUD_DEPLOY_INFO";
export const SET_DIY_DEPLOY_INFO = "SET_DIY_DEPLOY_INFO";