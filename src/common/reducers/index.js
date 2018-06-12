// import * as actionTypes from '../constants/ActionTypes';
import { combineReducers } from "redux";
import reduceReducers from 'reduce-reducers';
import experitmentReducer from './Experiment';
import userReducer from './User';
import notificationsReducer from './Notifications';
import authenticationsReducer from './Authentications';

const combinedReducers = combineReducers({
	experimentState: experitmentReducer,
	userState: userReducer,
	notifications: notificationsReducer,
	authentications: authenticationsReducer
});

export default combinedReducers;
