import React from 'react';
import { render, Component, PropTypes } from 'react-dom';
import Avatar from 'material-ui/Avatar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Undo from 'material-ui/svg-icons/content/undo';
import Redo from 'material-ui/svg-icons/content/redo';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {actionAddTrial, actionRemoveTrial, actionRestoreState, actionRestoreFutureState } from 'actions';

// Initialize the T.E.P. necessay for using "onTouchTap"
injectTapEventPlugin();


const undoStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.15,
    left: window.innerWidth * 0.05
}

const redoStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.15,
    left: window.innerWidth * 0.15
}


const addStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.05,
    left: window.innerWidth * 0.05
}

const removeStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.05,
    left: window.innerWidth * 0.15
}

class ButtonMenu extends React.Component {
    add () { actionAddTrial(this.props.store); }
    remove () { actionRemoveTrial(this.props.store); }
    fastForward () { actionRestoreFutureState(this.props.store); }
    restore () { actionRestoreState(this.props.store); }
    render () {
        return (
            <div>
            <FloatingActionButton
            style={addStyleFAB}
            onTouchTap={this.add.bind(this)}>
            <ContentAdd />
            </FloatingActionButton>

            <FloatingActionButton
            style={removeStyleFAB}
            onTouchTap={this.remove.bind(this)}>
            <ContentRemove />
            </FloatingActionButton>

            <FloatingActionButton
            style={undoStyleFAB}
            onTouchTap={this.restore.bind(this)}>
            <Undo />
            </FloatingActionButton>

            <FloatingActionButton
            style={redoStyleFAB}
            onTouchTap={this.fastForward.bind(this)}>
            <Redo />
            </FloatingActionButton>
            </div>
        );
    }
}
export default ButtonMenu;
