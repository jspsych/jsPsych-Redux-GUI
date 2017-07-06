import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

let jsPsych = window.jsPsych;

const pluginStyle = {
		height:'15vh',
		width: '100%',
		left: '0px',
	}


class TrialForm extends React.Component {
	render(){
		var plugins = Object.keys(jsPsych.plugins);
		if(plugins.indexOf('parameterType') >= 0){
			plugins.splice(plugins.indexOf('parameterType'), 1);
		}
		const pluginItems = plugins.map((plugin) => {
			return (<MenuItem primaryText={plugin} key={plugin} value={plugin} />);
		});
		var form;
		var allkeys;
		if(this.props.choices === 'allkeys') {
			console.log("is all keys");
			allkeys = true;
		} else {
			console.log("is not all keys");
			allkeys = false;
		}
		if(this.props.isTrial){
			var getPluginType = jsPsych.plugins[this.props.pluginType];
			const pluginParameters = Object.keys(getPluginType.info.parameters).map((plug) => {
				switch(getPluginType.info.parameters[plug].type[0]) {
					case 0:
						return (
							<Toggle
							id={plug}
							key={plug+" "+this.props.id}
							label={plug}
							defaultToggled={this.props.parameters[plug]}
							onToggle={(event, newValue) => this.props.onToggle(event.target.id, newValue)} />);

					case 1:
						return (
							<TextField
							id={plug}
							key={plug+" "+this.props.id}
							value={this.props.parameters[plug]}
							floatingLabelText={plug}
							onChange={(event, newValue) => this.props.onChangeText(event.target.id, newValue)} />);
					case 2:
						return (
							<TextField
							id={plug}
							key={plug+" "+this.props.id}
							value={this.props.parameters[plug]}
							floatingLabelText={plug}
							onChange={(event, newValue) => this.props.onChangeInt(event.target.id, newValue)} />);
					case 3:
						return (
							<TextField
							id={plug}
							key={plug+" "+this.props.id}
							value={this.props.parameters[plug]}
							floatingLabelText={plug}
							onChange={(event, newValue) => this.props.onChangeFloat(event.target.id, newValue)} />);
					case 4:
					case 5:
						return (
							<div>
							<TextField
							 id={plug} 
							 key={plug+" "+this.props.id} 
							 value={this.props.choices} 
							 floatingLabelText={plug} 
							 onChange={(event, newValue) => this.props.onChangeChoices(event.target.id, newValue)} />
							 <Checkbox
							 	id={plug}
							 	label="ALLKEYS"
							 	checked={allkeys}
							 	onCheck={(event, newVal) => this.props.onHandleCheck(event.target.id, newVal)} />
							 </div>);
					case 6: 
						return (
							<SelectField
							id={plug}
							value={this.props.parameters[plug]}
							floatingLabelText={plug}
							onChange={(event, newValue) => this.props.onChangeSelectField(event.target.id, newValue)} />);
					default:
						return (
							<TextField
							id={plug} key={plug}
							value={this.props.parameters[plug]}
							floatingLabelText={plug}
							onChange={(event, newValue) => this.props.onChangeText(event.target.id, newValue)} />);
				}
			});
			form = (
			<div className="trialForm">
				<SelectField
					value={this.props.pluginType}
					floatingLabelText="Plugin Type"
					underlineStyle={{display: 'none'}}
					onChange={(event, key) => this.props.onChange(plugins[key])} 
				>
					{pluginItems}
				</SelectField>
				<Divider />
				{pluginParameters}
			</div>)
		} else {
			form = null;
		}
		return(
			<div>
				{form}
			</div>
			)
	}
}

export default TrialForm;
