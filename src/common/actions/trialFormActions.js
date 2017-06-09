import * as actionTypes from '../constants/ActionTypes';

export function onPluginTypeChange(key) {
	return {
		type: actionTypes.CHANGE_PLUGIN_TYPE,
		key: key
	};
}
