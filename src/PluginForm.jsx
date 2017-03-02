var React = require('react');
import { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PluginDrawer from 'PluginDrawer';

class PluginForm extends React.Component {
	render() {
  	return (
  	<SelectField
      value={1}
      autoWidth={true}
      floatingLabelText="Trial Type"
      maxHeight={300} >
        <MenuItem value={1} primaryText="Single-Stim" />
    </SelectField>
    	);
  }
}

export default PluginForm; 