import React from 'react';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
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
import { ParameterMode } from '../../../reducers/Experiment/editor';

const jsPsych = window.jsPsych;
const EnumPluginType = jsPsych.plugins.parameterType;

export const labelStyle = {
	paddingTop: 15,
	paddingRight: 10,
	color: 'black'
}


export default class TrialFormItem extends React.Component {
	static defaultProps = {
		paramInfo: "",
		param: "",
	}

	state = {
		showTool: false,
		openFuncEditor: false, // function editor
		openTimelineVariable: false,
		keyListStr: "",
	}

	setKeyListStr = (str) => {
		this.setState({
			keyListStr: str
		});
	}

	showTool = () => {
		this.setState({
			showTool: true
		});
	}

	hideTool = () => {
		this.setState({
			showTool: false
		});
	}

	showFuncEditor = () => {
		this.setState({
			openFuncEditor: true
		});
	}

	hideFuncEditor = () => {
		this.setState({
			openFuncEditor: false
		});
	}

	renderLabel = () => (
		<p
			className="Trial-Form-Label-Container"
		    style={labelStyle}
		    title={this.props.paramInfo.description}
		>
		    {this.props.paramInfo.pretty_name+": "}
		</p>
	)

	appendFunctionEditor = (param, alternate=null) => (
		(this.state.showTool || this.state.openFuncEditor || this.props.parameters[param].mode === ParameterMode.USE_FUNC) ?
			    <CodeEditorTrigger 
			    	setParamMode={() => { this.props.setParamMode(param); }}
					useFunc={this.props.parameters[param].mode === ParameterMode.USE_FUNC}
					showEditMode={true}
					initCode={convertNullToEmptyString(this.props.parameters[param].func.code)} 
					openCallback={this.showFuncEditor}
					closeCallback={this.hideFuncEditor}
                    submitCallback={(newCode) => { 
                      this.props.setFunc(param, newCode);
                    }}
                    title={param+": "}
        		/>:
        		alternate
	)

	appendTimelineVariable = (param, alternate=null) => (
		(this.state.showTool || this.state.openFuncEditor || this.props.parameters[param].mode === ParameterMode.USE_FUNC) ?
		<div /> :
		null
	)

	renderFieldContent = (param, node) => {
		switch(this.props.parameters[param].mode) {
			case ParameterMode.USE_FUNC:
				return <MenuItem primaryText="[Function]" style={{paddingTop: 2}} disabled={true} />;
			case ParameterMode.USE_TV:
				return <MenuItem primaryText="[Timeline Variable]" style={{paddingTop: 2}} disabled={true} />;
			default:
				return node;
		}
	}

	renderTextField = (param, onChange=()=>{}, type="text") => {
		return (
		  <div style={{display: 'flex', width: "100%"}} >
			{this.renderLabel()}
		    <div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
		    {this.renderFieldContent(param,
			    <TextField
			      id={"text-field-"+type+"-"+param}
			      value={convertNullToEmptyString(this.props.parameters[param].value)}
			      type={type}
			      fullWidth={true}
			      onChange={onChange}
			    />)
			}
			{this.appendFunctionEditor(param)}
		    </div>
		  </div>
	  )}

	renderToggle = (param) => (
		<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      	{this.renderLabel()}
	      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
	      		{this.renderFieldContent(param,
			        <IconButton 
			          onTouchTap={() => { this.props.setToggle(param); }} 
			          >
			        {(this.props.parameters[param].value) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
			        </IconButton>)
			    }
			    {this.appendFunctionEditor(param)}
	        </div>
	    </div>
	)

	renderFunctionEditor = (param) => (
		<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      	{this.renderLabel()}
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
		let useFunc = this.props.parameters[param].mode === ParameterMode.USE_FUNC;
		let isAllKey = value === jsPsych.ALL_KEYS;
		return (
			<div style={{display: 'flex', width: "100%"}} >
			{this.renderLabel()}
		    <div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
		    {this.renderFieldContent(param,
			    (isAllKey) ?
			    <MenuItem primaryText="[ALL KEYS]" style={{paddingTop: 2}} disabled={true} />:
			    <TextField
			      id={"text-field-"+"-"+param}
			      value={(this.state.keyListStr !== value) ? this.state.keyListStr : convertNullToEmptyString(value)}
			      fullWidth={true}
			      onChange={(e, v) => { this.setKeyListStr(v); }}
			      onFocus={() => {
			      	this.setKeyListStr(convertNullToEmptyString(value));
			      }}
			      onBlur={() => {
			      	this.props.setKey(param, this.state.keyListStr);
			      }}
			      onKeyPress={(e) => {
			      	if (e.which === 13) {
			      		document.activeElement.blur();
			      	}
			      }}
			    />)
			}
			{this.appendFunctionEditor(param,
				(<IconButton 
				onTouchTap={() => {
					if (isAllKey) {
						this.props.setKey(param, null, true);
					} else {
						this.props.setKey(param, jsPsych.ALL_KEYS, true);
					}
				}}
				tooltip="All Keys"
				onMouseEnter={this.hideTool} onMouseLeave={this.showTool}
			>
				{(isAllKey) ? <BoxCheckIcon color={boxCheckColor} /> : <BocUncheckIcon />}
			</IconButton>)
			)}
		    </div>
		  </div>
	)}

	renderSelect = (param) => {
		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      	{this.renderLabel()}
	      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
	      		{this.renderFieldContent(param,
				    <SelectField
				    	value={convertNullToEmptyString(this.props.parameters[param].value)}
				    	onChange={(event, index, value) => {
				    		this.props.setText(param, value);
				    	}}
				    >
				    {this.props.paramInfo.options.map((op, i) => (
				    	<MenuItem value={op} primaryText={op} key={op+"-"+i}/>
				    ))}
				    </SelectField>)
				}
				{this.appendFunctionEditor(param)}
	        </div>
	    </div>
		)
	}

	renderItem = () => {
		let { paramInfo, param, parameters } = this.props;
		let paramType = paramInfo.type;
		switch(paramType) {
				case EnumPluginType.AUDIO:
				case EnumPluginType.IMAGE:
				case EnumPluginType.VIDEO:
					// check if is array
					let multiSelect = !!paramInfo.array;
					return (
						<MediaManager 
							parameterName={param} 
							paramInfo={paramInfo}
							key={"Trial-form-"+param} 
							mode={(!multiSelect) ? MediaManagerMode.select : MediaManagerMode.multiSelect}
							setParamMode={() => { this.props.setParamMode(param); }}
							openCallback={this.showFuncEditor}
							closeCallback={this.hideFuncEditor}
							useFunc={this.props.parameters[param].mode === ParameterMode.USE_FUNC}
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
					return this.renderSelect(param);
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