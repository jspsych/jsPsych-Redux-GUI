/*
This file handles processing of state before or after
communicating with database or server.

Note that signInOut is imported from ./User since cognito will
handle all the communications for us. signInOut handles fetching
login information from local storage.
*/

import * as actionTypes from '../constants/ActionTypes';
import { deepCopy, getUUID } from '../utils';
import { signInOut } from './User';

/*
*Note, will handle deep copy for you

Register a new experiment under a user
For experiment state:
1. assign an id
2. set owner

For user state:
1. set last edit experiment id
2. populate experiment repository

*/
function registerNewExperiment(state) {
	state.userState.experiments = deepCopy(state.userState.experiments);
	state.experimentState = Object.assign({}, state.experimentState);
	let { userState, experimentState } = state;
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

/*
Save case: create account
It will process state before communicating with database

It is called when the first sign in of a verified user.
Typically happens when the account is created and gets 
verified immediately. (will automatically sign in)

It will do the following
1. Update userState by fetching login data from local storage (handled by signInOut)
2. If there is any change in experiment, register this experiment under the user

*/
function signUpPush(state, action) {
	let new_state = Object.assign({}, state);
	// update user info from local storage
	new_state.userState = signInOut(new_state.userState, { signIn: true });

	// is experiment modified?
	// yes
	if (new_state.experimentState.anyChange) {
		registerNewExperiment(new_state);
	}

	return new_state;
}

/*
Fetch case: sign in
It will process state after communicating with database

It is called after signing in by cognito.
It serves to fetch data from database and sync
local states.

Note in User/index there is also a signInOut, which 
serves to sync userState.user with local storage

action = {
	userData: fetched user data,
	experimentData: fetched experiment data  
}
*/
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

/*
Save case: click save
It will process state before communicating with database

//xx if no change return; xx// should be handled before dispatching
If saving an old experiment:
	1. update its name in userState
else:
	1. register itself to current user

*/
function clickSavePush(state, action) {
	let new_state = Object.assign({}, state);
	let { userState, experimentState } = new_state;
	
	// if old experiment
	if (experimentState.experimentId) {
		new_state.userState = Object.assign({}, userState, {
			experiments: deepCopy(userState.experiments),
		});
		for (let item of new_state.userState.experiments) {
			if (item.id === experimentState.experimentId) {
				item.name = experimentState.experimentName;
			}
		}
	} else {
		registerNewExperiment(new_state);
	}

	return new_state;
}

function backendReducer(state, action) {
	switch(action.type) {
		case actionTypes.SIGN_UP_PUSH:
			return signUpPush(state, action);
		case actionTypes.SIGN_IN_PULL:
			return signInPull(state, action);
		case actionTypes.CLICK_SAVE_PUSH:
			return clickSavePush(state, action);
		default:
			return state;
	}
}

function detectSave(state, action) {
	switch(action.type) {
		case actionTypes.SIGN_UP_PUSH:
		case actionTypes.CLICK_SAVE_PUSH:
			if (!state.experimentState.anyChange) return state;
			return Object.assign({}, state, {
				experimentState: Object.assign({}, state.experimentState, {
					anyChange: false,
				})
			});
		default:
			return state;
	}
}

export default function(state, action) {
	return detectSave(backendReducer(state, action), action);
}