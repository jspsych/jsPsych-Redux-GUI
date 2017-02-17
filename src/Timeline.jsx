import React from 'react';
import { render, Component, PropTypes } from 'react-dom';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import SelectableTrialList from 'SelectableList';
import PluginDrawer from 'PluginDrawer';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {actionAddTrial, actionOpenDrawer } from 'actions';


// Initialize the T.E.P. necessay for using "onTouchTap"
injectTapEventPlugin();

// Style Variables
const paperStyle = { height: window.innerHeight * 0.9 };

const addStyleFAB = {
    marginRight: 20,
    position: 'absolute',
    bottom: window.innerHeight * 0.1,
    left: window.innerWidth * 0.1
}

const removeStyleFAB = {
    marginRight: 20,
    position: 'absolute',
    bottom: window.innerHeight * 0.1,
    right: window.innerWidth * 0.1
}

// Check if the given drawer should be open
const checkDrawerStatus = (store, name) => {
    var state = store.getState();
    return
}

// The "dump" Component for the Timeline of experimental trials
const Timeline = ({
    store,              // Object: The current state of the store
    state,
    //trialList,          // List: The list containing each trial in the current experiment
    //trialOrder,
    //openDrawer        // List: The names of all the drawers that are currently open
    //    selected,           // Integer: The curently selected trial in the list. Default=1
    //    onSelect,           // Action: Sets the value of selected
        onAdd,              // Action: Adds a trial
        onRemove            // Action: Removes the trial whose index === selected
}) => (
    <div>
    <title>  Experimental Timeline </title>
    <SelectableTrialList
    store={store}
    state={state}
    />
    <PluginDrawer
    storeState={store}
    openDrawers={state.openDrawer}
    />

    <FloatingActionButton
    style={addStyleFAB}
    onTouchTap={onAdd}>
    <ContentAdd />
    </FloatingActionButton>
    </div>
);

export default Timeline;

/*            <FloatingActionButton
                style={removeStyleFAB}
                onTouchTap={onRemove}>
                <ContentRemove />
            </FloatingActionButton>
*/
