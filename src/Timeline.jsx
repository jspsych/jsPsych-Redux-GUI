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

import injectTapEventPlugin from 'react-tap-event-plugin';

// Initialize the T.E.P. necerssay for using "onTouchTap"
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

const Timeline = ({
    trialList,
    addTrial,
    removeTrial
}) => (
        <div>
            <title>  What's Up? </title>
            <div> {trialList} </div>
            <div>
                <FloatingActionButton style={addStyleFAB} onTouchTap={addTrial}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
            <br />
            <div>
                <FloatingActionButton style={removeStyleFAB} onTouchTap={removeTrial}>
                    <ContentRemove />
                </FloatingActionButton>
            </div>
        </div>
    );

export default Timeline;