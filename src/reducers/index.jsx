import { combineReducers } from 'redux';
//import trialTable from 'trialTableReducers';
//import trialOrder from 'trialOrderReducers';
import timelineOpen from 'timelineOpenReducers';
import openTrial from 'openTrialReducers';
import pastStates from 'pastStatesreducers';
import futureStates from 'futureStatesReducers';
import dragged from 'draggedReducers';
import over from 'overReducers';

// Combine all the different reducers into the store
const rootReducer = combineReducers({
    //trialTable,
    //trialOrder,
    openTrial,
    timelineOpen,
    pastStates,
    futureStates,
    dragged,
    over
});

export default rootReducer;
