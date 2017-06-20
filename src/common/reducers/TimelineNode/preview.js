// var babel = require("babel-core");

function stringify(obj) {
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
				let code = obj.code.replace(/\n/g, '').replace(/\t/g, '    ');
				// console.log(babel.transform(code).code);
				return code;
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

export function generateInit(state, timeline=[]) {
	let blocks = [];
	let node;
	for (let id of timeline) {
		if (!id) continue;
		node = state[id];
		if (node.enabled || state.previewId === node.id) {
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