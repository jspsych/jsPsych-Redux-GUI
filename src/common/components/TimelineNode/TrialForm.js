import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import isTrial from '../../constants/utils'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class TrialForm extends React.Component {
	render(){
		var i = 0;
		const pluginItems = Object.keys(jsPsych.plugins).map((plugin) =>
			<MenuItem
			primaryText={plugin}
			key={i++}
			value={plugin} />
			);

		if(this.props.open && this.props.isTrial){
				var getParamVal=jsPsych.plugins[this.props.open].parameterValue;
				const plugForm = Object.keys(getParamVal.info.parameters).map((plug) => {
					switch(getParamVal.info.parameters[plug].type[0]) {
						case 0:
						return(<Toggle id={plug} label={plug} defaultToggled={true} />);
						break;
						default:
						return(<TextField id={plug} key={plug} defaultValue={plug} floatingLabelText={plug} />);
				});
			}
			var form = <div><SelectField
			value={this.props.pluginType}
			autoWidth={true}
			floatingLabelText="Plugin Type"
			maxHeight={300}
			onChange={this.props.onChange} >
			{pluginItems}
			</SelectField>;
		} else {
			console.log("not open and not a trial");
			var form = <div></div>;
		}
		return(
			<MuiThemeProvider>
			{form}
			</MuiThemeProvider>
			)
	}
}

export default TrialForm;