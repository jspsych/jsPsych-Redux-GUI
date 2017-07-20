import React from 'react';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import NumberInput from 'material-ui-number-input';
// import Divider from 'material-ui/Divider';
// import { ListItem } from 'material-ui/List';

import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import BoxCheckIcon from 'material-ui/svg-icons/toggle/check-box';
import BocUncheckIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import {
  green500 as checkColor,
  cyan500 as boxCheckColor,
} from 'material-ui/styles/colors';

import { convertNullToEmptyString } from '../../../utils';
import MediaManager from '../../../containers/MediaManager';
import { MediaManagerMode } from '../../MediaManager';
import CodeEditorTrigger from '../../CodeEditorTrigger';
import { ParameterMode } from '../../../reducers/Experiment/editor';
import TimelineVariableSelector from '../../../containers/TimelineNodeEditor/TrialForm/TimelineVariableSelectorContainer';
import ObjectEditor from '../../../containers/ObjectEditor';

const jsPsych = window.jsPsych;
const EnumPluginType = jsPsych.plugins.parameterType;

export const labelStyle = {
	paddingTop: 15,
	paddingRight: 10,
	color: 'black'
}

const processMediaPathTag = (s) => {
	if (!s) return "";
	if (Array.isArray(s)) {
		let res = [];
		for (let i = 0; i < s.length; i++) {
			res.push(s[i].replace(/<\/?path>/g, ''));
			if (i < s.length - 1) res.push(",");
		}
		return res.join('');
	} else {
		return s.replace(/<\/?path>/g, '');
	}
}

/*
props explanations:

param: Field name of a plugin's parameter
paramInfo: jsPsych.plugins[Plugin Type].info.parameters[Field Name]

*/
export default class TrialFormItem extends React.Component {
	static defaultProps = {
		paramInfo: "",
		param: "",
	}

	state = {
		showTool: false,
		// function editor dialog
		openFuncEditor: false, 
		// timeline variable selector dialog
		openTimelineVariable: false,
		keyListStr: "",
		fileListStr: "",
		fileStr: "",
	}

	componentDidMount() {
		switch (this.props.paramInfo.type) {
			case EnumPluginType.KEYCODE:
				this.setState({
					keyListStr: this.props.parameters[this.props.param].value
				});
				break;
			case EnumPluginType.AUDIO:
			case EnumPluginType.IMAGE:
			case EnumPluginType.VIDEO:
				let selectedFilesString = processMediaPathTag(this.props.parameters[this.props.param].value);
				this.setState({
					fileStr: selectedFilesString,
					fileListStr: selectedFilesString,
				})
				break;
			default:
				break;
		}
	}

	setFileListStr = (str) => {
		this.setState({
			fileListStr: str
		});
	}

