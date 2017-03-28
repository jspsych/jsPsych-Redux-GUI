// Archive the current state
// This action should be called by every other action before it
// calls it's reducer.
export const actionArchiveState = (store) => {
    var state = store.getState();
    if (state.pastStates.length >= 50) 
    {
        store.dispatch({
            type: 'ARCHIVE_STATE_REMOVE'
        })
    } 
    else 
    {
        store.dispatch({
            type: 'ARCHIVE_STATE'
        })
    }
}
// Restores the state from an past state
// archiving the current state as a future state
export const actionRestoreState = (store) => {
    var state = store.getState();
    if (state.futureStates.length >= 50) 
    {
        store.dispatch({
            type: 'RESTORE_STATE_REMOVE'
        })
    } 
    else if (state.pastStates.length > 0) 
    {
        store.dispatch({
            type: 'RESTORE_STATE'
        })
    }
    // Do nothing if there are no more states in the history
}
// Action calling for the state to be restored from a future state
export const actionRestoreFutureState = (store) => {
    var state = store.getState();

    if (state.futureStates.length > 0) 
    {
        store.dispatch({
            type: 'RESTORE_FUTURE_STATE'
        })
        // Do nothing if there are no more states in the history
    }
}
// Action calling for a trial to be selected
export const actionToggleSelected = (store, trialID) => {
    actionArchiveState(store);
    //console.log("Select", store)
    var state = store.getState();

    if (state.trialTable[trialID].selected){
        store.dispatch({
            type: 'DESELECT_TRIAL',
            id: trialID
        })
        actionCloseDrawer(store);
    } else {
        store.dispatch({
            type: 'SELECT_TRIAL',
            id: trialID
        });
        actionOpenDrawer(store, trialID);
    }
}
// Action calling for a new trial to be added
export const actionAddTrial = (store) => {
    actionArchiveState(store);
    //console.log ("Add", store)
    store.dispatch({
        type: 'ADD_TRIAL'
    });
}
// Action calling for a trial to be removed from trialList
export const actionRemoveTrial = (store) => {
    var state = store.getState();

    console.log("Archive State: ", state);
    actionArchiveState(store);

    //console.log("Remove", store)
    var state = store.getState();
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected
    });
}
// Action calling for a Drawer to be opened
export const actionOpenDrawer = (store, id) => {
    store.dispatch({
        type: 'OPEN_DRAWER',
        id: id
    })
}
export const actionCloseDrawer = (store) => {
    store.dispatch({
        type:'CLOSE_DRAWER'
    });
}
// Move a trial from one position to another
export const actionMoveTrial = (store) => {
    actionArchiveState(store);
    var state = store.getState();

    console.log("MoveTrial");
    store.dispatch({
        type: 'MOVE_TRIAL',
        fromPos: state.dragged,
        toPos: state.over
    });
}
// Action calling for the name of a trial to be changed
export const actionChangeName = (store, trialName) => {
    actionArchiveState(store);
    store.dispatch({
        type: 'CHANGE_NAME',
        name: trialName
    });
}
// ?
export const actionToggleButton = (store, buttonVal) => {
    var state = store.getState();

    // Not sure what's happening here but the state should
    // only be modified in reducers and not in this manner
    // state.trialTable[state.openTrial].isTimeline = buttonVal;
    console.log(state.trialTable[state.openTrial].isTimeline);
    store.dispatch({
        type: 'TOGGLE_ISTIMELINE'
    })
}

export const actionPluginChange = (store, val) => {
    store.dispatch({
        type: 'PLUGIN_CHANGE',
        pluginVal: val
    });
}
// ?
export const actionToggleIsTimeline = (store) => {
    actionArchiveState(store);
    var state = store.getState();
    // The state shouldn't be mutated or altered directly 
    console.log(state.trialTable[state.openTrial].isTimeline);

    // Handle the logic in the action
    if(state.trialTable[state.openTrial].isTimeline === false) {
        store.dispatch({
            type: 'MAKE_TIMELINE'
        })
    } else {
        store.dispatch({
            type: 'MAKE_TRIAL'
        })
    }
}
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
        })
}
// Action calling for a child to be added to the currently selected timeline
export const actionAddChild = (store, trialID) => {
    if (trialID !== -1) {
        actionArchiveState(store);
        store.dispatch({
            type: 'ADD_CHILD_TRIAL',
            ID: trialID 
        })
    }
}
// Action calling for dragged to be set as the store's dragged prop
export const actionSetDragged = (store, dragged) => {
    store.dispatch({
      type: 'SET_DRAGGED',
        dragged: dragged
    })
}
// Action calling for over to be set as the store's over prop
export const actionSetOver = (store, over) =>{
    store.dispatch({
        type: 'SET_OVER',
        over: over
    })
}
