import React from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import PluginParameterForm from 'PluginParameterForm';
import IconButton from 'material-ui/IconButton';

const toggleStylesBlock = { maxWidth: 400 };

const toggleStylesToggle = { marginBottom: 16 };

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))


const asyncValidate = (values/*, dispatch */) => {
  return sleep(1000) // simulate server latency
    .then(() => {
      if (['foo@foo.com', 'bar@bar.com'].includes(values.name)) {
        throw { name: 'Email already Exists' }
      }
    })
}


const validate = values => {
  const errors = {}
  const requiredFields = []//'name', 'type']
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })
  if (values.name && !/^[A-Z0-9]{2,4}$/i.test(values.name)) {
    errors.name = 'Invalid name'
  }
  return errors
}

const alignCenter = { textAlign: "center" };
var check = true;
const items = ['one', 'two', 'three'];

const TimelineForm = (props) => {
  console.log("TimelineForm", props);
  const {handleSubmit, pristine, reset, submitting} = props

  return (
    <form onSubmit={handleSubmit} style={alignCenter}>
      <div style={toggleStylesBlock}>
        <Toggle
          label="Timeline / Trial"
          defaultToggled={true}
          style={toggleStylesToggle}
          />
      </div>
      <div>
        <Field name="NameField" component={name =>
          <TextField hintText={props.name}
            floatingLabelText="Name of the Trial" 
            errorText={name.touched && name.error}
            {...name}
            />
        } />
      </div>
      <br />
      <div>
        <SelectField
          value={props.value}
          onChange={props.handleChange}
          maxHeight={300}
          floatingLabelText="Trial Type">
          {props.items}
        </SelectField>
      </div>
      <br />
      <PluginParameterForm currentTrialType={props.currentTrialType} />
      <div>
        <button type="submit" disabled={pristine || submitting}>
          Submit</button>
        <button type="button" disabled={pristine || submitting}
          onClick={reset}> Clear Values </button>
      </div>
    </form >
  );
}

export default reduxForm({
  form: 'TimelineForm',
  validate,
  asyncValidate,
})(TimelineForm)