import React from 'react';
import { render } from 'react-dom';
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { timeline } from 'reducers';
// Archive the current state
// This action should be called by every other action before it
// calls it's reducer.
export const actionArchiveState = (store) => {
    store.dispatch({
        type: 'ARCHIVE_STATE'
    });
}
// Dispatch the action calling for a trial to be selected
export const actionSelectTrial = (store, trialName) => {
    //console.log("Select", store)
    store.dispatch({
        type: 'SELECT_TRIAL',
        name: trialName
    });
	actionOpenDrawer(store, 'pluginDrawer');
}

// Dispatch the action calling for an additional trial to be selected
export const actionSelectAdditionalTrial = (store, key) => {
    store.dispatch({
        type: 'SELECT_ADDITIONAL_TRIAL',
        index: key
    });
}
// Dispatch the action calling for a new trial to be added
export const actionAddTrial = (store) => {
    //console.log ("Add", store)
    store.dispatch({
        type: 'ADD_TRIAL'
    });
    
actioniOpenDrawer(store, 'pluginDrawer');
}

// Dispatch action calling for a trial to be removed from trialList
export const actionRemoveTrial = (store) => {
    //console.log("Remove", store)
    var state = store.getState();
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected
    });
    state = store.getState();

    if (state.trialOrder.length == 0){
        actionCloseDrawer(store);
    }
}

// Dispatch an action calling for a Drawer to be opened
export const actionOpenDrawer = (store, drawerName) => {
    var state = store.getState();
        store.dispatch({
            type: 'OPEN_DRAWER',
            name: drawerName
        })
}
export const actionCloseDrawer = (store) => {
    store.dispatch({
        type:'CLOSE_DRAWER'
    })
}
