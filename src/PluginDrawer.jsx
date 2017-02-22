var React = require('react');
import { Component, PropTypes } from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import Drawer from 'material-ui/Drawer';

import {actionCloseDrawer} from 'actions';
const removeStyleFAB = {
    marginRight: 20,
    position: 'absolute',
    bottom: window.innerHeight * 0.1,
    right: window.innerWidth * 0.1
}
// Class for handling the pluginDrawer and its contents
class PluginDrawer extends React.Component {
    close(){
        actionCloseDrawer(this.props.store);
    }
    render() { // Could depend on if there are any trials in the selected list
        return (
            <Drawer
            width={300}
            openSecondary={true}
            open={this.props.openTrial != -1}>
            <div>
            <FloatingActionButton
            style={removeStyleFAB}
            onTouchTap={this.close.bind(this)}>
            <ContentRemove />
            </FloatingActionButton>

            Stuff
            </div>
            </Drawer>
        ) // Stuff to be rendered inside the drawer could be included above 
    }
}

export default PluginDrawer;
