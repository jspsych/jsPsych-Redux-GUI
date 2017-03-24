import React from 'react';
import { render, Component, PropTypes } from 'react-dom';
import PluginDrawer from 'PluginDrawer';
import ButtonMenu from 'ButtonMenu';
import SelectableTrialList from 'SelectableList';
import PluginForm from 'PluginForm';


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
    <div draggable={false}>
        <title draggable={false}>  Experimental Timeline </title>

        <SelectableTrialList
            draggable={false}
            store={store}
            state={state}
        />

    <PluginDrawer
        draggable={false}
        store={store}
        state={state}
        openTrial={state.openTrial}
    />

    <PluginForm
        store={store}
        state={state}
        pluginVal={state.pluginVal} />


<ButtonMenu
    draggable={false}
    store={store}
    state={state}
/>
    </div>
);

export default Timeline;
