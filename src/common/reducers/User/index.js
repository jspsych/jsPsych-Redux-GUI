const initState = core.createUser();

/**
* Reducer that sets OSF access infomation
* @param {Object} action.osfAccess - OSF Access information
* @return A new userState
*/
function setOsfAccess(state, action) {
	return Object.assign({}, state, {
		osfAccess: action.osfAccess
	});
}

/**
* Reducer that loads fetched user data from dynamoDB
* @param {Object} action.userState - fetched user data from dynamoDB
* @return A new userState
*/
function loadUserState(state, action) {
	return Object.assign({}, state, {
		...action.userState
	});
}


export default function userReducer(state = initState, action) {
	switch (action.type) {
		case actions.ActionTypes.LOAD_USER:
			return loadUserState(state, action);

		// cloud access information
		case actions.ActionTypes.SET_OSF_ACCESS:
			return setOsfAccess(state, action);

		default:
			return state;
	}
}


