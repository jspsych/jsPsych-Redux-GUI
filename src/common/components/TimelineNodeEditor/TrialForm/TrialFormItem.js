import React from 'react';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import NumberInput from 'material-ui-number-input';
import FloatingActionButton from 'material-ui/FloatingActionButton';
// import Divider from 'material-ui/Divider';
// import { ListItem } from 'material-ui/List';

import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import BoxCheckIcon from 'material-ui/svg-icons/toggle/check-box';
import BoxUncheckIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import DeleteSubItemIcon from 'material-ui/svg-icons/navigation/close';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CollapseIcon from 'material-ui/svg-icons/navigation/more-horiz';
import ExpandIcon from 'material-ui/svg-icons/navigation/expand-more';
import {
  green500 as checkColor,
  cyan500 as boxCheckColor,
  grey300 as evenSubItemBackgroundColor,
  grey100 as oddSubItemBackgroundColor,
  cyan500 as hoverColor,
} from 'material-ui/styles/colors';

import { convertNullToEmptyString, deepCopy } from '../../../utils';
import MediaManager from '../../../containers/MediaManager';
import { MediaManagerMode } from '../../MediaManager';
import CodeEditor from '../../CodeEditor';
import { ParameterMode, locateNestedParameterValue } from '../../../reducers/Experiment/editor';
import TimelineVariableSelector from '../../../containers/TimelineNodeEditor/TrialForm/TimelineVariableSelectorContainer';
import ObjectEditor from '../../../containers/ObjectEditor';
import ArrayEditor from '../../../containers/ArrayEditor';
import TrialFormItemContainer from '../../../containers/TimelineNodeEditor/TrialForm/TrialFormItemContainer';

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

function PathNode(key, position=-1, next=null) {
	return {
		key: key,
		position: position,
		next: next
	};
}

