import * as actionTypes from '../../constants/ActionTypes';

export const initState = {
  username: null,
};


export default function userReducer(state = initState, action) {
	switch (action.type) {
		default:
			return state;
	}
}
