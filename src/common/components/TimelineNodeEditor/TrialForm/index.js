import React from 'react';

import TrialFormItem from '../../../containers/TimelineNodeEditor/TrialForm/TrialFormItemContainer';
import { injectJsPsychUniversalPluginParameters } from '../../../utils';

const jsPsych = window.jsPsych;
const PluginList = Object.keys(jsPsych.plugins).filter((t) => (t !== 'parameterType' && t !== 'universalPluginParameters'));


class TrialForm extends React.Component {
	renderPluginParams = () => {
		if (!this.props.pluginType) return null;
		let pluginInfo = jsPsych.plugins[this.props.pluginType].info;
		let parameters = injectJsPsychUniversalPluginParameters(pluginInfo.parameters);
		// params are the keys of plugin.info 
		/* e.g.
		param	--> 
			stimulus: {
				type: [jsPsych.plugins.parameterType.AUDIO],
				default: undefined, 
				no_function: false,
				description: ''
			},
		*/
		// paramTypes are the type (jspsych enum) of the above param
		/*
		props explanations:

		param: Field name of a plugin's parameter
		For example, "stimulus" would be the param 

		paramInfo: jsPsych.plugins[Plugin Type].info.parameters[Field Name]
		For example,  {
				type: [jsPsych.plugins.parameterType.AUDIO],
				default: undefined, 
				no_function: false,
				description: ''
			} would be the paramInfo

		*/
		return Object.keys(parameters).map((param, i) => {	
			return (
				<TrialFormItem 
					param={param} 
					key={param+"-"+i}
					paramInfo={parameters[param]}
					/>
			)});
	}

	render() {
		return (
			<div className="trialForm">
				{this.renderPluginParams()}
			</div>
		)
	}
}


export default TrialForm;
