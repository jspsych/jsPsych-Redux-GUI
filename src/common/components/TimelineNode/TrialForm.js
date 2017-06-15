// import React from 'react';
// import MenuItem from 'material-ui/MenuItem';
// import Toggle from 'material-ui/Toggle';
// import TextField from 'material-ui/TextField';
// import SelectField from 'material-ui/SelectField';
// import { isTrial } from '../../reducers/timelineNodeUtils';

// // import jsPsych from '../../../../public/jsPsych/jspsych';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


// let jsPsych = {}; 

// const pluginStyle = {
// 		//top: 20,
// 		height:'15vh',
// 		width: '100%',
// 		left: '0px',
// 	}


// class TrialForm extends React.Component {
// 	constructor(props) {
// 		super(props);

// 	}
// 	render(){
// 		var plugins = Object.keys(jsPsych.plugins);
// 		if(plugins.indexOf('parameterType') >= 0){
// 			plugins.splice(plugins.indexOf('parameterType'), 1);
// 		}
// 		const pluginItems = plugins.map((plugin) => {
// 			return (<MenuItem primaryText={plugin} key={plugin} value={plugin} />);	
// 		});
// 		var form;
// 		if(this.props.isTrial){
// 			var getPluginType = jsPsych.plugins[this.props.pluginType];
// 			console.log("parameters " + this.props.parameters);
// 			const pluginParameters = Object.keys(getPluginType.info.parameters).map((plug) => {
// 				switch(getPluginType.info.parameters[plug].type[0]) {
// 					case 0: return (<Toggle id={plug} key={plug} label={plug} defaultToggled={this.props.parameters[plug]} onToggle={(event, newValue) => this.props.onToggle(event.target.id, newValue)} />);
// 					break;
// 					case 1: return (<TextField id={plug} key={plug} value={this.props.parameters[plug]} floatingLabelText={plug} onChange={(event, newValue) => this.props.onChangeText(event.target.id, newValue)} />);
// 					break;
// 					case 2: return (<TextField id={plug} key={plug} value={this.props.parameters[plug]} floatingLabelText={plug} onChange={(event, newValue) => this.props.onChangeInt(event.target.id, newValue)} />);
// 					break;
// 					case 3: return (<TextField id={plug} key={plug} value={this.props.parameters[plug]} floatingLabelText={plug} onChange={(event, newValue) => this.props.onChangeFloat(event.target.id, newValue)} />);
// 					break;
// 					case 4:
// 					case 5: return (<TextField id={plug} key={plug} value={this.props.parameters[plug]} floatingLabelText={plug} onChange={(event, newValue) => this.props.onChangeText(event.target.id, newValue)} />);
// 					break;
// 					case 6: return (<SelectField id={plug} value={this.props.parameters[plug]} floatingLabelText={plug} onChange={(event, newValue) => this.props.onChangeSelectField(event.target.id, newValue)} />);
// 					break;
// 					default: return (<TextField id={plug} key={plug} value={this.props.parameters[plug]} floatingLabelText={plug} onChange={(even, newValue) => this.props.onChangeText(event.target.id, newValue)} />);
// 				}
// 			});
// 			var form = <div className="trialForm"><SelectField
// 			value={this.props.pluginType}
// 			floatingLabelText="Plugin Type"
// 			maxHeight={300}
// 			style={pluginStyle}
// 			onChange={(event, key) => this.props.onChange(plugins[key])} >
// 			{pluginItems}
// 			</SelectField>
// 			{pluginParameters}
// 			</div>
// 		} else {
// 			var form = <div></div>;
// 		}
// 		return(
// 			<MuiThemeProvider>
// 			{form}
// 			</MuiThemeProvider>
// 			)
// 	}
// }

// export default TrialForm;
