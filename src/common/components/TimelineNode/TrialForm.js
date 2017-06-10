import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import isTrial from '../../constants/utils'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class TrialForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render(){
		var i = 0;
		const pluginItems = Object.keys(jsPsych.plugins).map((plugin) =>
			<MenuItem
			primaryText={plugin}
			key={i++}
			value={plugin} />
			);

		if(this.props.open && this.props.isTrial){
			console.log("this is open and a trial");
			console.log("is a trial" + this.props.isTrial);
			var getPluginType = jsPsych.plugins[this.props.pluginType];

			const pluginParameters = Object.keys(getPluginType.info.parameters).map((plug) => {
				switch(getPluginType.info.parameters[plug].type[0]) {
					case 0: return (<Toggle id={plug} key={plug} label={plug} defaultToggled={true} onToggle={this.props.onToggle} />);
					break;
					case 1:
					case 2: 
					case 3: 
					case 4:
					case 5: return (<TextField id={plug} key={plug} defaultValue={plug} floatingLabelText={plug} />);
					break;
					case 6: return (<SelectField id={plug} defaultValue={plug} floatingLabelText={plug} />);
					break;
					default: return (<TextField id={plug} key={plug} defaultValue={plug} floatingLabelText={plug} />);
				}
			});
			console.log("Before form" + this.props.pluginType);
			var form = <div><SelectField
			value={this.props.pluginType}
			autoWidth={true}
			floatingLabelText="Plugin Type"
			maxHeight={300}
			onChange={this.props.onChange} >
			{pluginItems}
			</SelectField>
			{pluginParameters}
			</div>;
		} else {
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