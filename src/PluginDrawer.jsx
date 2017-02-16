var React = require('react');
import { Component, PropTypes } from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Drawer from 'material-ui/Drawer';

// Class for handling the pluginDrawer and its contents
class PluginDrawer extends React.Component {
    render() { // Could depend on if there are any trials in the selected list
        return (
            <Drawer
                width={500}
                openSecondary={true}
                open={this.props.openDrawers.includes("pluginDrawer")}>
                <div>
                    Stuff
                </div>
            </Drawer>
        ) // Stuff to be rendered inside the drawer could be included above 
    }
}

export default PluginDrawer;
