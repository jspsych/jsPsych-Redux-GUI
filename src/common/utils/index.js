import Prefixer from 'inline-style-prefixer';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { cloneDeep, isEqual } from 'lodash';
import short_uuid from 'short-uuid';

// import * as notifications from '../containers/Notifications/NotificationsContainer.js';
// import * as loginWindows from '../containers/Authentications/AuthenticationsContainer.js';
import * as commonFlows from '../containers/commonFlows.js';

if (!Array.prototype.move) {
  Array.prototype.move = function(from,to){
    this.splice(to,0,this.splice(from,1)[0]);
    return this;
  };
}

// CSS prefixer
const _prefixer = new Prefixer();
export const prefixer = (style={}, multiple=false) => {
	if (!multiple) return _prefixer.prefix(style);
	let res = {};
	for (let key of Object.keys(style)) {
		res[key] = _prefixer.prefix(style[key]);
	}
	return res;
}

// Backend flows or related
// export { notifications, loginWindows, commonFlows };
export { commonFlows };

// React-DnD
export const withDnDContext = DragDropContext(HTML5Backend);

// utility functions
export const deepCopy = cloneDeep;

export const deepEqual = isEqual;

export function getUUID() {
	var translator = short_uuid();
	//var decimalTranslator = short("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	let res = translator.new();
	return res;
}

export const toNull = (s) => ((s === '') ? null : s);

export const toEmptyString = (s) => ((s === null || s === undefined) ? '' : s);

export const toEmptyArray = (s) => (!s ? [] : s);

export function isValueEmpty(val) {
	return val === '' || val === null || val === undefined || (Array.isArray(val) && val.length === 0) ||
			(typeof val === 'object' && Object.keys(val).length === 0);
}

export function injectJsPsychUniversalPluginParameters(obj={}) {
	return Object.assign(obj, window.jsPsych.plugins.universalPluginParameters);
}

/**
 * typeof {(object|string)} ParamPathNode
 * @property {ParamPathNode} next
 * @property {number} position - index
 * @property {string} key
*/
export function locateNestedParameterValue(parameters, path) {
    let parameterValue = parameters;
    if (typeof path === 'object') {
        // find the complex type jsPsych plugin parameter
        parameterValue = parameterValue[path.key];
        path = path.next;
        while (path) {
            let tmp = parameterValue.value[path.position];
            parameterValue = parameterValue.value[path.position][path.key];
            path = path.next;
        }
    } else {
        parameterValue = parameterValue[path];
    }

    return parameterValue;
}

/**
 * @function isJspsychValueObjectEmpty
 * @param {JspsychValueObject} obj
 * @desc Should originally be a method of the JspsychValueObject class that determines if the object is truly empty. But since
 * AWS.DynamoDB does not store functions, this method is taken out separatly.
 * @returns {boolean}
*/
export const isJspsychValueObjectEmpty = (obj) => {
    switch (obj.mode) {
        case enums.ParameterMode.USE_FUNC:
            return !obj.func.code;
        case enums.ParameterMode.USE_TV:
            return !obj.timelineVariable;
        case enums.ParameterMode.USE_VAL:
        default:
            return !obj.value;
    }
}

export const isString = (type) => (type === enums.TimelineVariableInputType.TEXT || type === enums.TimelineVariableInputType.LONG_TEXT);

export const isFunction = (type) => (type === enums.TimelineVariableInputType.FUNCTION);