	setFileStr = (str) => {
		this.setState({
			fileStr: str
		});
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

	showTVSelector = () => {
		this.setState({
			openTimelineVariable: true
		});
	}

	hideTVSelector = () => {
		this.setState({
			openTimelineVariable: false
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
		((this.state.showTool || 
			this.state.openFuncEditor || 
			this.props.parameters[param].mode === ParameterMode.USE_FUNC) &&
			this.props.parameters[param].mode !== ParameterMode.USE_TV) ?
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
                    title={this.props.paramInfo.pretty_name+": "}
        		/>:
        		alternate
	)

	appendTimelineVariable = (param, alternate=null) => (
		((this.state.showTool || 
			this.state.openTimelineVariable || 
			this.props.parameters[param].mode === ParameterMode.USE_TV) &&
			this.props.parameters[param].mode !== ParameterMode.USE_FUNC) ?
		<TimelineVariableSelector 
			openCallback={this.showTVSelector}
			closeCallback={this.hideTVSelector}
			useTV={this.props.parameters[param].mode === ParameterMode.USE_TV}
			title={this.props.paramInfo.pretty_name+": "}
			selectedTV={this.props.parameters[param].timelineVariable}
			submitCallback={(newTV) => {
				this.props.setTimelineVariable(param, newTV);
			}}
			setParamMode={() => { this.props.setParamMode(param, ParameterMode.USE_TV); }}
		/> :
		null
	)

	renderFieldContent = (param, node) => {
		switch(this.props.parameters[param].mode) {
			case ParameterMode.USE_FUNC:
				return <MenuItem primaryText="[Custom Code]" style={{paddingTop: 2}} disabled={true} />;
			case ParameterMode.USE_TV:
				return <MenuItem
							primaryText="[Timeline Variable]"
							style={{paddingTop: 2}} 
							disabled={true} />;
			default:
				return node;
		}
	}
	// primaryText={`[${(this.props.parameters[param].timelineVariable ? this.props.parameters[param].timelineVariable : "Timeline Variable")}]`}
	
	renderTextField = (param) => {
		return (
		  <div style={{display: 'flex', width: "100%"}} >
			{this.renderLabel()}
		    <div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
		    {this.renderFieldContent(param,
			    <TextField
			      id={"text-field-"+param}
			      value={convertNullToEmptyString(this.props.parameters[param].value)}
			      min={-1}
			      fullWidth={true}
			      onChange={(e, v) => { this.props.setText(param, v); }}
			    />)
			}
			{this.appendFunctionEditor(param)}
			{this.appendTimelineVariable(param)}
		    </div>
		  </div>
	  )}

	renderNumberField = (param) => {
		return (
			<div style={{display: 'flex', width: "100%"}} >
				{this.renderLabel()}
			    <div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
				    {this.renderFieldContent(param,
					    <NumberInput
					      id={"number-field-"+param}
					      value={convertNullToEmptyString(this.props.parameters[param].value).toString()}
					      fullWidth={true}
					      onChange={(e, v) => {
								this.props.setNumber(param, v, EnumPluginType.FLOAT===this.props.paramInfo.type);
							}}
					    />)
					}
					{this.appendFunctionEditor(param)}
					{this.appendTimelineVariable(param)}
			    </div>
		  </div>
		)
	}

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
			    {this.appendTimelineVariable(param)}
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
                    title={this.props.paramInfo.pretty_name+": "}
        		/>
        		{this.appendTimelineVariable(param)}
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
		let isAllKey = value === jsPsych.ALL_KEYS;
		let isArray = !!this.props.paramInfo.array;

		let alternativeNode = (<IconButton 
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
			</IconButton>);

		return (
			<div style={{display: 'flex', width: "100%"}} >
			{this.renderLabel()}
		    <div 
		    	className="Trial-Form-Content-Container" 
		    	onMouseEnter={(isAllKey) ? ()=>{} : this.showTool} 
		    	onMouseLeave={this.hideTool}
		    >
		    {this.renderFieldContent(param,
			    (isAllKey) ?
			    <MenuItem primaryText="[ALL KEYS]" style={{paddingTop: 2}} disabled={true} />:
			    <TextField
			      id={"text-field-"+param}
			      value={(this.state.keyListStr !== value) ? this.state.keyListStr : convertNullToEmptyString(value)}
			      fullWidth={true}
			      onChange={(e, v) => { this.setKeyListStr(v.toUpperCase()); }}
			      maxLength={(isArray) ?  null : "1"}
			      onFocus={() => {
			      	this.setKeyListStr(convertNullToEmptyString(value));
			      }}
			      onBlur={() => {
			      	this.props.setKey(param, this.state.keyListStr, false, isArray);
			      }}
			      onKeyPress={(e) => {
			      	if (e.which === 13) {
			      		document.activeElement.blur();
			      	}
			      }}
			    />)
			}
			{this.appendFunctionEditor(param, alternativeNode)}
			{this.appendTimelineVariable(param, alternativeNode)}
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
				{this.appendTimelineVariable(param)}
	        </div>
	    </div>
		)
	}

	renderMediaSelector = (param, multiSelect) => {
		let selectedFilesString = processMediaPathTag(this.props.parameters[this.props.param].value);

		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
				{this.renderLabel()}
	      		<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
	      			{this.renderFieldContent(param, 
	      				(multiSelect) ?
	      				<TextField 
								id={"Selected-File-Input-"+param}
								multiLine={true}
								rowsMax={3}
								rows={1}
								fullWidth={true}
								value={(this.state.fileListStr !== selectedFilesString)? this.state.fileListStr : selectedFilesString}
								onChange={(e, v) => { 
									this.setFileListStr(v); 
								}}
								onFocus={() => {
									this.setFileListStr(selectedFilesString);
								}}
								onBlur={() => { 
									this.props.fileArrayInput(
										param,
										this.state.fileListStr, 
										this.props.s3files.Prefix, 
										this.props.filenames);
									this.setFileListStr(selectedFilesString);
								}}
								onKeyPress={(e) => {
									if (e.which === 13) {
										this.props.fileArrayInput(
											param,
											this.state.fileListStr, 
											this.props.s3files.Prefix, 
											this.props.filenames);
										this.setFileListStr(selectedFilesString);
									}
								}}
							/> :
							<AutoComplete
								id={"Selected-File-Input-"+param}
								fullWidth={true}
								searchText={(this.state.fileStr !== selectedFilesString) ?
											 this.state.fileStr : selectedFilesString}
								title={selectedFilesString}
								dataSource={this.props.filenames}
								filter={(searchText, key) => (searchText === "" || (key.startsWith(searchText) && key !== searchText))}
								listStyle={{maxHeight: 200, overflowY: 'auto'}}
								onUpdateInput={(t) => { 
									this.setFileStr(t); 
									if (t !== selectedFilesString && this.props.filenames.indexOf(t) > -1) {
										this.props.autoFileInput(param, t, this.props.s3files.Prefix, this.props.filenames);
									}
								}}
								onNewRequest={(s, i) => {
									if (i !== -1 && s !== selectedFilesString) {
										this.props.autoFileInput(param, s, this.props.s3files.Prefix, this.props.filenames);
									} else if (this.state.fileStr !== selectedFilesString) {
										this.props.autoFileInput(param, this.state.fileStr, this.props.s3files.Prefix, this.props.filenames);
									}
									this.setFileStr(selectedFilesString);
								}}
							/>

	      			)}
	      			{(this.props.parameters[param].mode !== ParameterMode.USE_TV &&
	      				this.props.parameters[param].mode !== ParameterMode.USE_FUNC) ? 
	      				<MediaManager 
	      					parameterName={param} 
	      					mode={(!multiSelect) ? MediaManagerMode.select : MediaManagerMode.multiSelect}
	      					insertCallback={(selected, handleClose) => {
	      						this.props.insertFile(
	      							param,
									this.props.s3files,
									multiSelect,
									selected,
									handleClose,
								);

	      					}}
	      				/> :
	      				null
	      			}
	      			{this.appendFunctionEditor(param)}
					{this.appendTimelineVariable(param)}
	      		</div>
	    	</div>
	    	)
	}

	renderObjectEditor = (param) => {
		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
			{this.renderLabel()}
			<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
				{this.renderFieldContent(param, 
					<ObjectEditor
						targetObj={this.props.parameters[param].value}
						title={this.props.paramInfo.pretty_name+": "}
						keyName={param}
						submitCallback={(obj) => { this.props.setObject(param, obj); }}
					/>
				)}
				{this.appendFunctionEditor(param)}
			</div>
			</div>
		)
	}

	renderItem = () => {
		let { paramInfo, param } = this.props;
		let paramType = paramInfo.type;
		switch(paramType) {
				case EnumPluginType.AUDIO:
				case EnumPluginType.IMAGE:
				case EnumPluginType.VIDEO:
					// check if is array
					return this.renderMediaSelector(param, !!paramInfo.array);
				case EnumPluginType.BOOL:
					return this.renderToggle(param);
				case EnumPluginType.INT:
				case EnumPluginType.FLOAT:
					return this.renderNumberField(param);
				case EnumPluginType.FUNCTION:
					return this.renderFunctionEditor(param);
				// same different
				case EnumPluginType.SELECT:
					return this.renderSelect(param);
				case EnumPluginType.KEYCODE:
					return this.renderKeyboardInput(param);
				case EnumPluginType.OBJECT:
					return this.renderObjectEditor(param);
				case EnumPluginType.HTML_STRING:
				case EnumPluginType.STRING:
				default:
					return this.renderTextField(param);
		}
	}

	render() {
		return (
			this.renderItem()
		)
	}
}