import React from 'react';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import PluginDrawer from 'PluginDrawer';
import ButtonMenu from 'ButtonMenu';
import SelectableTrialList from 'SelectableList';

const timelineTitleFAB = {
    marginLeft: 40,
    position: 'absolute'
}

// The "dump" Component for the Timeline of experimental trials
const Timeline = ({
    timelineOpen,
    toggleTimeline,
    store,              // The store
    state              // The current state of the store
}) => (
<div>
  <Drawer
    docked={true}
    width={350}
    openSecondary={false}
    open={timelineOpen}
  >
    <AppBar
      title={
                <div style={timelineTitleFAB}>
                  Experimental Timeline
                </div>
            }
            iconElementLeft={
                <ButtonMenu
                  store={store}
                  state={state}
                />
 }
 iconElementRight={<IconButton>
   <NavigationClose />
 </IconButton>}
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
    <ButtonMenu
      draggable={false}
      store={store}
      state={state}
    />
  </div>
);

export default Timeline;
