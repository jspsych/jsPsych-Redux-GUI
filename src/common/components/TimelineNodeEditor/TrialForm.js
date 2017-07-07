import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

import { convertNullToEmptyString } from '../../utils';
import MediaManager from '../../containers/MediaManager';
import { MediaManagerMode } from '..//MediaManager';

const jsPsych = window.jsPsych;
const EnumPluginType = jsPsych.plugins.parameterType;
const PluginList = Object.keys(jsPsych.plugins).filter((t) => (t !== 'parameterType'));


class TrialForm extends React.Component {
	renderPluginParams = () => {
		let parameters = jsPsych.plugins[this.props.pluginType].info.parameters;
		return Object.keys(parameters).map((param) => {
			switch(parameters[param].type[0]) {
				case EnumPluginType.AUDIO:
				case EnumPluginType.IMAGE:
					return (
						<MediaManager parameterName={param} key={"Trial-form-"+param} mode={MediaManagerMode.select}/>
					)
				case EnumPluginType.VIDEO:
					return (
						<MediaManager parameterName={param} key={"Trial-form-"+param} mode={MediaManagerMode.multiSelect}/>
					)
				case EnumPluginType.BOOL:
				case EnumPluginType.INT:
				case EnumPluginType.FLOAT:
				case EnumPluginType.FUNCTION:
				case EnumPluginType.SELECT:
				case EnumPluginType.KEYCODE:
				case EnumPluginType.HTML_STRING:
				case EnumPluginType.STRING:
				default:
					return <TextField
								id={param}
								key={"Trial-form-"+param}
								value={convertNullToEmptyString(this.props.parameters[param])}
								floatingLabelText={param}
								onChange={(e, v) => { this.props.setText(param, v); }}
							/>

			}	
		});
	}

	render() {
		return (
			<div className="trialForm">
				<SelectField
					value={this.props.pluginType}
					floatingLabelText="Plugin Type"
					underlineStyle={{display: 'none'}}
					onChange={(event, key) => this.props.onChange(PluginList[key])} 
				>
					{PluginList.map((plugin) => (<MenuItem primaryText={plugin} key={plugin+"-Item-Name"} value={plugin} />))}
				</SelectField>
				<Divider />
				{this.renderPluginParams()}
			</div>
		)
	}
}


export default TrialForm;
