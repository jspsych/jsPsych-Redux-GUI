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

import * as actionTypes from '../../constants/ActionTypes';
import { deepCopy } from '../../utils';

export const defaultFunction = "function(data) { \n\treturn undefined; \n}";

export const initState = {
	display_element: undefined,
	default_iti: 0,
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
	auto_update_progress_bar: true,
	show_preload_progress_bar: true,
	preload_audio: [],
	preload_images: [],
	max_load_time: 60000,
}

export default function(state=initState, action) {

	switch(action.type) {
		case actionTypes.SET_JSPSYCH_INIT:
			return setJspyschInit(state, action);
		default:
			return state;
	}
}

export const settingType = {
	display_element: 0,
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
function setJspyschInit(state, action) {
	const { key, value } = action;
	let new_state = deepCopy(state);

	switch(key) {
		case settingType.display_element:
			new_state.display_element = value;
			break;
		case settingType.default_iti:
			new_state.default_iti = value;
			break;
		case settingType.on_finish:
			new_state.on_finish = value;
			break;
		case settingType.on_data_update:
			new_state.on_data_update = value;
			break;
		case settingType.on_trial_start:
			new_state.on_trial_start = value;
			break;
		case settingType.on_trial_finish:
			new_state.on_trial_finish = value;
			break;
		case settingType.on_interaction_data_update:
			new_state.on_interaction_data_update = value;
			break;
		case settingType.min_width:
			new_state.exclusions.min_width = value;
			break;
		case settingType.min_height:
			new_state.exclusions.min_height = value;
			break;
		case settingType.audio:
			new_state.exclusions.audio = !new_state.exclusions.audio;
			break;
		case settingType.show_progress_bar:
			new_state.show_progress_bar = !new_state.show_progress_bar;
			break;
		case settingType.auto_update_progress_bar:
			new_state.auto_update_progress_bar = !new_state.auto_update_progress_bar;
			break;
		case settingType.show_preload_progress_bar:
			new_state.show_preload_progress_bar = !new_state.show_preload_progress_bar;
			break;
		case settingType.preload_audio:
			new_state.preload_audio = value;
			break;
		case settingType.preload_images:
			new_state.preload_images = value;
			break;
		case settingType.max_load_time:
			new_state.max_load_time = value;
			break;
		default:
			break;
	}

	return new_state;
}