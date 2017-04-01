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
// REMOVE_TRIAL
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
            type: 'MAKE_TIMELINE'
        });
    } else {
        store.dispatch({
            type: 'MAKE_TRIAL'
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
    if (trialID !== -1) {
        actionArchiveState(store);
        store.dispatch({
            type: 'ADD_CHILD_TRIAL',
            ID: trialID
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
        store.dispatch({
            type: 'MOVE_TRIAL',
            fromPos: state.dragged,
            toPos: state.over
        });

        // If the trial is being moved to the top level
        if(state.trialTable[state.over].parentTrial === -1) {
            var newPos = state.trialOrder.indexOf(state.over);
            store.dispatch({
                type: 'INSERT_INTO_TRIALORDER',
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
