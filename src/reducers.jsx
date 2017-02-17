//import InitialState from 'State'; // Any new features of the state should be added here

import Trial from 'Trial';

// This is the initial state of the store.
// Any new features of the store should be addded here.
const InitialState = {
    trialTable: {  [Trial.name]: Trial },
    trialOrder: [ 'default' ],	
    openDrawer: 'none',
    previousStates: [],
    futureStates: []
}

export const guiState = (state = {}, action) => {

    // If the state is undefined return the initial state
    if (typeof state === null) {
        console.log("State Undefined.");
        return { InitialState };
    }

    // Perform an operation on the state specified by the action type
    switch (action.type) {

            // Reducer for the initial state
        case 'INITIAL_STATE':
            console.log("InitialState", InitialState);
            return InitialState;
        case 'SELECT_TRIAL':
             console.log("SelectTrial");
            var old_trial = state.trialTable[action.name];

            // Make the updated the trial property by constructing a new hashtable
            var new_trial = {
                selected: true,
                ...old_trial
            }
            var newTrialList = state.trialTable;
            delete newTrialList[action.name];
            return {
                trialTable: {
                    new_trial,
                    ...newTrialList
                },
                ...state
            };
        case 'ARCHIVE_STATE_REMOVE':
            return {
                previousStates: [
                    state,
                    ...state.previousStates.slice(0, 50)
                ],
                ...state
            }
        case 'ARCHIVE_STATE':
            return {
                previousStates:[
                    state,
                    ...state.previousStates
                ],
                ...state
            }
        case 'RESTORE_STATE':
            var restoredState = state.previousStates[0];

            return {
               futureStates: [
                    state,
                    ...state.futureStates
                ],
                ...restoredState
            }
        case 'RESTORE_STATE_REMOVE':
            var restoredState = state.previousStates[0];

            return {
                futureStates: [
                    state,
                    ...state.futureStates.slice(0,50)
                ],
                ...restoredState
            }
        case 'ADD_TRIAL':
            // New trial's unique id
            var index = Object.keys(state.trialTable).length;

            // New trial's name 
            var newName = "Trial_" + index.toString();           

            // Make the new trial from the default template.
            var newTrial = Object.assign({}, Trial);

            // Delete is okay as these shallow copies are not yet part
            // of the state. 
            delete newTrial['name'];
            delete newTrial['id'];

            // Add the new properties
            newTrial['id'] = index;
            newTrial['name'] = newName;

            // Create the new trial table
            var newTable = Object.assign({}, state.trialTable);
            newTable[[newName]] = newTrial;
            
            // Create the new trial order
            var newOrder = [
                ...state.trialOrder,
                [newName]
            ]

            // Create the new state
            var newState = Object.assign({}, state);
            
            // Remove old properties
            delete newState['trialTable'];
            delete newState['trialOrder'];
             
            // Add new properties
            newState['trialTable'] = newTable;
            newState['trialOrder'] = newOrder;
    
            return newState;
        case 'REMOVE_TRIAL':
            // Remove the trial without mutation
            let {[action.name]: deletedItem, ...rest} = state.trialTable;

            return { 
                trialTable: rest,
                ...state
            }

        case 'OPEN_DRAWER':
                return {
                    ...state,
                    openDrawer: action.name
                }
        case 'CLOSE_DRAWER':
            return {
                openDrawer: 'none',
                ...state 
            }
        default:
            return state;
    }

}

// Reducer for handling changes of an individual trial
export const trial = (state, action) => {
    if (typeof state === null) {
        return 0;
    }

    switch (action.type) {
        default:
            return state;
    }
}
