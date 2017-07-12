import React from 'react';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import {
  green500 as checkColor,
} from 'material-ui/styles/colors';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import { convertNullToEmptyString } from '../../../utils';
import MediaManager from '../../../containers/MediaManager';
import { MediaManagerMode } from '../../MediaManager';
import CodeEditorTrigger from '../../CodeEditorTrigger';

const jsPsych = window.jsPsych;
const EnumPluginType = jsPsych.plugins.parameterType;

const labelStyle = {
	paddingTop: 15,
	paddingRight: 10,
	color: 'black'
}

const renderLabel = (param) => (
	<p
		className="Trial-Form-Label-Container"
	    style={labelStyle}
	>
	    {param+": "}
	</p>
)

export default class TrialFormItem extends React.Component {
	static defaultProps = {
		paramType: "",
		param: "",
	}

	state = {
		showFunc: false,
		openEditor: false,
	}

	showFunc = () => {
		this.setState({
			showFunc: true
		});
	}

	hideFunc = () => {
		this.setState({
			showFunc: false
		});
	}

	showFuncEditor = () => {
		this.setState({
			openEditor: true
		});
	}

	hideFuncEditor = () => {
		this.setState({
			openEditor: false
		});
	}

	renderTextField = (param, onChange=()=>{}, type="text",) => (
	  <div style={{display: 'flex', width: "100%"}} >
		{renderLabel(param)}
	    <div className="Trial-Form-Content-Container" onMouseEnter={this.showFunc} onMouseLeave={this.hideFunc}>
	    {(this.props.parameters[param].useFunc) ?
	    	<MenuItem primaryText="[Function]" style={{paddingTop: 2}} disabled={true} />:
		    <TextField
		      id={"text-field-"+type+"-"+param}
		      value={convertNullToEmptyString(this.props.parameters[param].value)}
		      type={type}
		      fullWidth={true}
		      onChange={onChange}
		    />
		}
		{(this.state.showFunc || this.state.openEditor) ?
		<CodeEditorTrigger 
					setParamMode={() => { this.props.setParamMode(param); }}
					openCallback={this.showFuncEditor}
					closeCallback={this.hideFuncEditor}
					useFunc={this.props.parameters[param].useFunc}
					showEditMode={true}
					initCode={convertNullToEmptyString(this.props.parameters[param].func.code)} 
                    submitCallback={(newCode) => { 
                      this.props.setFunc(param, newCode);
                    }}
                    title={param+": "}
        /> :
        null
    	}
	    </div>
	  </div>
	  )

	renderToggle = (param) => (
		<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      	{renderLabel(param)}
	      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showFunc} onMouseLeave={this.hideFunc} >
	      		{(this.props.parameters[param].useFunc) ?
	      			<MenuItem primaryText="[Function]" style={{paddingTop: 2}} disabled={true} />:
			        <IconButton 
			          onTouchTap={() => { this.props.setToggle(param); }} 
			          >
			        {(this.props.parameters[param].value) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
			        </IconButton>
			    }
			    {(this.state.showFunc || this.state.openEditor) ?
			    <CodeEditorTrigger 
			    	setParamMode={() => { this.props.setParamMode(param); }}
					useFunc={this.props.parameters[param].useFunc}
					showEditMode={true}
					initCode={convertNullToEmptyString(this.props.parameters[param].func.code)} 
					openCallback={this.showFuncEditor}
					closeCallback={this.hideFuncEditor}
                    submitCallback={(newCode) => { 
                      this.props.setFunc(param, newCode);
                    }}
                    title={param+": "}
        		/>:
        		null
        		}
	        </div>
	    </div>

	)

	renderItem = () => {
		let { paramType, param, parameters } = this.props;
		switch(paramType) {
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
					return this.renderToggle(param);
				case EnumPluginType.INT:
				case EnumPluginType.FLOAT:
					return this.renderTextField(param, (e, v) => {
						this.props.setNumber(param, v, EnumPluginType.FLOAT===parameters[param].type[0]);
					}, "number");
				case EnumPluginType.FUNCTION:
				// same different
				case EnumPluginType.SELECT:
				case EnumPluginType.KEYCODE:
				case EnumPluginType.HTML_STRING:
				case EnumPluginType.STRING:
				default:
					return this.renderTextField(param, (e, v) => { this.props.setText(param, v); });
		}
	}

	render() {
		return (
			this.renderItem()
		)
	}
}