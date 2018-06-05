const initState = {
	open: false,
	loginMode: enums.AUTH_MODES.signIn
}

const setAuthWindow = (state, action) => {
	action = utils.deepCopy(action);
	delete action.type;
	return Object.assign({}, state, {
		...action
	})
}

export default function reducer(state=initState, action) {
	switch(action.type) {
		case actions.ActionTypes.SET_AUTH_WINDOW:
			return setAuthWindow(state, action);
		default:
			return state;
	}
}