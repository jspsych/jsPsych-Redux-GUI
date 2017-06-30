// import * as actionTypes from '../constants/ActionTypes';
import { combineReducers } from "redux";
import reduceReducers from 'reduce-reducers';
import experitmentReducer from './Experiment';
import userReducer from './User';
import backendReducer from './backend';

const combinedReducers = combineReducers({
	experimentState: experitmentReducer,
	userState: userReducer
});

const rootReducer = reduceReducers(combinedReducers, backendReducer);

export default rootReducer;
