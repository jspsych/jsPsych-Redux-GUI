// import * as actionTypes from '../constants/ActionTypes';
import { combineReducers } from "redux";
import reduceReducers from 'reduce-reducers';
import experitmentReducer from './Experiment';
import userReducer from './User';
import backendReducer from './Backend';
import notificationReducer from './Notification';
import notificationsReducer from './Notifications';

const combinedReducers = combineReducers({
	experimentState: experitmentReducer,
	userState: userReducer,
	notificationState: notificationReducer,
	notifications: notificationsReducer
});

const rootReducer = reduceReducers(combinedReducers, backendReducer);

export default rootReducer;
