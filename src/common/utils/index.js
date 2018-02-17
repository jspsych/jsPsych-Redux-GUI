var short = require('short-uuid');


/*
Simple deepCopy,
Target can be
object
boolean
number
array
undefined

*/
export function deepCopy(target) {
	if (!target) return target;

	let clone = target;

	let type = typeof(target);
	switch(type) {
		case "boolean":
		case "number":
		case "string":
			return clone;
		case "object":
			if (Array.isArray(clone)) {
				clone = [];
				for (let item of target) {
					clone.push(deepCopy(item));
				}
			} else {
				clone = {};
				let keys = Object.keys(target);
				for (let key of keys) {
					clone[key] = deepCopy(target[key]);
				}
			}
			return clone;
		case 'function':
			return clone;
		default:
			throw new TypeError(type + " not supported.");
	}
}

export const convertEmptyStringToNull = (s) => ((s === '') ? null : s);

export const convertNullToEmptyString = (s) => ((s === null) ? '' : s);

export function getUUID() {
	var translator = short();
	//var decimalTranslator = short("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	let res = translator.new();
	return res;
}


export function isValueEmpty(val) {
	return val === '' || val === null || val === undefined || (Array.isArray(val) && val.length === 0) ||
			(typeof val === 'object' && Object.keys(val).length === 0);
}

export function injectJsPsychUniversalPluginParameters(obj={}) {
	return Object.assign(obj, window.jsPsych.plugins.universalPluginParameters);
}