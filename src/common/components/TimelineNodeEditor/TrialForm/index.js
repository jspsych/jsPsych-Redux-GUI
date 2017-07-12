import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {
  green500 as checkColor,
  blue500 as titleIconColor
} from 'material-ui/styles/colors';
import InitSettingIcon from 'material-ui/svg-icons/action/build';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import TrialFormItem from '../../../containers/TimelineNodeEditor/TrialForm/TrialFormItemContainer';

const jsPsych = window.jsPsych;
const EnumPluginType = jsPsych.plugins.parameterType;
const PluginList = Object.keys(jsPsych.plugins).filter((t) => (t !== 'parameterType'));


class TrialForm extends React.Component {
	renderPluginParams = () => {
		let parameters = jsPsych.plugins[this.props.pluginType].info.parameters;
		return Object.keys(parameters).map((param, i) => (
				<TrialFormItem paramType={parameters[param].type[0]} param={param} key={param+"-"+i}/>
			));
	}

	render() {
		return (
			<div className="trialForm">
				<div style={{display: 'flex', width: "100%"}}>
					<p className="Trial-Form-Label-Container" 
						style={{paddingTop: 15, paddingRight: 10}}>
						{"Plugin:"}
					</p>
					<div className="Trial-Form-Content-Container">
						<SelectField
							fullWidth={true}
							value={this.props.pluginType}
							title={this.props.pluginType}
							onChange={(event, key) => this.props.onChange(PluginList[key])} 
						>
							{PluginList.map((plugin) => (<MenuItem primaryText={plugin} key={plugin+"-Item-Name"} value={plugin} />))}
						</SelectField>
					</div>
				</div>
				{this.renderPluginParams()}
			</div>
		)
	}
}


export default TrialForm;