const locateNestedParameterInfo = (paramInfo, path) => {
	let parameterInfo = paramInfo;

	if (typeof path === 'object') {
		while (path) {
			if (path.next) {
				parameterInfo = parameterInfo.nested;
				parameterInfo = parameterInfo[path.next.key];
			}
			path = path.next;
		}
	}

	return parameterInfo
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
		subFormCollapse: false,
	}

	toggleSubFormCollapse = () => {
		this.setState({
			subFormCollapse: !this.state.subFormCollapse
		})
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

	renderLabel = (param) => {

		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		return (
		<p
			className="Trial-Form-Label-Container"
		    style={labelStyle}
		    title={parameterInfo.description}
		>
		    {`${parameterInfo.pretty_name}: `}
		</p>
		)
	}

	appendFunctionEditor = (param, alternate=null) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		return (
		((this.state.showTool || 
			this.state.openFuncEditor || 
			parameterValue.mode === ParameterMode.USE_FUNC) &&
			parameterValue.mode !== ParameterMode.USE_TV) ?
			    <CodeEditor 
			    	setParamMode={() => { this.props.setParamMode(param); }}
					useFunc={parameterValue.mode === ParameterMode.USE_FUNC}
					showEditMode={true}
					initCode={convertNullToEmptyString(parameterValue.func.code)} 
					openCallback={this.showFuncEditor}
					closeCallback={this.hideFuncEditor}
                    submitCallback={(newCode) => { 
                      this.props.setFunc(param, newCode);
                    }}
                    title={`${parameterInfo.pretty_name}: `}
        		/>:
        		alternate
	)}

	appendTimelineVariable = (param, alternate=null) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		return (
		((this.state.showTool || 
			this.state.openTimelineVariable || 
			parameterValue.mode === ParameterMode.USE_TV) &&
			parameterValue.mode !== ParameterMode.USE_FUNC) ?
		<TimelineVariableSelector 
			openCallback={this.showTVSelector}
			closeCallback={this.hideTVSelector}
			useTV={parameterValue.mode === ParameterMode.USE_TV}
			title={`${parameterInfo.pretty_name}: `}
			selectedTV={parameterValue.timelineVariable}
			submitCallback={(newTV) => {
				this.props.setTimelineVariable(param, newTV);
			}}
			setParamMode={() => { this.props.setParamMode(param, ParameterMode.USE_TV); }}
		/> :
		null
		)
	}

	renderFieldContent = (param, node, autoConvertToArrayComponent=true) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		if (parameterInfo.array && autoConvertToArrayComponent) {
			node = (
				<ArrayEditor
					targetArray={parameterValue.value}
					title={`${parameterInfo.pretty_name}: `}
					keyName={param}
					submitCallback={(obj) => { this.props.setObject(param, obj); }}
				/>
			)
		}

		switch(parameterValue.mode) {
			case ParameterMode.USE_FUNC:
				return <MenuItem primaryText="[Custom Code]" style={{paddingTop: 2}} disabled={true} />;
			case ParameterMode.USE_TV:
				return <MenuItem
							primaryText="[Timeline Variable]"
							style={{paddingTop: 2}} 
							title={parameterValue.timelineVariable}
							disabled={true} />;
			default:
				return node;
		}
	}
	// primaryText={`[${(this.props.parameters[param].timelineVariable ? this.props.parameters[param].timelineVariable : "Timeline Variable")}]`}
	
	renderTextField = (param) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		// let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let node = (
			<TextField
			      id={"text-field-"+param}
			      value={convertNullToEmptyString(parameterValue.value)}
			      min={-1}
			      fullWidth={true}
			      onChange={(e, v) => { this.props.setText(param, v); }}
			    />
		);

		return (
		  <div style={{display: 'flex', width: "100%"}} >
			{this.renderLabel(param)}
		    <div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
		    {this.renderFieldContent(param, node)}
			{this.appendFunctionEditor(param)}
			{this.appendTimelineVariable(param)}
		    </div>
		  </div>
	  )}

	renderNumberField = (param) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		// let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let node = (
			<NumberInput
			      id={"number-field-"+param}
			      value={convertNullToEmptyString(parameterValue.value).toString()}
			      fullWidth={true}
			      onChange={(e, v) => {
						this.props.setNumber(param, v, EnumPluginType.FLOAT===this.props.paramInfo.type);
					}}
			    />
		)

		return (
			<div style={{display: 'flex', width: "100%"}} >
				{this.renderLabel(param)}
			    <div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
				    {this.renderFieldContent(param, node)}
					{this.appendFunctionEditor(param)}
					{this.appendTimelineVariable(param)}
			    </div>
		  </div>
		)
	}

	renderToggle = (param) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		// let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let node = (
			<IconButton 
	          onTouchTap={() => { this.props.setToggle(param); }} 
	          >
	        {(parameterValue.value) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
	        </IconButton>
		)

		return (
		<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      	{this.renderLabel(param)}
	      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
	      		{this.renderFieldContent(param, node)}
			    {this.appendFunctionEditor(param)}
			    {this.appendTimelineVariable(param)}
	        </div>
	    </div>
		)
	}

	renderFunctionEditor = (param) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let node = (<MenuItem primaryText="[Undefined]" style={{paddingTop: 2}} disabled={true} />);

		return (
		<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      	{this.renderLabel(param)}
	      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
	      		{this.renderFieldContent(param, node, false)}
			    <CodeEditor 
					initCode={convertNullToEmptyString(parameterValue.func.code)} 
                    submitCallback={(newCode) => { 
                      this.props.setFunc(param, newCode);
                    }}
                    useFunc={parameterValue.mode === ParameterMode.USE_FUNC}
					showEditMode={true}
                    setParamMode={() => { this.props.setParamMode(param); }}
                    title={`${parameterInfo.pretty_name}: `}
        		/>
        		{((this.state.showTool || 
				this.state.openTimelineVariable || 
				parameterValue.mode === ParameterMode.USE_TV)) ?
        		<TimelineVariableSelector 
					openCallback={this.showTVSelector}
					closeCallback={this.hideTVSelector}
					useTV={parameterValue.mode === ParameterMode.USE_TV}
					title={`${parameterInfo.pretty_name}: `}
					selectedTV={parameterValue.timelineVariable}
					submitCallback={(newTV) => {
						this.props.setTimelineVariable(param, newTV);
					}}
					setParamMode={() => { this.props.setParamMode(param, ParameterMode.USE_TV); }}
				/> :
				null}
	        </div>
	    </div>
		)
	}


	/*
	Render Procedure:
	1. Extract data and information
	2. Parse keys
	3. Set flags
	*/
	renderKeyboardInput = (param) => {

		// 1. Extract data and information
		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let value = parameterValue.value;

		// 2. Parse keys
		if (Array.isArray(value)) {
			let s = "";
			for (let v of value) {
				if (v === jsPsych.ALL_KEYS) s += v;
				else if (v.length > 1) s += `{${v}}`;
				else s += v.toUpperCase();
			}
			value = s;
		}

		// 3. Set flags
		// Is its value an Enum?
		let isAllKey = value === jsPsych.ALL_KEYS;
		// Can its value potentially be an array? That is, can there be multiple keys
		let isArray = !!parameterInfo.array;

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
				{(isAllKey) ? <BoxCheckIcon color={boxCheckColor} /> : <BoxUncheckIcon />}
			</IconButton>);

		let node = (
			(isAllKey) ?
			    <MenuItem primaryText="[ALL KEYS]" style={{paddingTop: 2}} disabled={true} />:
			    <TextField
			      id={this.props.id+"-text-field-"+param}
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
			      	this.props.setKey(param, this.state.keyListStr, false, isArray);
			      	this.setState({
			      		useKeyListStr: false
			      	})
			      }}
			      onKeyPress={(e) => {
			      	if (e.which === 13) {
			      		document.activeElement.blur();
			      	}
			      }}
			    />
		)

		return (
			<div style={{display: 'flex', width: "100%"}} >
			{this.renderLabel(param)}
		    <div 
		    	className="Trial-Form-Content-Container" 
		    	onMouseEnter={(isAllKey) ? ()=>{} : this.showTool} 
		    	onMouseLeave={this.hideTool}
		    >
		    {this.renderFieldContent(param, node, false)}
			{this.appendFunctionEditor(param, alternativeNode)}
			{this.appendTimelineVariable(param, alternativeNode)}
		    </div>
		  </div>
	)}

	renderSelect = (param) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		// let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let node = (
			<SelectField
		    	value={convertNullToEmptyString(parameterValue.value)}
		    	onChange={(event, index, value) => {
		    		this.props.setText(param, value);
		    	}}
		    >
		    {this.props.paramInfo.options.map((op, i) => (
		    	<MenuItem value={op} primaryText={op} key={op+"-"+i}/>
		    ))}
		    </SelectField>
		)

		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
	      		{this.renderLabel(param)}
		      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
		      		{this.renderFieldContent(param, node)}
					{this.appendFunctionEditor(param)}
					{this.appendTimelineVariable(param)}
		        </div>
	   		</div>
		)
	}

	renderMediaSelector = (param, multiSelect) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		// let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let selectedFilesString = processMediaPathTag(parameterValue.value);
		let node = (
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
						this.props.fileArrayInput(
							param,
							this.state.fileListStr, 
							this.props.s3files.Prefix, 
							this.props.filenames);
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
							this.props.autoFileInput(param, t, this.props.s3files.Prefix, this.props.filenames);
						}
					}}
					onFocus={() => {
						this.setState({
							useFileStr: true
						});
					}}
					onNewRequest={(s, i) => {
						if (i !== -1 && s !== selectedFilesString) {
							this.props.autoFileInput(param, s, this.props.s3files.Prefix, this.props.filenames);
						} else if (this.state.fileStr !== selectedFilesString) {
							this.props.autoFileInput(param, this.state.fileStr, this.props.s3files.Prefix, this.props.filenames);
						}
						this.setFileStr(selectedFilesString);
						this.setState({
							useFileStr: false
						});
					}}
				/>
		);

		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
				{this.renderLabel(param)}
	      		<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool}>
	      			{this.renderFieldContent(param, node, false)}
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

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let node = (
			<ObjectEditor
				targetObj={parameterValue.value}
				title={`${parameterInfo.pretty_name}: `}
				keyName={param}
				submitCallback={(obj) => { this.props.setObject(param, obj); }}
			/>
		);

		return (
			<div style={{display: 'flex', width: "100%", position: 'relative'}}>
			{this.renderLabel(param)}
			<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
				{this.renderFieldContent(param, node, false)}
				{this.appendFunctionEditor(param)}
			</div>
			</div>
		)
	}

	renderComplex = (param) => {

		/*
		parameterValue = {
			value: [], // must be array
		}
		*/
		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let node = (
			<IconButton
  				tooltip={(this.state.subFormCollapse) ? "Expand" : "Collapse"}
  				onTouchTap={this.toggleSubFormCollapse}
  			>
  			{(this.state.subFormCollapse) ? 
  				<CollapseIcon hoverColor={hoverColor} /> :
  				<ExpandIcon hoverColor={hoverColor} />
  			}
  			</IconButton>
		)

		return (
			<div style={{width: "100%"}}>
				<div style={{display: 'flex', width: "100%", position: 'relative'}}>
		      		{this.renderLabel(param)}
			      	<div className="Trial-Form-Content-Container" onMouseEnter={this.showTool} onMouseLeave={this.hideTool} >
			      		{this.renderFieldContent(param, node, false)}
						{this.appendFunctionEditor(param)}
						{this.appendTimelineVariable(param)}
			        </div>
			    </div>
			    {(parameterValue.mode === ParameterMode.USE_FUNC ||
			    	parameterValue.mode === ParameterMode.USE_TV ||
			    	this.state.subFormCollapse) ?
			    null :
			    <div style={{paddingLeft: "35%"}}>
			    	{
			    		parameterValue.value.map((p, i) => {
			    			let items = Object.keys(parameterInfo.nested).map((key, j) => {
			    				let newParam = deepCopy(param);
				    			if (typeof newParam !== 'object') {
				    				newParam = new PathNode(newParam);
				    			}
				    			let cur = newParam;
				    			while (cur.next) cur = cur.next;
				    			cur.next = new PathNode(key, i);
				    			return <TrialFormItemContainer 
				    						key={`${this.props.param}-${key}-${j}`}
				    						param={newParam}
				    						paramInfo={this.props.paramInfo}
				    					/>
			    			});

			    			let iconStyle = {
			    				width: 16,
			    				height: 16
			    			}

			    			let iconButtonStyle = {
			    				...iconStyle,
			    				padding: 0
			    			}

			   				return (
			   					<div 
			   						key={`complex-jsPysch-trial-item-container-${i}`} 
			   						style={{
			   							backgroundColor: (i%2 === 1) ? evenSubItemBackgroundColor : oddSubItemBackgroundColor,
			   						}}
			   						>
			   						<div 
			   							style={{ float: 'right', padding: 0, paddingRight: 5, paddingTop: 5}}
			   							key={`complex-jsPysch-trial-item-delete-conainer-${i}`} 
			   						>
				   						<IconButton  
				   							key={`complex-jsPysch-trial-item-delete-${i}`} 
				   							iconStyle={iconStyle}
				   							style={iconButtonStyle}
				   							onTouchTap={() => {this.props.depopulateComplex(param, i)}}
				   						>
				   							<DeleteSubItemIcon />
				   						</IconButton>
			   						</div>
			   						{items}
			   					</div>
			   				)

			    		})
			    	}
			    	<div style={{paddingTop: 5, float: 'right'}}>
				    	<FloatingActionButton 
				    		mini={true} 
				    		onTouchTap={() => {this.props.populateComplex(param, parameterInfo.nested)}}
				    	>
				    		<ContentAdd />
				    	</FloatingActionButton>
			    	</div>
			    </div>
				}
	   		</div>
		)
	}

	renderItem = (param=this.props.param) => {
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let paramType = parameterInfo.type;
		switch(paramType) {
				case EnumPluginType.AUDIO:
				case EnumPluginType.IMAGE:
				case EnumPluginType.VIDEO:
					// check if is array
					return this.renderMediaSelector(param, !!parameterInfo.array);
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
				case EnumPluginType.COMPLEX:
					return this.renderComplex(param);
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