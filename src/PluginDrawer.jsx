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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
//import PluginForm from 'PluginForm';

import {actionCloseDrawer, actionChangeName, actionToggleButton} from 'actions';
const removeStyleFAB = {
    marginRight: 20,
    position: 'absolute',
    bottom: window.innerHeight * 0.1,
    right: window.innerWidth * 0.1
}

const inline = {
    display: 'flex',
    position: 'absolute',
    marginRight: 150
}

// Class for handling the pluginDrawer and its contents
class PluginDrawer extends React.Component {
    close(){
        actionCloseDrawer(this.props.store);
    }
    handleChange(e, newValue) {
        actionChangeName(this.props.store, newValue);
    }
    handleButtonChange(e, toggleButton) {
        actionToggleButton(this.props.store, toggleButton);
    }

    render() { // Could depend on if there are any trials in the selected list
        var i = 0;
        const pluginItems = Object.keys(jsPsych.plugins).map((plugin) =>
        <MenuItem 
        primaryText={plugin}
        value={i++} />
        );
        console.log(this.props.state.trialTable);
        if(this.props.openTrial !== -1){
            if(this.props.state.trialTable[this.props.state.openTrial].isTimeline != true) {
                console.log(this.props.pluginVal);
                var form = <div><SelectField
                value={this.props.pluginVal} 
                autoWidth={true}
                floatingLabelText="Trial Type"
                maxHeight={300} 
                onChange={this.handleChange.bind(this)} >
                {pluginItems}
                </SelectField>
                </div>
            } else {
                var form = <div></div>
            }
            var inside = <div><TextField 
            value={this.props.state.trialTable[this.props.state.openTrial].name} 
            id="trial text"
            underlineShow={false}
            onChange={this.handleChange.bind(this)} />
            <RadioButtonGroup
            name="toggleIsTimeline"
            defaultSelected={false}
            style={inline}
            onChange={this.handleButtonChange.bind(this)} >
                <RadioButton
                value={false}
                label="Trial" />
                <RadioButton
                value={true}
                label="Timeline"/>
            </RadioButtonGroup>
            {form}
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