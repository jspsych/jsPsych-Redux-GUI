// Archive the current state
// This action should be called by every other action before it
// calls it's reducer.
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
export const actionAddTrial = (store) => {
    actionArchiveState(store);
    //console.log ("Add", store)
    store.dispatch({
        type: 'ADD_TRIAL',
        store: store
    });
};
// Action calling for a trial to be removed from trialList
export const actionRemoveTrial = (store) => {
    var state = store.getState();

    actionArchiveState(store);
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected,
        state: state,
        store: store
    });
};
// Action calling for a Drawer to be opened
export const actionOpenDrawer = (store, id) => {
    store.dispatch({
        type: 'OPEN_DRAWER',
        id: id
    });
};
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
export const actionAddChild = (store, trialID) => {
    if (trialID !== -1) {
        actionArchiveState(store);
        store.dispatch({
            type: 'ADD_CHILD_TRIAL',
            ID: trialID,
            store: store
        });
    }
};
// Action calling for a child to be removed from its parent timeline
export const actionRemoveChild = (store, trialID) => {
    if (trialID !== -1){
        actionArchiveState(store);
        store.dispatch({
            type: 'REMOVE_CHILD_TRIAL',
            ID: trialID,
            store: store
        });
    }
};
// Action calling for dragged to be set as the store's dragged prop
export const actionSetDragged = (store, dragged) => {
    store.dispatch({
        type: 'SET_DRAGGED',
        dragged: dragged
    });
};
// Action calling for over to be set as the store's over prop
export const actionSetOver = (store, over) =>{
    store.dispatch({
        type: 'SET_OVER',
        over: over
    });
};
// Move a trial from one position to another
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
    }
};
