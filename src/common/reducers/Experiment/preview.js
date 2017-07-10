var esprima = require("esprima");
var escodegen = require("escodegen");
import { initState as jsPsychInitState } from './jsPsychInit';
import { isTimeline } from './utils';
import { getSignedUrl } from '../../backend/s3';

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
			text: 'No timeline/trial is toggled or selected!',
			choice: "",
		}
	]
}

export const Welcome = 'jsPsych.init(' + stringify(welcomeObj) + ');';

export const Undefined = 'jsPsych.init(' + stringify(undefinedObj) + ');';


const AWS_S3_MEDIA_TYPE = "AWS-S3-MEDIA";
const DEPLOY_PATH = 'assets/';
export const MediaObject = (filename, prefix) => ({
	type: AWS_S3_MEDIA_TYPE,
	filename: filename,
	prefix: prefix,
})

export const isS3MediaType = (item) => (typeof item === 'object' && item && item.type === AWS_S3_MEDIA_TYPE);

export function generateCode(state, all=false, deploy=false) {
	let timeline = (all) ? state.mainTimeline : [state.previewId];
	let blocks = [];
	let node;
	// bool that descides if this node should be include
	let include;
	for (let id of timeline) {
		if (!id) continue;
		node = state[id];
		include = (!state.previewAll) ? true : node.enabled;
		if (include) {
			if (isTimeline(node)) {
				if (node.childrenById.length > 0) {
					blocks.push(generateTimeline(state, node));
				} else {
					blocks.push({
						type: 'text',
						text: 'No trial is under this timeline!',
						choice: ""
					})
				}
			} else {
				blocks.push(generateTrial(state, node, deploy));
			}
		}
	}

	if (!blocks.length) {
		return Undefined;
	}

	let obj = {
		...state.jsPsychInit,
		timeline: blocks
	};

	return "jsPsych.init(" + stringify(obj) + ");";
}

function resolveMediaPath(mediaObject, deploy) {
	let prefix = mediaObject.prefix;
	let processFunc = getSignedUrl;
	if (deploy) {
		prefix = DEPLOY_PATH;
		processFunc = p => (p);
	} 
	if (typeof mediaObject.filename === 'string') {
		return processFunc(prefix + mediaObject.filename);
	} else if (Array.isArray(mediaObject.filename)) {
		return mediaObject.filename.map((f) => (processFunc(prefix + f)));
	}
}

/*
Note that FOR NOW AWS S3 Media Type Object MUST be in the first level
of trial.paramters
*/
function generateTrial(state, trial, deploy=false) {
	let res = {};
	let parameters = trial.parameters, item;
	for (let key of Object.keys(parameters)) {
		item = parameters[key];
		if (isS3MediaType(item)) {
			item = resolveMediaPath(item, deploy);
		}
		res[key] = item;
	}

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
					res.push('"' + key + '":' + stringify(obj[key]));
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
		// let log = JSON.stringify({error: e, info: info});
		let func = "function() { console.log('" + JSON.stringify({error: e, info: info}) + "'); }";
		return func;
	}
}
