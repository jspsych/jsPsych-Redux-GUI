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
import injectTapEventPlugin from 'react-tap-event-plugin';

// Initialize the T.E.P. necessay for using "onTouchTap"
injectTapEventPlugin();

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

// The "dump" Component for the Timeline of experimental trials
const Timeline = ({
    store,
    trialList,          // List: The list containing each trial in the current experiment
    selected,           // Integer: The curently selected trial in the list. Default=1
    onSelect,           // Action: Sets the value of selected
    onAdd,              // Action: Adds a trial
    onRemove            // Action: Removes the trial whose index === selected
}) => (
        <div>
            <title>  Experimental Timeline </title>
            <SelectableTrialList store={store} list={trialList} selected={selected} onTap={onSelect} />
            <FloatingActionButton style={addStyleFAB} onTouchTap={onAdd}>
                <ContentAdd />
            </FloatingActionButton>
            <FloatingActionButton style={removeStyleFAB} onTouchTap={onRemove}>
                <ContentRemove />
            </FloatingActionButton>
        </div>
    );

export default Timeline;