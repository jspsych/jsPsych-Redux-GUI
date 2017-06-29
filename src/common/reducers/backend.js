import * as actionTypes from '../constants/ActionTypes';
import { deepcopy, getUUID } from '../utils';
import { signInOut } from './User';

function signUp(state, action) {
	let new_state = Object.assign({}, state);
	// update user info
	new_state.userState = signInOut(new_state.userState, { signIn: true });

	// is experiment modified?
	// yes
	if (new_state.experimentState.anyChange) {
		new_state.userState.experiments = [];
		new_state.experimentState = Object.assign({}, new_state.experimentState);
		registerExperiment(new_state.userState, new_state.experimentState);
		new_state.experimentState.anyChange = false;
	}

	return new_state;
}

// sync after sign in 
function signInPull(state, action) {
	let new_state = Object.assign({}, state);
	let { userData, experimentData } = action;
	if (userData) {
		userData = userData.Item.fetch;
		new_state.userState = Object.assign({}, new_state.userState);
		new_state.userState.lastEdittingId = userData.lastEdittingId;
		new_state.userState.experiments = userData.experiments;
	}
	if (experimentData) {
		experimentData = experimentData.Item.fetch;
		new_state.experimentState = experimentData;
	}
	return new_state;
}

function registerExperiment(userState, experimentState) {
	// assign id
	// set owner
	if (!experimentState.experimentId) {
		experimentState.experimentId = getUUID();
		experimentState.owner = Object.assign({}, userState.user);
	}
	// set last edit
	// populate repository
	userState.lastEdittingId = experimentState.experimentId;
	userState.experiments.push({
		name: experimentState.experimentName,
		id: experimentState.experimentId
	});
}

export default function(state, action) {
	switch(action.type) {
		case actionTypes.SIGN_UP:
			return signUp(state, action);
		case actionTypes.SIGN_IN_PULL:
			return signInPull(state, action);
		default:
			return state;
	}
}