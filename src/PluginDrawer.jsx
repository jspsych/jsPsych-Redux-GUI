var React = require('react');
import { Component, PropTypes } from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';

import {actionCloseDrawer, actionChangeName} from 'actions';
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
    handleChange(e, newValue) {
        actionChangeName(this.props.store, newValue)
    }

    render() { // Could depend on if there are any trials in the selected list
        console.log(this.props.state.trialTable);
        console.log(this.props.state.openTrial);
        if(this.props.openTrial !== -1){
            var inside = <div><TextField 
            defaultValue={this.props.state.trialTable[this.props.state.openTrial].name}
            value={this.props.state.trialTable[this.props.state.openTrial].name} //e.target.value
            underlineShow={false}
            onChange={this.handleChange.bind(this)} />
            <div>
            <FloatingActionButton
            style={removeStyleFAB}
            onTouchTap={this.close.bind(this)}>
            <ContentRemove />
            </FloatingActionButton>
            </div>
            </div>
        } else { 
            var inside = <div></div>
        }
        return (
            <Drawer
            width={300}
            openSecondary={true}
            open={this.props.openTrial != -1}>
            {inside}
            </Drawer>
        ) // Stuff to be rendered inside the drawer could be included above 
    }
}

export default PluginDrawer;
