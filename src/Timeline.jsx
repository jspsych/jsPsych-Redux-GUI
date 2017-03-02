import React from 'react';
import { render, Component, PropTypes } from 'react-dom';
import Avatar from 'material-ui/Avatar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
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
    toggleTimeline,
    store,              // The store
    state              // The current state of the store
}) => (
    <div>
    <Drawer
        draggable={false}
        isOpen={state.timelineOpen}
    >
        <AppBar 
            title={<div> Experimental Timeline"</div> }
            iconElementLeft={
                <ButtonMenu
                    draggable={false}
                    store={store}
                    state={state}
                />}
                iconElementRight={<IconButton> <NavigationClose /> </IconButton>}
                onRightIconButtonTouchTap={toggleTimeline}
            />
            <SelectableTrialList
                draggable={false}
                store={store}
                state={state}
            />
        </Drawer>
    
            <PluginDrawer
                draggable={false}
                store={store}
                state={state}
                openTrial={state.openTrial}
            />
    </div>
);

export default Timeline;
