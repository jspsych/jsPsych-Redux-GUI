var React = require('react');
import { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PluginDrawer from 'PluginDrawer';

import {actionPluginChange} from 'actions';

class PluginForm extends React.Component {

  handleChange(e, i, val) {
    actionPluginChange(this.props.store, val);
  }

  render() {
  //   var paramLength = jsPsych.plugins.text.info.parameters.length;
  // for(var i = 0; i < paramLength; i++) {
  //   var objParam = jsPsych.plugins.text.info.parameters[i];
  //   console.log(objParam);
  //   var params = params + "<TextField>" + objParam + "</TextField>"; 
  //   console.log(params);
  // }
    var i = 0;
    const pluginItems = Object.keys(jsPsych.plugins).map((plugin) =>
    <MenuItem 
    primaryText={plugin}
    value={i++} />
    );

    var plugForm = this.props.state.trialTable[this.props.state.openTrial].pluginVal;
    //{plugin.plugForm}

    if(this.props.openTrial !== -1) {

      var plugForm = <div><SelectField
        value={this.props.pluginVal} 
        autoWidth={true}
        floatingLabelText="Trial Type"
        maxHeight={300} 
        onChange={this.handleChange.bind(this)} >
        {pluginItems}
        </SelectField>
        </div>
    } else {
      var plugForm = <div></div>
    }

    return (
    <div>
    {plugForm}
    </div>
      );
  }
}

export default PluginForm; 