/*
This file handles processing of state before or after
communicating with database or server.

Note that signInOut is imported from ./User since cognito will
handle all the communications for us. signInOut handles fetching
login information from local storage.
*/

import * as actionTypes from '../../constants/ActionTypes';
import { deepCopy, getUUID } from '../../utils';
import { signInOut } from '../User';
import { initState as experimentInitState } from '../Experiment';
 
/*
*Note, will handle deep copy for you

Register a new experiment under a user
For experiment state:
1. assign an id
2. set owner

For user state:
1. set last edit experiment id, date
2. populate experiment repository

*/
function registerNewExperiment(state, forceNewId=false) {
	state.userState.experiments = deepCopy(state.userState.experiments);
	state.experimentState = Object.assign({}, state.experimentState);
	let { userState, experimentState } = state;
	// assign id
	// set owner
	if (!experimentState.experimentId || forceNewId) {
		experimentState.experimentId = getUUID();
		experimentState.owner = Object.assign({}, userState.user);

		let now = Date.now();
		experimentState.experimentDetails = Object.assign({}, experimentState.experimentDetails, {
			createdDate: now,
			lastEditDate: now,
			description: experimentState.experimentDetails.description
		});
	}
	
	// check for accidental add
	// e.g.  logged out due to timeout
	//       user changed something
	//       when log in, signUpPush will be called
	for (let experiment of userState.experiments) {
		if (experimentState.experimentId === experiment.id) {
			return;
		}
	}

	// set last edit
	// populate repository
	userState.lastModifiedExperimentId = experimentState.experimentId;
	userState.experiments.push({
		name: experimentState.experimentName,
		id: experimentState.experimentId,
		details: experimentState.experimentDetails
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
	if (action.anyChange) {
		registerNewExperiment(new_state);
		new_state.userState.lastModifiedExperimentState = deepCopy(new_state.experimentState);
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
		new_state.userState.lastModifiedExperimentId = userData.lastModifiedExperimentId;
		new_state.userState.experiments = userData.experiments;
	}
	if (experimentData) {
		experimentData = experimentData.Item.fetch;
		new_state.experimentState = experimentData;
		new_state.userState.lastModifiedExperimentState = deepCopy(new_state.experimentState);
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
		// make copy
		new_state.userState = Object.assign({}, userState, {
			experiments: deepCopy(userState.experiments),
		});

		// update last edit date
		new_state.experimentState = Object.assign({}, experimentState, {
			experimentDetails: Object.assign({}, experimentState.experimentDetails, {
				lastEditDate: Date.now()
			})
		});

		// update experiment list
		for (let item of new_state.userState.experiments) {
			if (item.id === new_state.experimentState.experimentId) {
				item.name = new_state.experimentState.experimentName;
				item.details = new_state.experimentState.experimentDetails
			}
		}
	// if new
	} else {
		registerNewExperiment(new_state);
	}
	new_state.userState.lastModifiedExperimentState = deepCopy(new_state.experimentState);
	
	return new_state;
}

/*
Update last editting experiment
Update local experiment state

*/
function pullExperiment(state, action) {
	let experimentState = action.data.Item.fetch;
	let new_state = Object.assign({}, state, {
		userState: Object.assign({}, state.userState, {
			lastModifiedExperimentId: experimentState.experimentId
		}),
		experimentState: experimentState
	})

	new_state.userState.lastModifiedExperimentState = deepCopy(new_state.experimentState);

	return new_state;
}

/*
action = {
	id: experimentId
}

*/
function deleteExperiment(state, action) {
	let new_state = Object.assign({}, state, {
		userState: Object.assign({}, state.userState, {
			lastModifiedExperimentId: (state.userState.lastModifiedExperimentId === action.id) ? null : state.userState.lastModifiedExperimentId,
			experiments: state.userState.experiments.filter((item) => (item.id !== action.id)),
			lastModifiedExperimentState: (state.userState.lastModifiedExperimentId === action.id) ? null : state.userState.lastModifiedExperimentState,
		}),
		experimentState: (state.experimentState.experimentId === action.id) ? experimentInitState : state.experimentState
	});

	return new_state;
}

/*
action = {
	experimentItem: {
		id: experimentId,
		name: eperimentName
		details: experimentDetails
	}
}

*/
function duplicateExperiment(state, action) {
	let new_state = Object.assign({}, state, {
		userState: Object.assign({}, state.userState, {
			experiments: state.userState.experiments.slice()
		})
	});

	new_state.userState.experiments.push(action.experimentItem);
	return new_state;
}


function newExperiment(state, action) {
	let new_state = Object.assign({}, state, {
		experimentState: experimentInitState,
		userState: Object.assign({}, state.userState, {
			lastModifiedExperimentId: null
		})
	});

	// registerNewExperiment(new_state);
	new_state.userState.lastModifiedExperimentState = deepCopy(new_state.experimentState);
	
	return new_state;
}

function saveAs(state, action) {
	let new_state = Object.assign({}, state, {
		experimentState: Object.assign({}, state.experimentState, {
			experimentName: action.newName
		})
	});

	registerNewExperiment(new_state, true);
	new_state.userState.lastModifiedExperimentState = deepCopy(new_state.experimentState);

	return new_state;
}

export default function backendReducer(state, action) {
	switch(action.type) {
		case actionTypes.SIGN_UP_PUSH:
			return signUpPush(state, action);
		case actionTypes.SIGN_IN_PULL:
			return signInPull(state, action);
		case actionTypes.CLICK_SAVE_PUSH:
			return clickSavePush(state, action);
		case actionTypes.PULL_EXPERIMENT:
			return pullExperiment(state, action);
		case actionTypes.DELETE_EXPERIMENT:
			return deleteExperiment(state, action);
		case actionTypes.DUPLICATE_EXPERIMENT:
			return duplicateExperiment(state, action);
		case actionTypes.NEW_EXPERIMENT:
			return newExperiment(state, action);
		case actionTypes.SAVE_AS_PUSH:
			return saveAs(state, action);
		default:
			return state;
	}
}

