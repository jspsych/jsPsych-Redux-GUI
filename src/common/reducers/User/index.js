import * as actionTypes from '../../constants/ActionTypes';

export const initState = {
  user: null,
  popVerificationCallback: null,
};


export default function userReducer(state = initState, action) {
	switch (action.type) {
		default:
			return state;
	}
}
