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
		useKeyListStr: false,
		useFileStr: false,
		fileListStr: "",
		fileStr: "",
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

	renderLabel = ({
			description,
			prettyName
		}) => {

		description = description || this.props.paramInfo.description;
		prettyName = prettyName || this.props.paramInfo.pretty_name;

		return (
		<p
			className="Trial-Form-Label-Container"
		    style={labelStyle}
		    title={description}
		>
		    {`${prettyName}: `}
		</p>
	)}

	appendFunctionEditor = ({
			param,
			alternate = null,
			code,
			parameterMode,
			setParamModeCallback,
			submitCallback,
			prettyName
		}) => {

		param = param || this.props.param;
		code = code || this.props.parameters[param].func.code;
		parameterMode = parameterMode || this.props.parameters[param].mode;
		setParamModeCallback = setParamModeCallback || (() => { this.props.setParamMode(param); });
		submitCallback = submitCallback || ((newCode) => { this.props.setFunc(param, newCode); });
		prettyName = prettyName || this.props.paramInfo.pretty_name;

		return (
		((this.state.showTool || 
			this.state.openFuncEditor || 
			parameterMode === ParameterMode.USE_FUNC) &&
			parameterMode !== ParameterMode.USE_TV) ?
			    <CodeEditorTrigger 
			    	setParamMode={setParamModeCallback}
					useFunc={parameterMode === ParameterMode.USE_FUNC}
					showEditMode={true}
					initCode={convertNullToEmptyString(code)} 
					openCallback={this.showFuncEditor}
					closeCallback={this.hideFuncEditor}
                    submitCallback={submitCallback}
                    title={`${prettyName}: `}
        		/>:
        		alternate
	)}

	appendTimelineVariable = ({
			param,
			prettyName,
			alternate = null,
			selectedTV,
			parameterMode,
			setParamModeCallback,
			submitCallback,
		}) => {

		param = param || this.props.param;
		prettyName = prettyName || this.props.paramInfo.pretty_name;
		selectedTV = selectedTV || this.props.parameters[param].timelineVariable;
		parameterMode = parameterMode || this.props.parameters[param].mode;
		setParamModeCallback = setParamModeCallback || (() => { this.props.setParamMode(param, ParameterMode.USE_TV); });
		submitCallback = submitCallback || ((newTV) => { this.props.setTimelineVariable(param, newTV); });

		return	(
			((this.state.showTool || 
				this.state.openTimelineVariable || 
				parameterMode === ParameterMode.USE_TV) &&
				parameterMode !== ParameterMode.USE_FUNC) ?
			<TimelineVariableSelector 
				openCallback={this.showTVSelector}
				closeCallback={this.hideTVSelector}
				useTV={parameterMode === ParameterMode.USE_TV}
				title={`${prettyName}: `}
				selectedTV={selectedTV}
				submitCallback={submitCallback}
				setParamMode={setParamModeCallback}
			/> :
			null
		)
	}

	renderFieldContent = ({
			param,
			node = null,
			parameterMode,
			timelineVariableValue
		}) => {

		param = param || this.props.param;
		parameterMode = parameterMode || this.props.parameters[param].mode;
		timelineVariableValue = timelineVariableValue || this.props.parameters[param].timelineVariable;

		switch(parameterMode) {
			case ParameterMode.USE_FUNC:
				return <MenuItem primaryText="[Custom Code]" style={{paddingTop: 2}} disabled={true} />;
			case ParameterMode.USE_TV:
				return <MenuItem
							primaryText={`[TV: ${timelineVariableValue}]`}
							style={{paddingTop: 2}} 
							title="[Timeline Variable]"
							disabled={true} />;
			default:
				return node;
		}
	}
	
	renderTextField = ({
			param,
			paramInfo,
			compositeValue,
			onChange,
			setParamModeFuncCallback = null,
			setParamModeTimelineVariableCallback = null,
			submitFuncCallback = null,
			submitTimelineVariableCallback = null,
		}) => {

		param = param || this.props.param;
		paramInfo = paramInfo || this.props.paramInfo;
		compositeValue = compositeValue || this.props.parameters[this.props.param];
		onChange = onChange || ((e, v) => { this.props.setText(this.props.param, v); });

		let value = compositeValue.value;
		let { description, pretty_name: prettyName } = paramInfo;

		return (
		  <div style={{display: 'flex', width: "100%"}} >
			{this.renderLabel({description, prettyName})}
		    <div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
		    {this.renderFieldContent({param: param,
			    node: <TextField
				      	id={`text-field-${param}`}
				      	value={convertNullToEmptyString(value)}
				      	min={-1}
				      	fullWidth={true}
				      	onChange={onChange}
				    />,
				parameterMode: compositeValue.mode,
				timelineVariableValue: compositeValue.timelineVariable
				})
			}
			{
				this.appendFunctionEditor({
					param,
					prettyName,
					code: compositeValue.func.code,
					parameterMode: compositeValue.mode,
					setParamModeCallback: setParamModeFuncCallback,
					submitCallback: submitFuncCallback,
				})
			}
			{
				this.appendTimelineVariable({
					param,
					prettyName,
					selectedTV: compositeValue.timelineVariable,
					parameterMode: compositeValue.mode,
					setParamModeCallback: setParamModeTimelineVariableCallback,
					submitCallback: submitTimelineVariableCallback
				})
			}
		    </div>
		  </div>
	  )}

	renderNumberField = ({
			param,
			paramInfo,
			compositeValue,
			onChange,
			setParamModeFuncCallback = null,
			setParamModeTimelineVariableCallback = null,
			submitFuncCallback = null,
			submitTimelineVariableCallback = null,
		}) => {

		param = param || this.props.param;
		paramInfo = paramInfo || this.props.paramInfo;
		compositeValue = compositeValue || this.props.parameters[this.props.param];
		onChange = onChange || ((e, v) => { 
			this.props.setNumber(this.props.param, v, EnumPluginType.FLOAT===this.props.paramInfo.type); 
		});

		let value = compositeValue.value;
		let { description, pretty_name: prettyName } = paramInfo;

		return (
			<div style={{display: 'flex', width: "100%"}} >
				{this.renderLabel({description, prettyName})}
			    <div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
				    {this.renderFieldContent({
				    	param: param,
					    node: <NumberInput
					      id={`number-field-${param}`}
					      value={convertNullToEmptyString(value).toString()}
					      fullWidth={true}
					      onChange={onChange}
					    />,
						parameterMode: compositeValue.mode,
						timelineVariableValue: compositeValue.timelineVariable
						})
					}
					{
						this.appendFunctionEditor({
							param,
							prettyName,
							code: compositeValue.func.code,
							parameterMode: compositeValue.mode,
							setParamModeCallback: setParamModeFuncCallback,
							submitCallback: submitFuncCallback,
						})
					}
					{
						this.appendTimelineVariable({
							param,
							prettyName,
							selectedTV: compositeValue.timelineVariable,
							parameterMode: compositeValue.mode,
							setParamModeCallback: setParamModeTimelineVariableCallback,
							submitCallback: submitTimelineVariableCallback
						})
					}
			    </div>
		  </div>
		)
	}

	renderToggle = ({
			param,
			paramInfo,
			compositeValue,
			onChange,
			setParamModeFuncCallback = null,
			setParamModeTimelineVariableCallback = null,
			submitFuncCallback = null,
			submitTimelineVariableCallback = null,
		}) => {
		param = param || this.props.param;
		paramInfo = paramInfo || this.props.paramInfo;
		compositeValue = compositeValue || this.props.parameters[this.props.param];
		onChange = onChange || (() => { this.props.setToggle(this.props.param); });

		let value = compositeValue.value;
		let { description, pretty_name: prettyName } = paramInfo;

		return	(
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
		      	{this.renderLabel({description, prettyName})}
		      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
		      		{this.renderFieldContent({param,
				        node:<IconButton 
					          onTouchTap={onChange} 
					          >
					        {(value) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
					        </IconButton>,
							parameterMode: compositeValue.mode,
							timelineVariableValue: compositeValue.timelineVariable
							})
				    }
				    {
						this.appendFunctionEditor({
							param,
							prettyName,
							code: compositeValue.func.code,
							parameterMode: compositeValue.mode,
							setParamModeCallback: setParamModeFuncCallback,
							submitCallback: submitFuncCallback,
						})
					}
					{
						this.appendTimelineVariable({
							param,
							prettyName,
							selectedTV: compositeValue.timelineVariable,
							parameterMode: compositeValue.mode,
							setParamModeCallback: setParamModeTimelineVariableCallback,
							submitCallback: submitTimelineVariableCallback
						})
					}
		        </div>
		    </div>
		)
	}

	renderFunctionEditor = ({
			param,
			paramInfo,
			compositeValue,
			setParamModeFuncCallback = null,
			setParamModeTimelineVariableCallback = null,
			submitFuncCallback = null,
			submitTimelineVariableCallback = null,
		}) => {
		param = param || this.props.param;
		paramInfo = paramInfo || this.props.paramInfo;
		compositeValue = compositeValue || this.props.parameters[this.props.param];
		setParamModeFuncCallback = setParamModeFuncCallback || (() => { this.props.setParamMode(param); });
		setParamModeTimelineVariableCallback = setParamModeTimelineVariableCallback || (() => { this.props.setParamMode(param, ParameterMode.USE_TV); });
		submitFuncCallback = submitFuncCallback || ((newCode) => { this.props.setFunc(param, newCode); });
		submitTimelineVariableCallback = submitTimelineVariableCallback || ((newTV) => { this.props.setTimelineVariable(param, newTV); });

		let code = compositeValue.func.code;
		let mode = compositeValue.mode;
		let { description, pretty_name: prettyName } = paramInfo;

		return (<div style={{display: 'flex', width: "100%", position: 'relative'}}>
		      	{this.renderLabel({description, prettyName})}
		      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
		      		{this.renderFieldContent({param, 
		      			node: <MenuItem primaryText="[Undefined]" style={{paddingTop: 2}} disabled={true} />,
							parameterMode: compositeValue.mode,
							timelineVariableValue: compositeValue.timelineVariable
							})}
				    <CodeEditorTrigger 
						initCode={convertNullToEmptyString(code)} 
	                    submitCallback={submitFuncCallback}
	                    useFunc={mode === ParameterMode.USE_FUNC}
						showEditMode={true}
	                    setParamMode={setParamModeFuncCallback}
	                    title={`${prettyName}: `}
	        		/>
	        		{((this.state.showTool || 
					this.state.openTimelineVariable || 
					mode === ParameterMode.USE_TV)) ?
	        		<TimelineVariableSelector 
						openCallback={this.showTVSelector}
						closeCallback={this.hideTVSelector}
						useTV={mode === ParameterMode.USE_TV}
						title={`${prettyName}: `}
						selectedTV={compositeValue.timelineVariable}
						submitCallback={submitTimelineVariableCallback}
						setParamMode={setParamModeTimelineVariableCallback}
					/> :
					null}
		        </div>
		    </div>
		)
	}

	renderKeyboardInput = ({
			param = this.props.param,
			paramInfo = this.props.paramInfo,
			compositeValue = this.props.parameters[this.props.param],
			onChange,
			onClickToggle,
			setParamModeFuncCallback = null,
			setParamModeTimelineVariableCallback = null,
			submitFuncCallback = null,
			submitTimelineVariableCallback = null,
		}) => {

		param = param || this.props.param;
		paramInfo = paramInfo || this.props.paramInfo;
		compositeValue = compositeValue || this.props.parameters[this.props.param];
		onChange = onChange || ((str, flag, isArray) => { this.props.setKey(this.props.param, str, flag, isArray); });
		onClickToggle = onClickToggle || ((isAllKey) => {
				if (isAllKey) {
					this.props.setKey(this.props.param, null, true);
				} else {
					this.props.setKey(this.props.param, jsPsych.ALL_KEYS, true);
				}
			}
		);

		let { description, pretty_name: prettyName } = paramInfo;

		let value = compositeValue.value;
		if (Array.isArray(value)) {
			let s = "";
			for (let v of value) {
				if (v === jsPsych.ALL_KEYS) s += v;
				else if (v.length > 1) s += `{${v}}`;
				else s += v.toUpperCase();
			}
			value = s;
		}
		
		let isAllKey = value === jsPsych.ALL_KEYS;
		let isArray = !!paramInfo.array;

		let alternate = (<IconButton 
				onTouchTap={() => { onClickToggle(param, isAllKey); }}
				tooltip="All Keys"
				onMouseEnter={this.hideTool} onMouseLeave={this.showTool}
			>
				{(isAllKey) ? <BoxCheckIcon color={boxCheckColor} /> : <BocUncheckIcon />}
			</IconButton>);

		return (
			<div style={{display: 'flex', width: "100%"}} >
			{this.renderLabel({description, prettyName})}
		    <div 
		    	className="Trial-Form-Content-Container" 
		    	onMouseEnter={(isAllKey) ? ()=>{} : this.showTool} 
		    	onMouseLeave={this.hideTool}
		    >
		    {this.renderFieldContent({param,
			    node: (isAllKey) ?
				    <MenuItem primaryText="[ALL KEYS]" style={{paddingTop: 2}} disabled={true} />:
				    <TextField
				      id={`${this.props.id}-text-field-${param}`}
				      value={(this.state.useKeyListStr) ? this.state.keyListStr : convertNullToEmptyString(value)}
				      fullWidth={true}
				      onChange={(e, v) => { this.setKeyListStr(v); }}
				      maxLength={(isArray) ?  null : "1"}
				      onFocus={() => {
				      	this.setKeyListStr(convertNullToEmptyString(value));
				      	this.setState({
				      		useKeyListStr: true
				      	});
				      }}
				      onBlur={() => {
				      	onChange(this.state.keyListStr, false, isArray);
				      	this.setState({
				      		useKeyListStr: false
				      	})
				      }}
				      onKeyPress={(e) => {
				      	if (e.which === 13) {
				      		document.activeElement.blur();
				      	}
				      }}
				    />,
						parameterMode: compositeValue.mode,
						timelineVariableValue: compositeValue.timelineVariable
						})
			}
			{
				this.appendFunctionEditor({
					param,
					alternate,
					prettyName,
					code: compositeValue.func.code,
					parameterMode: compositeValue.mode,
					setParamModeCallback: setParamModeFuncCallback,
					submitCallback: submitFuncCallback,
				})
			}
			{
				this.appendTimelineVariable({
					param,
					alternate,
					prettyName,
					selectedTV: compositeValue.timelineVariable,
					parameterMode: compositeValue.mode,
					setParamModeCallback: setParamModeTimelineVariableCallback,
					submitCallback: submitTimelineVariableCallback
				})
			}
		    </div>
		  </div>
	)}

	renderSelect = ({
			param,
			paramInfo,
			compositeValue,
			onChange,
			setParamModeFuncCallback = null,
			setParamModeTimelineVariableCallback = null,
			submitFuncCallback = null,
			submitTimelineVariableCallback = null,
		}) => {

		param = param || this.props.param;
		paramInfo = paramInfo || this.props.paramInfo;
		compositeValue = compositeValue || this.props.parameters[this.props.param];
		onChange = onChange || ((event, index, value) => { this.props.setText(this.props.param, value); });

		let value = compositeValue.value;
		let { description, pretty_name: prettyName } = paramInfo;

		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      	{this.renderLabel({description, prettyName})}
	      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
	      		{this.renderFieldContent({param,
					node: <SelectField
					    	value={convertNullToEmptyString(value)}
					    	onChange={onChange}
					     >
					     {paramInfo.options.map((op, i) => (
					     	<MenuItem value={op} primaryText={op} key={`${op}-${i}`}/>
					     ))}
					     </SelectField>,
							parameterMode: compositeValue.mode,
							timelineVariableValue: compositeValue.timelineVariable
							})
				}
				{
					this.appendFunctionEditor({
						param,
						prettyName,
						code: compositeValue.func.code,
						parameterMode: compositeValue.mode,
						setParamModeCallback: setParamModeFuncCallback,
						submitCallback: submitFuncCallback,
					})
				}
				{
					this.appendTimelineVariable({
						param,
						prettyName,
						selectedTV: compositeValue.timelineVariable,
						parameterMode: compositeValue.mode,
						setParamModeCallback: setParamModeTimelineVariableCallback,
						submitCallback: submitTimelineVariableCallback
					})
				}
	        </div>
	    </div>
		)
	}

	renderMediaSelector = ({
			multiSelect = false,
			param,
			paramInfo,
			compositeValue,
			onChange,
			onUpdateInput,
			mediaInsertCallback,
			setParamModeFuncCallback = null,
			setParamModeTimelineVariableCallback = null,
			submitFuncCallback = null,
			submitTimelineVariableCallback = null,
		}) => {

		param = param || this.props.param;
		paramInfo = paramInfo || this.props.paramInfo;
		compositeValue = compositeValue || this.props.parameters[this.props.param];
		onChange = onChange || (() => { 
				this.props.fileArrayInput(
					this.props.param,
					this.state.fileListStr, 
					this.props.s3files.Prefix, 
					this.props.filenames
			);
		});
		onUpdateInput = onUpdateInput || ((t) => { 
			this.props.autoFileInput(this.props.param, t, this.props.s3files.Prefix, this.props.filenames); 
		});
		mediaInsertCallback = mediaInsertCallback || ((selected, handleClose) => {
			this.props.insertFile(
				this.props.param,
				this.props.s3files,
				multiSelect,
				selected,
				handleClose,
			);
		});

		let { description, pretty_name: prettyName } = paramInfo;
		let selectedFilesString = processMediaPathTag(compositeValue.value);
		let mode = compositeValue.mode;

		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
				{this.renderLabel({description, prettyName})}
	      		<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
	      			{this.renderFieldContent({
	      				param, 
	      				node:
	      				(multiSelect) ?
		      				<TextField 
									id={"Selected-File-Input-"+param}
									multiLine={true}
									rowsMax={3}
									rows={1}
									fullWidth={true}
									value={(this.state.useFileStr)? this.state.fileListStr : selectedFilesString}
									onChange={(e, v) => { 
										this.setFileListStr(v); 
									}}
									onFocus={() => {
										this.setFileListStr(selectedFilesString);
										this.setState({
											useFileStr: true
										});
									}}
									onBlur={() => { 
										onChange();
										this.setFileListStr(selectedFilesString);
										this.setState({
											useFileStr: false
										});
									}}
									onKeyPress={(e) => {
										if (e.which === 13) {
											document.activeElement.blur();
										}
									}}
								/> :
								<AutoComplete
									id={"Selected-File-Input-"+param}
									fullWidth={true}
									searchText={(this.state.useFileStr) ? this.state.fileStr : selectedFilesString}
									title={selectedFilesString}
									dataSource={this.props.filenames}
									filter={(searchText, key) => (searchText === "" || (key.startsWith(searchText) && key !== searchText))}
									listStyle={{maxHeight: 200, overflowY: 'auto'}}
									onUpdateInput={(t) => { 
										this.setFileStr(t); 
										if (t !== selectedFilesString && this.props.filenames.indexOf(t) > -1) {
											onUpdateInput(t);
										}
									}}
									onFocus={() => {
										this.setState({
											useFileStr: true
										});
									}}
									onNewRequest={(s, i) => {
										if (i !== -1 && s !== selectedFilesString) {
											onUpdateInput(s);
										} else if (this.state.fileStr !== selectedFilesString) {
											onUpdateInput(this.state.fileStr);
										}
										this.setFileStr(selectedFilesString);
										this.setState({
											useFileStr: false
										});
									}}
								/>
		      			,
						parameterMode: compositeValue.mode,
						timelineVariableValue: compositeValue.timelineVariable
						})
	      			}
	      			{(mode !== ParameterMode.USE_TV &&
	      				mode !== ParameterMode.USE_FUNC) ? 
	      				<MediaManager 
	      					parameterName={param} 
	      					mode={(!multiSelect) ? MediaManagerMode.select : MediaManagerMode.multiSelect}
	      					insertCallback={mediaInsertCallback}
	      				/> :
	      				null
	      			}
	      			{
					this.appendFunctionEditor({
						param,
						prettyName,
						code: compositeValue.func.code,
						parameterMode: compositeValue.mode,
						setParamModeCallback: setParamModeFuncCallback,
						submitCallback: submitFuncCallback,
					})
					}
					{
						this.appendTimelineVariable({
							param,
							prettyName,
							selectedTV: compositeValue.timelineVariable,
							parameterMode: compositeValue.mode,
							setParamModeCallback: setParamModeTimelineVariableCallback,
							submitCallback: submitTimelineVariableCallback
						})
					}
	      		</div>
	    	</div>
	    	)
	}

	renderObjectEditor = ({
			param,
			paramInfo,
			compositeValue,
			onChange,
			setParamModeFuncCallback = null,
			submitFuncCallback = null,
		}) => {

		param = param || this.props.param;
		paramInfo = paramInfo || this.props.paramInfo;
		compositeValue = compositeValue || this.props.parameters[this.props.param];
		onChange = onChange || ((obj) => { this.props.setObject(this.props.param, obj); });

		let value = compositeValue.value;
		let { description, pretty_name: prettyName } = paramInfo;

		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
			{this.renderLabel({description, prettyName})}
			<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
				{this.renderFieldContent({param, 
					node: <ObjectEditor
						targetObj={value}
						title={`${prettyName}: `}
						keyName={param}
						submitCallback={onChange}
					/>,
						parameterMode: compositeValue.mode,
						timelineVariableValue: compositeValue.timelineVariable
						})}
				{
					this.appendFunctionEditor({
						param,
						prettyName,
						code: compositeValue.func.code,
						parameterMode: compositeValue.mode,
						setParamModeCallback: setParamModeFuncCallback,
						submitCallback: submitFuncCallback,
					})
				}
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
					return this.renderMediaSelector({multiSelect: !!paramInfo.array});
				case EnumPluginType.BOOL:
					return this.renderToggle({});
				case EnumPluginType.INT:
				case EnumPluginType.FLOAT:
					return this.renderNumberField({});
				case EnumPluginType.FUNCTION:
					return this.renderFunctionEditor({});
				// same different
				case EnumPluginType.SELECT:
					return this.renderSelect({});
				case EnumPluginType.KEYCODE:
					return this.renderKeyboardInput({});
				case EnumPluginType.OBJECT:
					return this.renderObjectEditor({});
				case EnumPluginType.COMPLEX:
				case EnumPluginType.HTML_STRING:
				case EnumPluginType.STRING:
				default:
					return this.renderTextField({});
		}
	}

	render() {
		return (
			this.renderItem()
		)
	}
}