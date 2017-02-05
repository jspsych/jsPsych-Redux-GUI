import React from 'react';
import { render } from 'react-dom';
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { timeline } from 'reducers';


export const actionSelectTrial = (store, key) =>{
    //console.log("Select", store)
    store.dispatch({
        type: 'SELECT_TRIAL',
        index: key
    });
}
export const actionSelectAdditionalTrial = (store, key) =>{
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

export const actionRemoveTrial = (store) => {
    //console.log("Remove", store)
    var state = store.getState();
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected
    })
}
