import Prefixer from 'inline-style-prefixer';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { cloneDeep, isEqual } from 'lodash';
import short_uuid from 'short-uuid';
import * as notifications from '../containers/Notifications';
import * as logins from '../containers/Authentications/AuthenticationsContainer.js';

const _prefixer = new Prefixer();

export { notifications, logins };

export const prefixer = (style={}, multiple=false) => {
	if (!multiple) return _prefixer.prefix(style);
	let res = {};
	for (let key of Object.keys(style)) {
		res[key] = _prefixer.prefix(style[key]);
	}
	return res;
}

if (!Array.prototype.move) {
  Array.prototype.move = function(from,to){
    this.splice(to,0,this.splice(from,1)[0]);
    return this;
  };
}

export const deepCopy = cloneDeep;

export const deepEqual = isEqual;

export const toNull = (s) => ((s === '') ? null : s);

export const toEmptyString = (s) => ((s === null || s === undefined) ? '' : s);

export const toEmptyArray = (s) => (!s ? [] : s);

export function getUUID() {
	var translator = short_uuid();
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

export const withDnDContext = DragDropContext(HTML5Backend);
