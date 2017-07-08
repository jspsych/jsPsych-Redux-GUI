import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import {
  green500 as checkColor,
  blue500 as titleIconColor
} from 'material-ui/styles/colors';
import InitSettingIcon from 'material-ui/svg-icons/action/build';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import { convertNullToEmptyString } from '../../utils';
import MediaManager from '../../containers/MediaManager';
import { MediaManagerMode } from '..//MediaManager';

const jsPsych = window.jsPsych;
const EnumPluginType = jsPsych.plugins.parameterType;
const PluginList = Object.keys(jsPsych.plugins).filter((t) => (t !== 'parameterType'));


class TrialForm extends React.Component {
	renderTextField = (param, onChange=()=>{}, type="text",) => (
	  <div style={{display: 'flex', width: "100%"}} key={"text-field-"+type+"-container-"+param}>
	    <span 
	    	key={"text-field-"+type+"-prompt-"+param}
	    	style={{paddingTop: 20, paddingRight: 15, color: 'black', display: 'inline-block'}}
	    >
	    	{param+": "}
	    </span>
	    <TextField
	      id={"text-field-"+type+"-"+param}
	      key={"text-field-"+type+"-"+param}
	      style={{right: 0}}
	      value={convertNullToEmptyString(this.props.parameters[param])}
	      type={type}
	      onChange={onChange}
	    />
	  </div>
	  )

	renderPluginParams = () => {
		let parameters = jsPsych.plugins[this.props.pluginType].info.parameters;
		return Object.keys(parameters).map((param) => {
			switch(parameters[param].type[0]) {
				case EnumPluginType.AUDIO:
				case EnumPluginType.IMAGE:
				// check if is array
					return (
						<MediaManager parameterName={param} key={"Trial-form-"+param} mode={MediaManagerMode.select}/>
					)
				case EnumPluginType.VIDEO:
					return (
						<MediaManager parameterName={param} key={"Trial-form-"+param} mode={MediaManagerMode.multiSelect}/>
					)
				case EnumPluginType.BOOL:
					return <div key={"Trial-form-container"+param}
								style={{display: 'flex', width: "100%", position: 'relative'}}>
						      <div 
						      	key={"Trial-form-toggle-container"+param}
						      	style={{padding: 15, paddingLeft: 0, paddingRight: 0, paddingBottom: 0, color: 'black'}}
						      	>
						      		{param+":"}
						      	</div>
						        <IconButton 
						          key={"Trial-form-toggle"+param}
						          style={{position: 'absolute', right: 0}}
						          onTouchTap={() => { this.props.setToggle(param); }} 
						          >
						        {(this.props.parameters[param]) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
						        </IconButton>
						    </div>
				case EnumPluginType.INT:
				case EnumPluginType.FLOAT:
					return this.renderTextField(param, (e, v) => {
						this.props.setNumber(param, v, EnumPluginType.FLOAT===parameters[param].type[0]);
					}, "number");
				case EnumPluginType.FUNCTION:
				case EnumPluginType.SELECT:
				case EnumPluginType.KEYCODE:
				case EnumPluginType.HTML_STRING:
				case EnumPluginType.STRING:
				default:
					return this.renderTextField(param, (e, v) => { this.props.setText(param, v); });
			}	
		});
	}

	render() {
		return (
			<div className="trialForm">
				<div style={{display: 'flex', width: "100%"}}>
					<div style={{paddingTop: 20, 
								width: "37%", 
								overflow: 'hidden', 
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis'}}>
						{"Plugin Type:"}
					</div>
					<div style={{width: "63%"}}>
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
