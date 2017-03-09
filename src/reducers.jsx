// This is the initial state of the store.
// Any new features of the store should be addded here.
const Trial = {
    id: 0, 
    name: "default",
    isTimeline: false,
    timeline: [],
    trialType: "trialType",
    parentTrial: -1,
    ancestryHeight: 0,
    selected: false 
}

const InitialState = {
    trialTable: {  [Trial.id]: Trial },
    trialOrder: [ '0' ],	
    openTrial: -1,
    timelineOpen: true,
    pastStates: [],
    dragged: null,
    over: null,
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
            var index = Math.random();//Object.keys(state.trialTable).length;

            // Ensure there are no duplicate trial names 
            while(state.trialTable[index.toString()] != undefined){
                index = Math.random(); 
            }

            // New trial's name 
            var newName = "Trial_" + Object.keys(state.trialTable).length;           

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
            newTable[index] = newTrial;

            // Create the new trial order
            var newOrder = [
                ...state.trialOrder,
                String(index)
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
            // Create deep copy of the state.
            var newState = Object.assign({}, state);

            // List of trials to be removed
            var removeList = Object.keys(state.trialTable);

            var newOrder = [ ...state.trialOrder];

            // Find and remove all the selected trials
            for(var i = 0; i < removeList.length; i++){

                var trial = removeList[i];
                console.log("Trial", trial);

                if (state.trialTable[trial].selected) {    
                    // if the trial has children 
                    if (state.trialTable[trial].timeline.length > 0) {
                        // Delete the children 
                        for (var j = 0; j < state.trialTable[trial].length; j++) {
                            var child = state.trialTable[trial].timeline[j];
                            console.log("Delete Child: ", child);
                            delete newState.trialTable[child];
                        }
                        console.log("Returned state: ", newState);
                    }

                    console.log("State: ", state);
                    // IF the trial is in the top level
                    if (state.trialTable[trial].parentTrial == -1){
                        var index = newOrder.indexOf(trial);
                        newOrder = [
                            ...newOrder.slice(0, index),
                            ...newOrder.slice(index+1)
                        ];
                    } 
                    
                    // Otherwise it's a child
                    else 
                    {
                        var parent = state.trialTable[trial].parentTrial;
                        var newParent = state.trialTable[parent];
                        var childIndex = newParent.timeline.indexOf(trial); 
                        var newChildren = [
                            ...newParent.timeline.slice(0, childIndex),
                            ...newParent.timeline.slice(childIndex+1)
                        ]; 

                        delete newParent['timeline'];
                        newParent['timeline'] = newChildren;
                        delete newState.trialTable[parent];
                        newState.trialTable[parent] = Object.assign({}, newParent);
                    }
                    
                    delete newState.trialTable[trial]; 
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

            delete newState['trialOrder']
            // Assign new trialTable and trialOrder
            newState['trialOrder'] = newOrder;
            return newState;
        case 'ADD_CHILD_TRIAL':
            // New trial's unique id
            var index = Math.random();//Object.keys(state.trialTable).length;

            // Ensure there are no duplicate trial names 
            while(state.trialTable[index.toString()] != undefined){
                index = Math.random(); 
            }

            // New trial's name 
            var newName = "Trial_" + Object.keys(state.trialTable).length;           

            // Make the new trial from the default template.
            var newTrial = Object.assign({}, Trial);

            // Make the new Table
            var newTable = Object.assign({}, state.trialTable);
            // Delete is okay as these shallow copies are not yet part
            // of the state. 
            delete newTrial['name'];
            delete newTrial['id'];
            delete newTrial['parentTrial'];
            delete newTrial['ancestryHeight'];

            // Add the new properties
            newTrial['id'] = String(index);
            newTrial['name'] = newName;
            newTrial['parentTrial'] = action.ID; newTrial['ancestryHeight'] = state.trialTable[action.ID].ancestryHeight + 1;

            console.log("New Child", newTrial);
            // Add the new trial to the trial table
            newTable[index] = newTrial;

            // Create the new child timeline 
            var newChildren = [
                ...state.trialTable[action.ID].timeline,
                newTrial.id
                ];

            // Create the new parent
            var newParent = Object.assign({}, state.trialTable[action.ID]);
            // Delete its old children
            delete newParent['timeline'];
            // Assign the new Children
            newParent['timeline'] = newChildren;
            
            // Delete the old parent Trial
            delete newTable[action.ID];
            // Assign the new parent 
            newTable[action.ID] = newParent;

            // Create the new state
            var newState = Object.assign({}, state);

            // Remove old properties
            delete newState['trialTable'];

            // Add new properties
            newState['trialTable'] = newTable;

            return newState;
        case 'MOVE_TRIAL':
            console.log("From: ", action.fromPos, " To: ", action.toPos);

            var newState = Object.assign({}, state);

            //////// UPDATE WHERE THE TRIAL IS MOVED FROM ////////

            // If fromPos and toPos are the same don't do anything
            if (action.fromPos === action.toPos){
                return newState;
            }
            // If the trial is being moved from the top level

            else if (state.trialTable[action.fromPos].parentTrial === -1) {
                var newOrder = [ 
                    ...state.trialOrder.slice(0, state.trialOrder.indexOf(action.fromPos)),
                    ...state.trialOrder.slice(state.trialOrder.indexOf(action.fromPos)+1)
                ]

                delete newState['trialOrder'];

                // Assign new trialOrder
                newState['trialOrder'] = newOrder;
                console.log("NewOrder before move", newOrder);
            } 
            else // Otherwise it's being moved from a parent  
            {
                // Modify the parent
                var parent = state.trialTable[action.fromPos].parentTrial;
                console.log("Parent before", parent);
                var oldTimeline = state.trialTable[parent].timeline;
                console.log("oldChilren before", oldTimeline);

                // Update the Parent
                var newTimeline = [
                    ...oldTimeline.slice(0, oldTimeline.indexOf(action.fromPos)),
                    ...oldTimeline.slice(oldTimeline.indexOf(action.fromPos)+1)
                ];
                console.log("newTimeline before:", newTimeline);
                var newParent = Object.assign({}, state.trialTable[parent]);
                delete newParent['timeline'];
                newParent['timeline'] = newTimeline;
                
                console.log("New Parent", newParent);
                // Update the trial table with the modified parent
                delete newState.trialTable[parent];
                newState.trialTable[parent] = Object.assign({}, newParent);
            }

            //////// UPDATE WHERE THE TRIAL IS MOVED TO ////////

            // If the trial is being moved to the top level
            if(newState.trialTable[action.toPos].parentTrial === -1) {
                console.log("Move to top level");
                var newPos = state.trialOrder.indexOf(action.toPos);
                var newOrder = [
                    ...newState.trialOrder.slice(0, newPos),
                    action.fromPos,
                    ...newState.trialOrder.slice(newPos)
                ];
                
                // Update the properties of the trial
                var newTrial = Object.assign({}, state.trialTable[action.fromPos]);
                delete newTrial['parentTrial'];
                delete newTrial['ancestryHeight'];
                newTrial['parentTrial'] = -1;
                newTrial['ancestryHeight'] = 0;
                
                // Update the trialTable
                var newTable = Object.assign({}, state.trialTable);
                delete newTable[action.fromPos];
                newTable[action.fromPos] = newTrial;

                // Update the state
                delete newState['trialOrder'];
                delete newState['trialTable'];
                newState['trialOrder'] = newOrder;
                newState['trialTable'] = Object.assign({}, newTable);

            }
            else // Otherwise the trial is being moved to a new parent
            {
                var parent = newState.trialTable[action.toPos].parentTrial;
                var oldTimeline = newState.trialTable[parent].timeline;
                var newTimeline = [
                    ...oldTimeline.slice(0, oldTimeline.indexOf(action.toPos)),
                    action.fromPos,
                    ...oldTimeline.slice(oldTimeline.indexOf(action.toPos))
                    ]
                console.log("NewTimeline", newTimeline);
                // Update the new Parent
                var newParent = Object.assign({}, newState.trialTable[parent]);
                delete newParent['timeline'];
                newParent['timeline'] = newTimeline;
                
                // Update the properties of the trial
                var newTrial = Object.assign({}, state.trialTable[action.fromPos]);
                delete newTrial['parentTrial'];
                delete newTrial['ancestryHeight'];
                newTrial['parentTrial'] = parent;
                newTrial['ancestryHeight'] = newParent.ancestryHeight + 1;
                
                // Update the trialTable
                var newTable = Object.assign({}, state.trialTable);
                delete newTable[action.fromPos];
                delete newTable[parent];
                newTable[action.fromPos] = newTrial;
                newTable[parent] = newParent;
                
                // Update the state
                delete newState['trialTable'];
                newState['trialTable'] = Object.assign({}, newTable);
            }
            // reset over and dragged 
            delete newState['over'];
            delete newState['dragged'];
            newState['over'] = null;
            newState['dragged'] = null;
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
        case 'MAKE_TRIAL':
            var newState = Object.assign({}, state);

            var newTrial = Object.assign({}, state.trialTable[state.openTrial]);
            // Delete and update the isTimeline property
            delete newTrial['isTimeline'];
            newTrial['isTimeline'] = false;

            // Delete the previous version of the trial
            delete newState.trialTable[state.openTrial];

            newState.trialTable[state.openTrial] = Object.assign({}, newTrial);
            return newState;
        case 'MAKE_TIMELINE':
            var newState = Object.assign({}, state);

            var newTrial = Object.assign({}, state.trialTable[state.openTrial]);
            // Delete and update the isTimeline property
            delete newTrial['isTimeline'];
            newTrial['isTimeline'] = true;

            // Delete the previous version of the trial
            delete newState.trialTable[state.openTrial];

            newState.trialTable[state.openTrial] = Object.assign({}, newTrial);
            return newState;
        case 'OPEN_TIMELINE':    
            var newState = Object.assign({}, state);
            delete newState['timelineOpen'];
            newState['timelineOpen'] = true;
            return newState;
        case 'CLOSE_TIMELINE':
            var newState = Object.assign({}, state);
            delete newState['timelineOpen'];
            newState['timelineOpen'] = false;
            return newState;
        case 'SET_DRAGGED':
            var newState = Object.assign({}, state);
            delete newState['dragged'];
            newState['dragged'] = action.dragged;
            return newState;
        case 'SET_OVER':
            var newState = Object.assign({}, state);
            delete newState['over'];
            newState['over'] = action.over;
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
