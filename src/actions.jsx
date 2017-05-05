// Archive the current state
// This action should be called by every other action before it
// calls it's reducer.
// Affects: pastStates, futureStates
export const actionArchiveState = (store) => {
    var state = store.getState();
    if (state.pastStates.length >= 50)
    {
        store.dispatch({
            type: 'ARCHIVE_STATE_REMOVE',
            state: state,
            store: store
        });
    }
    else
    {
        store.dispatch({
            type: 'ARCHIVE_STATE',
            state: state,
            store: store
        });
    }
};
// Restores the state from an past state
// archiving the current state as a future state
// Affects: futureState, pastStates
export const actionRestoreState = (store) => {
    var state = store.getState();
    if (state.futureStates.length >= 50) 
    {
        store.dispatch({
            type: 'RESTORE_STATE_REMOVE'
        });
    } 
    else if (state.pastStates.length > 0) 
    {
        store.dispatch({
            type: 'RESTORE_STATE'
        });
    }
    // Do nothing if there are no more states in the history
};
// Action calling for the state to be restored from a future state
// Affects: futureStates, pastStates
export const actionRestoreFutureState = (store) => {
    var state = store.getState();

    if (state.futureStates.length > 0)
    {
        store.dispatch({
            type: 'RESTORE_FUTURE_STATE'
        });
        // Do nothing if there are no more states in the history
    }
};
// Action calling for a trial to be selected
// Affects: trialTable, openTrial
export const actionToggleSelected = (store, trialID) => {
    actionArchiveState(store);
    //console.log("Select", store)
    var state = store.getState();

    if (state.trialTable[trialID].selected){
        store.dispatch({
            type: 'DESELECT_TRIAL',
            id: trialID
        });
        actionCloseDrawer(store);
    } else {
        store.dispatch({
            type: 'SELECT_TRIAL',
            id: trialID
        });
        actionOpenDrawer(store, trialID);
    }
};
// Action calling for a new trial to be added
// Affects: trialTable, trialOrder
export const actionAddTrial = (store) => {
    // Archive the previous state
    actionArchiveState(store);

    // Get the state
    var state = store.getState();

    // New trial's unique id
    var index = Math.random();

    // Ensure there are no duplicate trial names 
    while(state[index.toString()] != undefined){
        index = Math.random();
    }

    //console.log ("Add", store)
    store.dispatch({
        type: 'ADD_TRIAL',
        id: index
    });
};
// Action calling for a new trial to be added with the same properties
// as the currently selected trial
// Affects: trialTable, trialOrder
export const actionDuplicateTrial = (store) => {
    actionArchiveState(store);

    // Get the state
    var state = store.getState();

    // When there is an open trial
    if (state.openTrial !== -1)
    {

        // Get the trial to be copied from
        var toCopy = state.openTrial;

        // Create the new trial's name
        var newName = state.trialTable[toCopy].name.concat(' - Copy');

        // New trial's unique id
        var index = Math.random();

        // Ensure there are no duplicate trial names 
        while(state.trialTable[index.toString()] != undefined){
            index = Math.random();
        }

        // If the trial being copied is in the top level
        if (-1 <  state.trialOrder.indexOf(toCopy))
        {
            console.log ('Call Dup');
            // Call the reducer
            store.dispatch({
                type: 'DUPLICATE_TRIAL',
                index: index,
                name: newName,
                copyFrom: toCopy
            });
        } 
        // Otherwise the trial is in someone's timeline
        else 
        {
            console.log("Call child sup");
            // Call the reducer
            store.dispatch({
                type: 'DUPLICATE_CHILD_TRIAL',
                index: index,
                name: newName,
                copyFrom: toCopy,
                parentTrial: state.trialTable[toCopy].ancestry[0]
            });
        }
    }
};
// Action calling for a trial to be removed from trialList
// Affects: trialTable, trialOrder
export const actionRemoveTrial = (store) => {
    var state = store.getState();

    // Call back predicate for use by filter
    const isSelected = (trialID) => {
        state.trialTable[trialID].selected;
    };
    // List of trials to be removed
    var removeList = Object.keys(state.trialTable);
    removeList = removeList.filter(isSelected);

    actionArchiveState(store);
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected,
        state: state,
        toRemove: removeList
    });
};
// ?
export const actionOpenDrawer = (store, id) => {
    store.dispatch({
        type: 'OPEN_DRAWER',
        id: id
    });
};
// ?
export const actionCloseDrawer = (store) => {
    store.dispatch({
        type:'CLOSE_DRAWER'
    });
};
// Action calling for the name of a trial to be changed
export const actionChangeName = (store, trialName) => {
    actionArchiveState(store);
    var state = store.getState();
    store.dispatch({
        type: 'CHANGE_NAME',
        state: state,
        name: trialName
    });
};
// ?
export const actionToggleButton = (store) => {
    store.dispatch({
        type: 'TOGGLE_ISTIMELINE'
    });
};
// ?
export const actionPluginChange = (store, val) => {
    var state = store.getState();
    store.dispatch({
        type: 'PLUGIN_CHANGE',
        openTrial: state.openTrial,
        pluginVal: val
    });
};
// ?
export const actionToggleIsTimeline = (store) => {
    actionArchiveState(store);
    var state = store.getState();

    // Handle the logic in the action
    if(state.trialTable[state.openTrial].isTimeline === false) {
        store.dispatch({
            type: 'MAKE_TIMELINE',
            openTrial: state.openTrial
        });
    } else {
        store.dispatch({
            type: 'MAKE_TRIAL',
            openTrial: state.openTrial
        });
    }
};
// Action calling for the status of the timeline drawer to be toggled
// Affects: timelineOpen
export const actionToggleTimeline = (store) => {
    var state = store.getState();
    // If the timeline is open
    state.timelineOpen ?
        // Close it 
        store.dispatch({
            type: 'CLOSE_TIMELINE'
        }) :
        // Otherwise open it
        store.dispatch({
            type: 'CLOSE_TIMELINE'
        });
};
// Action calling for a child to be added to the currently selected timeline
// Affects: trialTable
export const actionAddChild = (store, trialID) => {
    // New trial's unique id
    var index = Math.random();
    var state = store.getState();

    // Ensure there are no duplicate trial names 
    while(state[index.toString()] != undefined){
        index = Math.random();
    }
    if (trialID !== -1) {
        actionArchiveState(store);
        store.dispatch({
            type: 'ADD_CHILD_TRIAL',
            ID: trialID,
            index: index
        });
    }
};
// Action calling for a child to be removed from its parent timeline
// Affects: trialTable, trialOrder
export const actionRemoveChild = (store, trialID) => {
    if (trialID !== -1){
        var state = store.getState();
        actionArchiveState(store);

        if (state.trialTable[trialID].parentTrial === -1) {
            store.dispatch({
                type: 'REMOVE_TRIAL_FROM_TRIALORDER',
                id: trialID
            });
        }

        store.dispatch({
            type: 'REMOVE_CHILD_TRIAL',
            ID: trialID
        });
    }
};
// Action calling for dragged to be set as the store's dragged prop
// Affects: dragged
export const actionSetDragged = (store, dragged) => {
    store.dispatch({
        type: 'SET_DRAGGED',
        dragged: dragged
    });
};
// Action calling for over to be set as the store's over prop
// Affects: over
export const actionSetOver = (store, over) =>{
    store.dispatch({
        type: 'SET_OVER',
        over: over
    });
};
// Move a trial from one position to another
// Affects: trialTable, trialOrder
export const actionMoveTrial = (store) => {
    actionArchiveState(store);
    var state = store.getState();
    var found = state.trialTable[state.over].ancestry.indexOf(state.dragged);
    if (state.dragged === state.over || found) {
        // Allow printing to the console
        // eslint-disable-next-line no-console
        console.log ('Illegal move of parent into child');
    } else {

    // state.dragged is the ID of the trial to be moved

        //////// Handle removing the trial from its old location ////////


        // If the trial is being moved from the top level
        if (state.trialTable[state.dragged].parentTrial === -1) {
        store.dispatch({
            type: 'REMOVE_TRIAL_FROM_TRIALORDER',
            ID: state.dragged
        })
        }
        // Otherwise the trial is in a timeline
        else {
        store.dispatch({

        })
        }

        ////////// Handle Inserting the trial into its new location ///////////

        // state.over is the trial, state.dragged was dropped over
        // indicating where that trial is to be moved to

        // If the trial is being moved to the top level
        if(state.trialTable[state.over].parentTrial === -1) {
            var newPos = state.trialOrder.indexOf(state.over);
            // This reducer affects trialOrder
            store.dispatch({
                type: 'INSERT_INTO_TRIALORDER',
                trial: state.dragged,
                id: state.over,
                insertIndex: newPos
            });
        }
        else {
            var newPos = state.trialOrder.indexOf(state.over);
            // This reducer affects trialTable
            store.dispatch({
                type: 'INSERT_INTO_TIMELINE',
                trial: state.dragged,
                id: state.over,
                insertIndex: newPos
            });
        }

        // reset over and dragged 
        store.dispatch({
            type: 'RESET_OVER'
        });
        store.dispatch({
            type: 'RESET_DRAGGED'
        });
    }
};
//Changes value of plugin parameters
export const actionParamChange = (store, val) => {
        actionArchiveState(store);
        var state = store.getState();

        store.dispatch({
            type: 'PARAM_CHANGE',
            paramVal: val
        });
};
