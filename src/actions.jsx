import React from 'react';
import { render } from 'react-dom';
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';


import { timeline } from 'reducers';


export const actionSelectTrial = (store, key) =>{
    store.dispatch({
        type: 'SELECT_TRIAL',
        index: key
    });
}
export const actionAddTrial = (store) => {// Dispatch the action calling for a new trial to be added
    store.dispatch({
        type: 'ADD_TRIAL'
    });
}
export const actionRemoveTrial = (store) => {
    var state = store.getState();
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected
    })
}
