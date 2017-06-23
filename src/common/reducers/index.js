import * as actionTypes from '../constants/ActionTypes';
import { combineReducers } from "redux";
import experitmentReducer from './Experiment';
import userReducer from './User';




const rootReducer = combineReducers({
	experimentState: experitmentReducer,
	userState: userReducer
});

export default rootReducer;
