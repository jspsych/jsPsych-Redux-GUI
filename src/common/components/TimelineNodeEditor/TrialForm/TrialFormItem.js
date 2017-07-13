import React from 'react';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import {
  green500 as checkColor,
  cyan500 as boxCheckColor,
} from 'material-ui/styles/colors';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import BoxCheckIcon from 'material-ui/svg-icons/toggle/check-box';
import BocUncheckIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import { convertNullToEmptyString } from '../../../utils';
import MediaManager from '../../../containers/MediaManager';
import { MediaManagerMode } from '../../MediaManager';
import CodeEditorTrigger from '../../CodeEditorTrigger';

const jsPsych = window.jsPsych;
const EnumPluginType = jsPsych.plugins.parameterType;

export const labelStyle = {
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
		keyListStr: "",
		useKeyListStr: false
	}

	state = {
		showFunc: false,
		openEditor: false,
	}

	setKeyListStr = (str) => {
		this.setState({
			keyListStr: str
		});
	}

	turnOnKeyListStr = () => {
		this.setState({
			useKeyListStr: true
		});
	}

	turnOffKeyListStr = () => {
		this.setState({
			useKeyListStr: false
		});
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

	renderTextField = (param, onChange=()=>{}, type="text") => (
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
		{(this.state.showFunc || this.state.openEditor || this.props.parameters[param].useFunc) ?
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
			    {(this.state.showFunc || this.state.openEditor || this.props.parameters[param].useFunc) ?
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

	renderFunctionEditor = (param) => (
		<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      	{renderLabel(param)}
	      	<div className="Trial-Form-Content-Container">
			    <CodeEditorTrigger 
					initCode={convertNullToEmptyString(this.props.parameters[param].func.code)} 
                    submitCallback={(newCode) => { 
                      this.props.setFunc(param, newCode);
                    }}
                    title={param+": "}
        		/>
	        </div>
	    </div>
	)

	renderKeyboardInput = (param) => {
		let value = this.props.parameters[param].value;
		if (Array.isArray(value)) {
			let s = "";
			for (let v of value) {
				if (v === jsPsych.ALL_KEYS) s += v;
				else if (v.length > 1) s += `{${v}}`;
				else s += v;
			}
			value = s;
		}
		let useFunc = this.props.parameters[param].useFunc;
		let isAllKey = value === jsPsych.ALL_KEYS;
		return (
			<div style={{display: 'flex', width: "100%"}} >
			{renderLabel(param)}
		    <div className="Trial-Form-Content-Container" onMouseEnter={this.showFunc} onMouseLeave={this.hideFunc}>
		    {(useFunc) ?
		    	<MenuItem primaryText="[Function]" style={{paddingTop: 2}} disabled={true} />:
			    (value === jsPsych.ALL_KEYS) ?
			    <MenuItem primaryText="[ALL KEYS]" style={{paddingTop: 2}} disabled={true} />:
			    <TextField
			      id={"text-field-"+"-"+param}
			      value={(this.state.useKeyListStr) ? this.state.keyListStr : convertNullToEmptyString(value)}
			      fullWidth={true}
			      onChange={(e, v) => { this.setKeyListStr(v); }}
			      onFocus={() => {
			      	this.turnOnKeyListStr();
			      	this.setKeyListStr(convertNullToEmptyString(value));
			      }}
			      onBlur={() => {
			      	this.turnOffKeyListStr();
			      	this.props.setKey(param, this.state.keyListStr);
			      }}
			      onKeyPress={(e) => {
			      	if (e.which === 13) {
			      		document.activeElement.blur();
			      	}
			      }}
			    />
			}
			{((this.state.showFunc || this.state.openEditor || useFunc) && !isAllKey) ?
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
	        <IconButton 
				onTouchTap={() => {
					if (isAllKey) {
						this.props.setKey(param, null, true);
					} else {
						this.props.setKey(param, jsPsych.ALL_KEYS, true);
					}
				}}
				tooltip="All Keys"
				onMouseEnter={this.hideFunc} onMouseLeave={this.showFunc}
			>
				{(isAllKey) ? <BoxCheckIcon color={boxCheckColor} /> : <BocUncheckIcon />}
			</IconButton>
	    	}
		    </div>
		  </div>
	)}

	renderSelect = (param) => {
		return (
			<div></div>
		)
	}

	renderItem = () => {
		let { paramType, param, parameters } = this.props;
		switch(paramType) {
				case EnumPluginType.AUDIO:
				case EnumPluginType.IMAGE:
				case EnumPluginType.VIDEO:
				// check if is array
					return (
						<MediaManager 
							parameterName={param} 
							key={"Trial-form-"+param} 
							mode={(paramType !== EnumPluginType.VIDEO) ? MediaManagerMode.select : MediaManagerMode.multiSelect}
							setParamMode={() => { this.props.setParamMode(param); }}
							openCallback={this.showFuncEditor}
							closeCallback={this.hideFuncEditor}
							useFunc={this.props.parameters[param].useFunc}
							initCode={convertNullToEmptyString(this.props.parameters[param].func.code)} 
		                    submitCallback={(newCode) => { 
		                      this.props.setFunc(param, newCode);
		                    }}
		                    codeEditorTitle={param+": "}
						/>
					);
				case EnumPluginType.BOOL:
					return this.renderToggle(param);
				case EnumPluginType.INT:
				case EnumPluginType.FLOAT:
					return this.renderTextField(param, (e, v) => {
						this.props.setNumber(param, v, EnumPluginType.FLOAT===paramType);
					}, "number");
				case EnumPluginType.FUNCTION:
					return this.renderFunctionEditor(param);
				// same different
				case EnumPluginType.SELECT:
				case EnumPluginType.KEYCODE:
					return this.renderKeyboardInput(param);
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