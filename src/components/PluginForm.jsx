var React = require('react');
import { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PluginDrawer from 'PluginDrawer';
import Toggle from 'material-ui/Toggle';

import {actionPluginChange} from 'actions';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';

const styleToggle = {
    maxWidth: 200
}

const styleSelectField = {
  top: 15
}

class PluginForm extends React.Component {

    handleChangePlug(e, i, val) {
        actionPluginChange(this.props.store, val);
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
 //
 if(this.props.state.trialTable[this.props.state.openTrial].isTimeline != true) {
    var l = console.log; 
    var getPlugVal = jsPsych.plugins[this.props.state.trialTable[this.props.state.openTrial].pluginVal];
    //Displays parameters of plugin type
    const plugForm = Object.keys(getPlugVal.info.parameters).map((plug) => 
        getPlugVal.info.parameters[plug].type.includes(jsPsych.plugins.parameterType.BOOL) ?
        (<Toggle label={plug} defaultToggled={true} style={styleToggle} />) 
        :
        (<TextField id="pluginForm" key={plug} value={plug} />));
    // const plugForm = Object.keys(getPlugVal.info.parameters).map((plug) => {
    //     console.log(getPlugVal.info.parameters[plug].getParameterType);
    //     switch(getPlugVal.info.parameters[plug].type.includes()) {
    //         case jsPsych.plugins.parameterType.BOOL: 
    //             <Toggle label={plug} defaultToggled={true} style={styleToggle} />;
    //             break;
    //         default:
    //             <TextField id="pluginForm" key={plug} value={plug} />;
    //     }
    // });
        
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
