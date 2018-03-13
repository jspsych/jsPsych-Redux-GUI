/**
 *@file This file describes the reducers for initial and launch settings for jsPsych
 *@author Junyan Qi <juqi@vassar.edu>
*/
import { CodeLanguage } from '../../components/CodeEditor';

/**
 * @typeof {Object} StringifiedFunction
 * @classdesc Class representing a stringified function. This is created and used like an objecy because AWS.DynamoDB does not take functions.
 * The class is merely just for more maintainable code purpose.
 * @class
 * @public
*/
export class StringifiedFunction {
	/**
     * Create a stringified function
     * @param {(string|null)} code - The code from user input
     * @param {boolean} ifEval - If the code should be evaluated when generating the deployment code
     * @param {enum} language - Tells the GUI (react-codemirror) which language mode should it use
     * @property {boolean} isFunc -
     */
	constructor({code=null, ifEval=true, language=CodeLanguage.javascript[0]}) {
		this.code = code;
		// gui info (codeMirror language mode, eval info)
		this.ifEval = ifEval;
		this.language = language;
		this.isFunc = true;
	}
}

export const createFuncObj = (code=null, info=null) => (new StringifiedFunction({code: code, info: info}));

const defaultFunction = (name) =>  ("function " + name +"(data) {\n\treturn undefined;\n}");

/**
 * @enum
 * @constant
 * @default
*/
export const jsPsych_Display_Element = "jsPsych-Window";

/**
 * jsPyschInit State Template
 * @namespace jsPyschInitState
 * @description Default state for jsPsych initial and lanch setting. 
 * @property {guiStringValue} display_element=jsPsych_Display_Element - 
 * The id of the document element that the experiment should be displaed in. See {@link http://www.jspsych.org/}
 * @property {number} default_iti=0 - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_finish - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_trial_start - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_trial_finish - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_data_update - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_interaction_data_update - See {@link http://www.jspsych.org/}
 * @property {object} exclusions - See {@link http://www.jspsych.org/}
 * @property {number} exclusions.min_width=0 - See {@link http://www.jspsych.org/}
 * @property {number} exclusions.min_height=0 - See {@link http://www.jspsych.org/}
 * @property {boolean} exclusions.audio=false - See {@link http://www.jspsych.org/}
 * @property {boolean} show_progress_bar=false - See {@link http://www.jspsych.org/}
 * @property {boolean} show_update_progress_bar=true - See {@link http://www.jspsych.org/}
 * @property {boolean} show_preload_progress_bar=true - See {@link http://www.jspsych.org/}
 * @property {Array} preload_audio=[] - See {@link http://www.jspsych.org/}
 * @property {Array} preload_images=[] - See {@link http://www.jspsych.org/}
 * @property {number} max_load_time=60000 - See {@link http://www.jspsych.org/}
*/
export const initState = {
	display_element: jsPsych_Display_Element,
	default_iti: 0,
	on_finish: createFuncObj(defaultFunction("on_finish")),
	on_trial_start: createFuncObj(defaultFunction("on_trial_start")),
	on_trial_finish: createFuncObj(defaultFunction("on_trial_finish")),
	on_data_update: createFuncObj(defaultFunction("on_data_update")),
	on_interaction_data_update: createFuncObj(defaultFunction("on_interaction_data_update")),
	exclusions: {
		min_width: 0,
		min_height: 0,
		audio: false,
	},
	show_progress_bar: false,
	auto_update_progress_bar: true,
	show_preload_progress_bar: true,
	preload_audio: [],
	preload_images: [],
	max_load_time: 60000,
}

/**
 * @typeof {string} SettingTypeEnum
 * @readonly
 * @enum {SettingTypeEnum}
*/
export const settingType = {
	default_iti: "default_iti",
	on_finish: "on_finish",
	on_trial_start: "on_trial_start",
	on_trial_finish: "on_trial_finish",
	on_data_update: "on_data_update",
	on_interaction_data_update: "on_interaction_data_update",
	min_width: "min_width",
	min_height: "min_height",
	audio: "audio",
	show_progress_bar: "show_progress_bar",
	auto_update_progress_bar: "auto_update_progress_bar",
	show_preload_progress_bar: "show_preload_progress_bar",
	preload_audio: "preload_audio",
	preload_images: "preload_images",
	max_load_time: "max_load_time",
}

/**@function(state, action)
 * @name experimentReducer
 * @description The root reducer for the whole experiment state
 * @param {object} state - The Experiment State Object 
 * @param {Object} action - Describes the action user invokes
 * @param {SettingTypeEnum} action.key - Describes which value to be set
 * @param {(guiStringValue|number|boolean|Array) action.value - Holds the user input value
 * @returns {Object} Returns a completely new Experiment State object
*/
export function setJspyschInit(state, action) {
	const { key, value } = action;
	let new_state = Object.assign({}, state);

	let jsPsychInit = utils.deepCopy(new_state.jsPsychInit);
	new_state.jsPsychInit = jsPsychInit;
	
	switch(key) {
		case settingType.default_iti:
			jsPsychInit.default_iti = value;
			break;
		case settingType.on_finish:
			jsPsychInit.on_finish = createFuncObj(value);
			break;
		case settingType.on_data_update:
			jsPsychInit.on_data_update = createFuncObj(value);
			break;
		case settingType.on_trial_start:
			jsPsychInit.on_trial_start = createFuncObj(value);
			break;
		case settingType.on_trial_finish:
			jsPsychInit.on_trial_finish = createFuncObj(value);
			break;
		case settingType.on_interaction_data_update:
			jsPsychInit.on_interaction_data_update = createFuncObj(value);
			break;
		case settingType.min_width:
			jsPsychInit.exclusions.min_width = value;
			break;
		case settingType.min_height:
			jsPsychInit.exclusions.min_height = value;
			break;
		case settingType.audio:
			jsPsychInit.exclusions.audio = !jsPsychInit.exclusions.audio;
			break;
		case settingType.show_progress_bar:
			jsPsychInit.show_progress_bar = !jsPsychInit.show_progress_bar;
			break;
		case settingType.auto_update_progress_bar:
			jsPsychInit.auto_update_progress_bar = !jsPsychInit.auto_update_progress_bar;
			break;
		case settingType.show_preload_progress_bar:
			jsPsychInit.show_preload_progress_bar = !jsPsychInit.show_preload_progress_bar;
			break;
		case settingType.preload_audio:
			jsPsychInit.preload_audio = value;
			break;
		case settingType.preload_images:
			jsPsychInit.preload_images = value;
			break;
		case settingType.max_load_time:
			jsPsychInit.max_load_time = value;
			break;
		default:
			break;
	}

	return new_state;
}