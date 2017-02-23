import React from 'react';
import { render, Component, PropTypes } from 'react-dom';
import PluginDrawer from 'PluginDrawer';
import ButtonMenu from 'ButtonMenu';
import SelectableTrialList from 'SelectableList';



// Style Variables
const paperStyle = { height: window.innerHeight * 0.9 };


// Check if the given drawer should be open
const checkDrawerStatus = (store, name) => {
    var state = store.getState();
    return
}

// The "dump" Component for the Timeline of experimental trials
const Timeline = ({
    store,              // The store
    state              // The current state of the store
}) => (
    <div>
    <title>  Experimental Timeline </title>

    <SelectableTrialList
    store={store}
    state={state}
    />

    <PluginDrawer
    store={store}
    state={state}
    openTrial={state.openTrial}
    />

    <ButtonMenu 
    store={store}
    state={state}
    />
    </div>
);

export default Timeline;
