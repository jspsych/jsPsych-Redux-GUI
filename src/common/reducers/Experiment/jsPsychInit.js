/*
This file handles operations on setting jsPsych.init

Note that timeline is defined as mainTimeline in ./TimelineNode/index,

export initState = {
	display_element: undefined,
	default_iti: 0,

	// **** All functions will be store as string *****
	on_finish: defaultFunction,
	on_trial_start: defaultFunction, 
	on_trial_finish: defaultFunction,
	on_data_update: defaultFunction,
	on_interaction_data_update: defaultFunction,
	exclusions: {
		min_width: 0,
		min_height: 0,
		audio: false,
	},
	show_progress_bar: false,
	auto_update_progress_bar: false,
	show_preload_progress_bar: false,
	preload_audio: [],
	preload_images: [],
	max_load_time: 60000,
}

*/

import { deepCopy } from '../../utils';

export const defaultFunction = (name) =>  ("function " + name +"(data) {\n\treturn undefined;\n}");

export const createFuncObj = (code, info=null) => ({
	isFunc: true,
	code: code,
	info: info
})


export const jsPsych_Display_Element = "Preview-Window";

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

/*
action = {
	key: number,
	value: value
}

*/
export function setJspyschInit(state, action) {
	const { key, value } = action;
	let new_state = Object.assign({}, state);

	let jsPsychInit = deepCopy(new_state.jsPsychInit);
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