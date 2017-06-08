import * as actionTypes from '../constants/ActionTypes';

export const setExperimentNameAction = (name) => ({
	type: actionTypes.SET_EXPERIMENT_NAME,
	name: name,
});