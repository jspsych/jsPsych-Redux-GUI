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

import * as actionTypes from '../constants/ActionTypes';

export const defaultFunction = "function(data) { \n\treturn undefined; \n}";

export const initState = {
	display_element: undefined,
	default_iti: 0,
	on_finish: defaultFunction,
	on_trial_start: defaultFunction,
	on_trial_finish: defaultFunction,
	on_data_update: defaultFunction,
	on_interaction_data_update: "",
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
	console.log(action)
	switch(action.type) {
		case actionTypes.SET_JSPSYCH_INIT:
			return setJspyschInit(state, action);
		default:
			return state;
	}
}

function copyState(state) {
	return Object.assign({}, state, {
		preload_audio: state.preload_audio.slice(),
		preload_images: state.preload_images.slice(),
		exclusions: Object.assign({}, state.exclusions),
	});
}


export const settingType = {
	display_element: 0,
	default_iti: 1,
	on_finish: 2,
	on_trial_start: 3,
	on_trial_finish: 4,
	on_data_update: 5,
	on_interaction_data_update: 6,
	min_width: 7,
	min_height: 8,
	audio: 9,
	show_progress_bar: 10,
	auto_update_progress_bar: 11,
	show_preload_progress_bar: 12,
	preload_audio: 13,
	preload_images: 14,
	max_load_time: 15,
}

/*
action = {
	key: number,
	value: value
}

*/
function setJspyschInit(state, action) {
	const { key, value } = action;
	let new_state = copyState(state);

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