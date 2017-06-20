// var babel = require("babel-core");

import { stringify } from '../../utils';
import { initState as jsPsychInitState } from './jsPsychInit';

const welcomeObj = {
	...jsPsychInitState,
	timeline: [
		{
			type: 'text',
			text: 'Welcome to jsPysch Experiment Builder!',
			choice: "",
		}
	]
}

const undefinedObj = {
	...jsPsychInitState,
	timeline: [
		{
			type: 'text',
			text: 'No timeline/trial is selected!',
			choice: "",
		}
	]
}

export const Welcome = 'jsPsych.init(' + stringify(welcomeObj) + ');';

export const Undefined = 'jsPsych.init(' + stringify(undefinedObj) + ');';

export function generateInit(state) {
	let blocks = [];
	let timeline = (state.previewAll) ? state.mainTimeline : [state.previewId];
	let node;
	for (let id of timeline) {
		if (!id) continue;
		node = state[id];
		if (node.enabled || !state.previewAll) {
			blocks.push(generateTrial(node));
		}
	}

	let obj = {
		...state.jsPsychInit,
		timeline: blocks
	};

	return "jsPsych.init(" + stringify(obj) + ");";
}


function generateTrial(trial) {
	return {
		type: trial.pluginType,
		...trial.parameters
	};
}

export function setLiveEditting(state, action) {
	return Object.assign({}, state, {
		liveEditting: action.flag,
	});
}