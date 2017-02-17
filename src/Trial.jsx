import React from 'react';
import { render, Component, PropTypes } from 'react-dom'; 
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';


const Trial = {
        id: 0, 
        name: "default",
        isTimeline: false,
        timeline: [],
        trialType: "trialType",
        parentTrial: -1,
        selected: true
}

export default Trial;
