import React from 'react';
import { render } from 'react-dom';
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import Trial from 'Trial';

// This is the initial state of the store.
// Any new features of the store should be addded here.
const InitialState = {
    trialTable: {  [Trial.name]: Trial },
    trialOrder: [ 'default' ],	
    openDrawer: 'none',
    previousStates: [],
    futureStates: []
}

export default InitialState;
