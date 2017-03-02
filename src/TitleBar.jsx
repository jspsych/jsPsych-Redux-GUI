var React = require('react');
import { Component, PropTypes } from 'react';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import AppBar from 'material-ui/AppBar'; 
import { actionToggleSelected, actionHandleDrawer, actionAddTrial, actionMoveTrial, 
    actionRemoveTrial, actionRestoreState, actionRestoreFutureState } from 'actions';


const TitleBar = ({
    store,
    state
}) => (
    <AppBar
        title="jsPsych GUI"
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
        iconElementRight={<Avatar>jsP</Avatar>}
    />
);
export default TitleBar;
