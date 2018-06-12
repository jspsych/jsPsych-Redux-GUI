import { combineReducers } from "redux";
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
