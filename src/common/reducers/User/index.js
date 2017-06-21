import * as actionTypes from '../../constants/ActionTypes';

export const initState = {
  user: null,
};

/*const setExperimentName = (state, action) => {
	return Object.assign({}, state, {
		experimentName: action.name
	})
}*/

export default function userReducer(state = initState, action) {
	switch (action.type) {
		default:
			return state;
	}
}
