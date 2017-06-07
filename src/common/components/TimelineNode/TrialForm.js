import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

class TrialForm extends React.Component {
	render(){
		var i = 0;
		const pluginItems = Object.keys(jsPsych.plugins).map((plugin) =>
			<MenuItem
			primaryText={plugin}
			key={i++}
			value={plugin} />
			);
		if(this.props.open){
			//if(!this.props.isTimeline){
				var getParamVal=jsPsych.plugins[this.props.open].parameterValue;
				console.log(getParamVal);
				const plugForm = Object.keys(getParamVal.info.parameters).map((plug) => {
					switch(getParamVal.info.parameters[plug].type[0]) {
						case 0:
						return(<Toggle id={plug} label={plug} defaultToggled={true} onToggle={this.props.handleParamChange} />);
						break;
						default:
						return(<TextField id={plug} key={plug} defaultValue={plug} floatingLabelText={plug} onChange={this.props.handleParamChange} />);
					}
				});
			}
			var form = <div><SelectField
			value="value"
			autoWidth={true}
			floatingLabelText="Trial Type"
			maxHeight={300} >
			{pluginItems}
			</SelectField>
			{plugForm}
			</div>
		 //}
		return(
			<div>
			{form}
			</div>
			)
	}
}

export default TrialForm;