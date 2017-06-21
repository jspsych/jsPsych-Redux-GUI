var esprima = require("esprima");
var esmangle = require("esmangle");
var escodegen = require("escodegen");

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

export function generateCode(state) {
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
		...trial.parameters
	};
}

function generateTimeline(timeline) {
	let res = {
		...timeline.parameters
	}
}

export function setLiveEditting(state, action) {
	return Object.assign({}, state, {
		liveEditting: action.flag,
	});
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
				let i = obj.length;
				for (let item of obj) {
					res.push(stringify(item));
					if (obj-- > 1) {
						res.push(",");
					}
				}
				res.push("]");
			} else if (obj.isFunc) { 
				return stringifyFunc(obj.code, obj.info);
			}else {
				res.push("{");
				let keys = Object.keys(obj);
				for (let key of keys) {
					res.push('"' + key + '"' + ":" + stringify(obj[key]) + ",");  
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
		let func = "function() { alert('" + JSON.stringify({error: e, info: info}) + "'); }";
		console.log(func);
		return func;
	}
}