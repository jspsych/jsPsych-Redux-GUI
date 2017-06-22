var esprima = require("esprima");
var escodegen = require("escodegen");

import { initState as jsPsychInitState } from './jsPsychInit';
import { isTimeline } from './utils';

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

export function generateCode(state) {
	let blocks = [];
	let timeline = (state.previewAll) ? state.mainTimeline : [state.previewId];
	let node;
	// bool that descides if this node should be include
	let include;
	for (let id of timeline) {
		if (!id) continue;
		node = state[id];
		include = (!state.previewAll) ? true : node.enabled;
		if (include) {
			if (isTimeline(node)) {
				blocks.push(generateTimeline(state, node));
			} else {
				blocks.push(generateTrial(state, node));
			}
		}
	}

	let obj = {
		...state.jsPsychInit,
		timeline: blocks
	};

	return "jsPsych.init(" + stringify(obj) + ");";
}

export function playAll(state, action) {
	return Object.assign({}, state, {
		previewAll: true,
	});
}


function generateTrial(state, trial) {
	let res = {
		...trial.parameters
	};

	if (res.timing_stim && !state.previewAll) {
		res.timing_stim = -1;
	}

	return res;
}

function generateTimeline(state, node) {
	let res = {
		...node.parameters
	}
	let timeline = [];
	let desc, block, include;
	for (let descId of node.childrenById) {
		desc = state[descId];
		include = (!state.previewAll) ? true : desc.enabled;
		if (include) {
			if (isTimeline(desc)) {
				block = generateTimeline(state, desc);
			} else {
				block = generateTrial(state, desc);
			}
			timeline.push(block);
		}
	}

	res.timeline = timeline;
	return res;
}



/*
Specially written for stringify obj in this app to generate code
For functions, turn it to
{
	isFunc: true,
	code: function
}

*/
export function stringify(obj) {
	if (!obj) return JSON.stringify(obj);

	let type = typeof obj;
	switch(type) {
		case 'object':
			let res = [];
			if (Array.isArray(obj)) {
				res.push("[");
				let l = obj.length, i = 1;
				for (let item of obj) {
					res.push(stringify(item));
					if (i++ < l) {
						res.push(",");
					}
				}
				res.push("]");
			} else if (obj.isFunc) {
				return stringifyFunc(obj.code, obj.info);
			}else {
				res.push("{");
				let keys = Object.keys(obj);
				let l = keys.length, i = 1;
				for (let key of keys) {
					res.push('"' + key + '"' + ":" + stringify(obj[key]));
					if (i++ < l) {
						res.push(",");
					}
				}
				res.push("}");
			}
			return res.join("");
		default:
			return JSON.stringify(obj);
	}
}

function stringifyFunc(code, info=null) {
	try {
		let tree = esprima.parse(code);
		let res = escodegen.generate(tree, {
            format: {
                compact: true,
                semicolons: true,
                parentheses: false
            }
        });
		return res;
	} catch (e) {
		let log = JSON.stringify({error: e, info: info});
		let func = "function() { console.log('" + JSON.stringify({error: e, info: info}) + "'); }";
		console.log(code);
		return func;
	}
}
