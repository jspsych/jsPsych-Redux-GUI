import React from 'react';
import { render } from 'react-dom';
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';


import { timeline } from 'reducers';


const actionSelectTrial = (key) =>{
    store.dispatch({
        type: 'SELECT_TRIAL',
        index: key
    });
}
const actionAddTrial = () => {// Dispatch the action calling for a new trial to be added
    store.dispatch({
        type: 'ADD_TRIAL'
    });
}
const actionRemoveTrial = () => {
    var state = store.getState();
    store.dispatch({
        type: 'REMOVE_TRIAL',
        index: state.selected
    })
}
