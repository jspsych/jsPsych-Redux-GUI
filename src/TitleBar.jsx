var React = require('react');
import { Component, PropTypes } from 'react';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import AppBar from 'material-ui/AppBar'; 
import { actionToggleSelected, actionHandleDrawer, actionAddTrial, actionMoveTrial, 
    actionRemoveTrial, actionRestoreState, actionRestoreFutureState } from 'actions';

const titleBarFAB = {
    position: 'absolute'
}
const menuFAB = {
    marginTop: 12,
    position: 'absolute'
    }
const TitleBar = ({
    store,
    state,
    toggleTimeline,
    timelineOpen
}) => (
    <AppBar
        title="jsPsych GUI"
        titleStyle={{textAlign: 'center'}}
        style={titleBarFAB}
        iconElementLeft={<NavigationMenu 
            style={menuFAB}
            onTouchTap={toggleTimeline}
            />}
    />
);
export default TitleBar;
