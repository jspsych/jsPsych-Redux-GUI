var React = require('react');
import { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PluginDrawer from 'PluginDrawer';
import Toggle from 'material-ui/Toggle';

import {actionPluginChange, actionParamChange} from 'actions';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';

const styleToggle = {
    maxWidth: 200,
    top: 20
}

const styleSelectField = {
  top: 15
}

class PluginForm extends React.Component {

    handleChangePlug(e, i, val) {
        actionPluginChange(this.props.store, val);
    }

    handleParamChange(e, val) {
        actionParamChange(this.props.store, val);
    }


    render() {
        var i = 0;
        const pluginItems = Object.keys(jsPsych.plugins).map((plugin) =>
            <MenuItem 
            primaryText={plugin}
            key={plugin}
            value={plugin} />
            );
//      console.log("InPlug");
//
if(this.props.state.openTrial != -1) {
 //       console.log("After Plug");
 //defaultValue={getPlugVal.info.parameters[plug].default}
 if(this.props.state.trialTable[this.props.state.openTrial].isTimeline != true) {
    var getPlugVal = jsPsych.plugins[this.props.state.trialTable[this.props.state.openTrial].pluginVal];
    //Displays parameters of plugin type
    const plugForm = Object.keys(getPlugVal.info.parameters).map((plug) => {
        switch(getPlugVal.info.parameters[plug].type[0]) {
            case 0: 
                return (<Toggle id={plug} label={plug} defaultToggled={true} style={styleToggle} onToggle={this.handleParamChange.bind(this)} />);
                break;
            case 1: 
                return (<TextField id={plug} key={plug} defaultValue={this.props.state.trialTable[this.props.state.openTrial].paramVal} floatingLabelText={plug} style={styleSelectField} onChange={this.handleParamChange.bind(this)} />);
                break;
            case 2: 
                return (<TextField id={plug} key={plug} defaultValue={this.props.state.trialTable[this.props.state.openTrial].paramVal} floatingLabelText={plug} style={styleSelectField} onChange={this.handleParamChange.bind(this)} />);
                break;
            case 3:
                return (<TextField id={plug} key={plug} defaultValue={this.props.state.trialTable[this.props.state.openTrial].paramVal} floatingLabelText={plug} style={styleSelectField} onChange={this.handleParamChange.bind(this)} />);
                break;
            case 5:
                return (<TextField id={plug} key={plug} defaultValue={this.props.state.trialTable[this.props.state.openTrial].paramVal} floatingLabelText={plug} style={styleSelectField} onChange={this.handleParamChange.bind(this)} />);
                break;
            case 6:
                return (<SelectField id={plug} defaultValue={this.props.state.trialTable[this.props.state.openTrial].paramVal} floatingLabelText={plug} style={styleSelectField} onChange={this.handleParamChange.bind(this)} />);
                break;
            default:
                return (<TextField id={plug} key={plug} defaultValue={plug} floatingLabelText={plug} style={styleSelectField} onChange={this.handleParamChange.bind(this)} />);
        }
    });
        
    var form = <div><SelectField
    value={this.props.state.trialTable[this.props.state.openTrial].pluginVal} 
    autoWidth={true}     
    floatingLabelText="Trial Type"
    maxHeight={300} 
    style={styleSelectField}
    onChange={this.handleChangePlug.bind(this)} >
    {pluginItems}
    </SelectField>
    {plugForm}
    </div>;
}
        } else {
            var plugForm = <div></div>;
        }
        return (
            <div>
            {form}
            </div>
            );
    }
}

export default PluginForm; 
