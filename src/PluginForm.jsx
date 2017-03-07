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


    return (
    <div>
    <SelectField
      value={1}
      autoWidth={true}
      floatingLabelText="Trial Type"
      maxHeight={300} 
      onChange={this.handleChange} >
         {pluginItems}
    </SelectField>
    </div>
      );
  }
}

export default PluginForm; 