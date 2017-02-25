// This is the initial state of the store.
// Any new features of the store should be addded here.
const Trial = {
    id: 0, 
    name: "default",
    isTimeline: false,
    timeline: [],
    trialType: "trialType",
    parentTrial: -1,
    selected: false 
}


const InitialState = {
    trialTable: {  [Trial.id]: Trial },
    trialOrder: [ '0' ],	
    openTrial: -1,
    pastStates: [],
    futureStates: []
}

// This is the variable for keeping track of the id's that have been used
var currentID = 1;

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

            // Make the updated the trial property by constructing a new hashtable
            var newTrial = Object.assign({}, state.trialTable[action.id]);
            delete newTrial['selected'];
            newTrial['selected'] = true;

            var newTable = Object.assign({}, state.trialTable);
            delete newTable[action.id];
            newTable[action.id] = newTrial;

            var newState = Object.assign({}, state);

            delete newState['trialTable'];

            newState['trialTable'] = newTable;

            return newState;

        case 'DESELECT_TRIAL':

            // Make the updated the trial property by constructing a new hashtable
            var newTrial = Object.assign({}, state.trialTable[action.id]);
            delete newTrial['selected'];
            newTrial['selected'] = false;

            var newTable = Object.assign({}, state.trialTable);
            delete newTable[action.id];
            newTable[action.id] = newTrial;

            var newState = Object.assign({}, state);

            delete newState['trialTable'];

            newState['trialTable'] = newTable;

            return newState;

        case 'ARCHIVE_STATE_REMOVE':

            var oldState = Object.assign({}, state);
            oldState['trialTable'] = Object.assign({}, state['trialTable'])
            var newPStates = [
                oldState,
                ...oldState.pastStates.slice(0,50)
            ];

            var newState = Object.assign({}, state);
            delete newState['pastStates'];
            newState['pastStates'] = newPStates; 

            return newState; 

        case 'ARCHIVE_STATE':
            // Create a deep copy of the state object
            // NOTE: This will not deep copy sub-objects that must be done explicitly
            var oldState = Object.assign({}, state);
            
            // Create a deep copy of the state.trial table object
            oldState['trialTable'] = Object.assign({}, state['trialTable'])
            var newPStates = [
                oldState,
                ...oldState.pastStates
            ];

            var newState = Object.assign({}, state);
            
            // Remove old past states
            delete newState['pastStates'];

            // Remove all future states as history has changed
            delete newState['futureStates'];

            newState['pastStates'] = newPStates; 
            newState['futureStates'] = [];

            return newState; 

        case 'RESTORE_STATE':
            var restoredState = Object.assign({}, state.pastStates[0]);
            console.log("State: to Restore", restoredState)
            var newFuture = [
                state,
                ...state.futureStates
            ]

            var newPast = [
                ...state.pastStates.slice(1, 51)
            ]

            delete restoredState['futureStates']
            delete restoredState['pastStates']

            restoredState['futureStates'] = newFuture;
            restoredState['pastStates'] = newPast;
            return restoredState;

        case 'RESTORE_STATE_REMOVE':
            var restoredState = Object.assign({}, state.pastStates[0]);

            var newFuture = [
                state,
                ...state.futureStates.slice(0, 50)
            ]

            var newPast = [
                ...state.pastStates.slice(1, 51)
            ]

            delete restoredState['futureStates']
            delete restoredState['pastStates']

            restoredState['futureStates'] = newFuture;
            restoredState['pastStates'] = newPast;
            
            return restoredState;

        case 'RESTORE_FUTURE_STATE':
            
            var restoredState = Object.assign({}, state.futureStates[0]);

            var newPast = [
                state,
                ...state.pastStates
            ]
            var newFuture = [
                ...state.futureStates.slice(1,51)
            ]

            delete restoredState['futureStates']
            delete restoredState['pastStates']

            restoredState['futureStates'] = newFuture;
            restoredState['pastStates'] = newPast;
            console.log("restoreState: ", restoredState)
            return restoredState;
        
        case 'ADD_TRIAL':
            // New trial's unique id
            var index = Object.keys(state.trialTable).length;

            // Ensure there are no duplicate trial names 
            while(state.trialTable["Trial_"+index.toString()] != undefined){
                index++; 
            }

            // New trial's name 
            var newName = "Trial_" + index.toString();           

            // Make the new trial from the default template.
            var newTrial = Object.assign({}, Trial);

            // Delete is okay as these shallow copies are not yet part
            // of the state. 
            delete newTrial['name'];
            delete newTrial['id'];

            // Add the new properties
            newTrial['id'] = currentID;
            newTrial['name'] = newName;

            // Create the new trial table
            var newTable = Object.assign({}, state.trialTable);
            newTable[currentID] = newTrial;

            // Create the new trial order
            var newOrder = [
                ...state.trialOrder,
                String(currentID)
            ]
            // Create the new state
            var newState = Object.assign({}, state);

            // Remove old properties
            delete newState['trialTable'];
            delete newState['trialOrder'];

            // Add new properties
            newState['trialTable'] = newTable;
            newState['trialOrder'] = newOrder;

            // Increment the currentID
            currentID = currentID + 1;

            return newState;
            
        case 'REMOVE_TRIAL':
            // Create deep copy of the state.
            var newState = Object.assign({}, state);

            // List of trials to be removed
            var removeList = Object.keys(state.trialTable);

            var newOrder = [ ...state.trialOrder];

            delete newState['trialOrder']
            // Find and remove all the selected trials
            for(var i = 0; i < removeList.length; i++){
                if (state.trialTable[removeList[i]].selected) {    
                    delete newState.trialTable[removeList[i]]; 
                    var index = newOrder.indexOf(removeList[i]);
                    newOrder = [
                        ...newOrder.slice(0, index),
                        ...newOrder.slice(index+1)
                    ]
                }
            }

            // If all the trial are removed add the default trial
            if (Object.keys(newState.trialTable).length == 0){
                newState.trialTable = {
                    [Trial.id]: Trial
                }
                newOrder = [
                    Trial.id
                ]
            }

            // Assign new trialTable and trialOrder
            newState['trialOrder'] = newOrder;
            return newState;
        case 'OPEN_DRAWER':
            var newState = Object.assign({}, state);
            delete newState['openTrial'];
            newState['openTrial'] = action.id;
            return newState;

        case 'CLOSE_DRAWER':
            // Create the new state
            var newState = Object.assign({}, state);
            delete newState['openTrial'];
            newState['openTrial'] = -1;
            return newState;

        case 'CHANGE_NAME':
            var newState = Object.assign({}, state);
            // action.name is the new name of the trial.
            newState.trialTable[newState.openTrial] = Object.assign({}, newState.trialTable[newState.openTrial]);
            newState.trialTable[newState.openTrial].name = action.name;
            return newState;

        case 'TOGGLE_ISTIMELINE':
            console.log("In reducer");
            var newState = Object.assign({}, state);
            if(newState.trialTable[newState.openTrial].isTimeline != false) {
                console.log("isTimeline");
            } else {
                console.log("isTrial");
            }
            return newState;
            
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
