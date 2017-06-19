var funcM = /"function.*?}"/g;
var funcR = /function.*?}/g;
var fatM = /"\(.*?\).*?=>.*?(}|\))"/g;
var fatR = /\(.*?\).*?=>.*?(}|\))/g;

function handleFunctionString(s) {
	s = s.replace(/\\n/g, '');
	s = s.replace(/\\t/g, '');
	return handleFunc(handleFat(s));
}

function handleFunc(s) {
	let fur = s.match(funcR);
	if (!fur) {
		return s;
	} else {
		for (let m of fur) {
			s = s.replace('"'+m+'"', m);
		}
		return s;
	}
}

function handleFat(s) {
	let far = s.match(fatR);
	if (!far) return s;
	for (let m of far) {
		s = s.replace('"'+m+'"', m);
	}
	return s;
}

export function generateInit(state, timeline=[]) {
	let blocks = [];
	let node;
	for (let id of timeline) {
		if (!id) continue;
		node = state[id];
		if (node.enabled) {
			blocks.push(generateTrial(node));
		}
	}

	let obj = {
		...state.jsPsychInit,
		timeline: blocks
	};

	return "jsPsych.init(" + (handleFunctionString(JSON.stringify(obj))) + ");";
}


function generateTrial(trial) {
	return {
		type: trial.pluginType,
		...trial.parameters
	};
}