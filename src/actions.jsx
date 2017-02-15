import React from 'react';
import { render } from 'react-dom';
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { timeline } from 'reducers';

// Dispatch the action calling for a trial to be selected
export const actionSelectTrial = (store, key) => {
    //console.log("Select", store)
    store.dispatch({
        type: 'SELECT_TRIAL',
        index: key
    });
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
}

// Dispatch action calling for a trial to be removed from trialList
export const actionRemoveTrial = (store) => {
    //console.log("Remove", store)
    var state = store.getState();
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected
    })
}

// Dispatch an action calling for a Drawer to be opened
export const actionHandleDrawer = (store, drawerName) => {
    var state = store.getState();

    // If a trial is selected open the drawer
    if (state.selected.length > 0) 
    {
        store.dispatch({
            type: 'OPEN_DRAWER',
            name: drawerName
        })
    } 
    else // If no trial is selected close the plugin drawer
    {
        store.dispatch({
            type: 'CLOSE_DRAWER',
            name: drawerName
        })
    }

}
