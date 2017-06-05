import React from 'react';

class TrialFrom extends React.Component {
	render(){
		var i = 0;
		const pluginItems = Object.keys(jsPsych.plugins).map((plugin) =>
			<MenuItem
			primaryText={plugin}
			key={i++}
			value={plugin} />
			);
		if(this.props.open){
			if(!this.props.isTimeline){
				var getParamVal=jsPsych.plugins[this.props.open].parameterValue;
				const plugForm = Object.keys(getParamVal.info.parameters[plug].type[0]) {
					case 0:
					return(<Toggle id={plug} label={plug} defaultToggled={true} onToggle={this.props.handleParamChange});
					break;
					default:
					return(<TextField id={plug} key={plug} defaultValue={plug} floatingLabelText={plug} onChange={this.props.handleParamChange});
				}
			}
		}
	}
}

export default TrialForm;
