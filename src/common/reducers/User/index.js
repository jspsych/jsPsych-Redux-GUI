import * as actionTypes from '../../constants/ActionTypes';

export const initState = {
  user: null,
  registerWindowVisible: false,
  signInWindowVisible: false,
};

/*const setExperimentName = (state, action) => {
	return Object.assign({}, state, {
		experimentName: action.name
	})
}*/

const showRegisterWindow = (state, action) => {
  return Object.assign({}, state, {
    registerWindowVisible: true
  });
}

const hideRegisterWindow = (state, action) => {
  return Object.assign({}, state, {
    registerWindowVisible: false
  });
}

const showSignInWindow = (state, action) => {
  return Object.assign({}, state, {
    signInWindowVisible: true
  });
}

const hideSignInWindow = (state, action) => {
  return Object.assign({}, state, {
    signInWindowVisible: false
  });
}

export default function userReducer(state = initState, action) {
	switch (action.type) {
    case actionTypes.SHOW_REGISTER_WINDOW:
      return showRegisterWindow(state, action);
    case actionTypes.HIDE_REGISTER_WINDOW:
      return hideRegisterWindow(state, action);
    case actionTypes.SHOW_SIGNIN_WINDOW:
      return showSignInWindow(state, action);
    case actionTypes.HIDE_SIGNIN_WINDOW:
      return hideSignInWindow(state, action);
		default:
			return state;
	}
}
