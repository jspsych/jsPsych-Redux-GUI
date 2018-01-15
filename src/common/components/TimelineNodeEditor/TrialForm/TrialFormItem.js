import React from 'react';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
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
  cyan500 as trueColor,
  pink500 as falseColor
} from 'material-ui/styles/colors';

import { convertNullToEmptyString, deepCopy, isValueEmpty } from '../../../utils';
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

const SelectLableColor = (flag) => (flag ? trueColor : falseColor);

const isParameterRequired = (parameterInfo) => {
	let isRequired = false;
	if (parameterInfo.hasOwnProperty('default')) {
		isRequired = parameterInfo.default === undefined;
	}
	return isRequired;
}

const generateFieldProps = (parameterValue, parameterInfo) => {
	let isRequired = isParameterRequired(parameterInfo);
	let val = convertNullToEmptyString(parameterValue.value);
	let disabled = true;
	let error = isRequired && isValueEmpty(val);  

	switch (parameterValue.mode) {
		case ParameterMode.USE_FUNC:
			val = '[Custom Code]';
			break;
		case ParameterMode.USE_TV:
			val = '[Timeline Variable]';
			break;
		default:
			if (parameterInfo.array) {
				if (Array.isArray(val)) {
					val = val.length > 1 ? `${val.length} Array Items` : `${val.length} Array Item`;
				} else {
					val = '0 Array Item';
				}
			} else {
				disabled = false;
			}
	}

	return {
		value: val,
		disabled: disabled,
		floatingLabelText: parameterInfo.pretty_name,
		errorText: error ? 'This parameter is required.' : '',
		floatingLabelFixed: true,
		title: parameterInfo.description
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
		showTool: true,
		// function editor dialog
		openFuncEditor: false, 
		// timeline variable selector dialog
		openTimelineVariable: false,
		keyListStr: "",
		useKeyListStr: false,
		subFormCollapse: false,
	}

	toggleSubFormCollapse = () => {
		this.setState({
			subFormCollapse: !this.state.subFormCollapse
		})
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
			// showTool: false
			showTool: true
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
        		/>
		)
	}

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

	appendArrayEditor = (param, autoConvertToArrayComponent=true) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let node = null;
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
		return node;
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
	
	renderTextField = (param) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let node = (
			<TextField
			      id={"text-field-"+param}
			      min={-1}
			      fullWidth={true}
			      onChange={(e, v) => { this.props.setText(param, v); }}
			      {...generateFieldProps(parameterValue, parameterInfo)}
			    />
		);

		return (
		  <div className="Trial-Form-Item-Container">
		    	{node}
		    	{this.appendArrayEditor(param)}
				{this.appendFunctionEditor(param)}
				{this.appendTimelineVariable(param)}
		  </div>
	  )}

	renderNumberField = (param) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let props = generateFieldProps(parameterValue, parameterInfo);
		props.type = props.disabled ? 'text' : 'number';

		let node = (
			<TextField
			      type="number"
			      id={"number-field-"+param}
			      fullWidth={true}
			      onChange={(e, v) => {
						this.props.setNumber(param, v, EnumPluginType.FLOAT===this.props.paramInfo.type);
					}}
				  {...props}
			    />
		)

		return (
			<div className="Trial-Form-Item-Container">
		    	{node}
		    	{this.appendArrayEditor(param)}
				{this.appendFunctionEditor(param)}
				{this.appendTimelineVariable(param)}
		  	</div>
		)}

	renderToggle = (param) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let items = [
			<MenuItem key={`toggle-field-${param}-1`} value={true}  primaryText="True"/>,
			<MenuItem key={`toggle-field-${param}-2`} value={false}  primaryText="False"/>
		];

		let props = generateFieldProps(parameterValue, parameterInfo);

		let node = (
			<SelectField
	          onChange={(event, index, value) => { this.props.setToggle(param, value)}}
	          labelStyle={{color: SelectLableColor(props.value)}}
	          selectedMenuItemStyle={{color: SelectLableColor(props.value)}}
	          {...props}
	        >
	          {items}
	        </SelectField>
		)

		return (
			<div className="Trial-Form-Item-Container">
		    	{node}
		    	{this.appendArrayEditor(param)}
				{this.appendFunctionEditor(param)}
				{this.appendTimelineVariable(param)}
		  	</div>
		)}

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

		let toggleAllKey = (
			<IconButton 
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
			</IconButton>
		);

		let props = generateFieldProps(parameterValue, parameterInfo);
		value = this.state.useKeyListStr ? this.state.keyListStr : convertNullToEmptyString(props.value);
		props.value = isAllKey ? '[ALL KEYS]' : value;
		props.disabled = props.disabled || isAllKey;

		let node = (
			<TextField
		      id={this.props.id+"-text-field-"+param}
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
		      {...props}
		    />  
		)

		let funcMode = parameterValue.mode == ParameterMode.USE_FUNC;
		let tvMode = parameterValue.mode == ParameterMode.USE_TV;
		let inOtherMode = funcMode || tvMode;
		return (
			<div className="Trial-Form-Item-Container">
		    	{node}
		    	{this.appendArrayEditor(param)}
		    	{inOtherMode ? null : toggleAllKey}
		    	{isAllKey ? null : this.appendFunctionEditor(param)}
				{isAllKey ? null : this.appendTimelineVariable(param)}
		  	</div>
		)}

	renderSelect = (param) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let props = generateFieldProps(parameterValue, parameterInfo);

		let node = (
			<SelectField
				id={this.props.id+"-select-field-"+param}
		    	onChange={(event, index, value) => {
		    		this.props.setText(param, value);
		    	}}
		    	{...props}
		    >
		    	{
		    		this.props.paramInfo.options.map((op, i) => (
		    			<MenuItem value={op} primaryText={op} key={op+"-"+i}/>
		    		))
		    	}
		    </SelectField>
		)

		return (
			<div className="Trial-Form-Item-Container">
		    	{node}
		    	{this.appendArrayEditor(param)}
				{this.appendFunctionEditor(param)}
				{this.appendTimelineVariable(param)}
		  	</div>
		)
	}

	renderMediaSelector = (param, multiSelect) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let props = generateFieldProps(parameterValue, parameterInfo);

		let node = (
			<SelectField
				autoWidth
				id={this.props.id+"-media-selector-"+param}
				multiple={multiSelect}
				floatingLabelFixed
				{...props}
				onChange={(event, index, value) => {
		    		this.props.setMedia(param, value);
		    	}}
			>
				{this.props.filenames.map(
					filename => {
						let val = `<path>${filename}</path>`;
						let checked = multiSelect ?
									  Array.isArray(props.value) && props.value.indexOf(val) > -1 :
									  props.value === val;
						return (
							<MenuItem 
								key={`${this.props.id}-${filename}`}
								value={val}
								insetChildren={true}
								checked={checked}
								primaryText={filename}
							/>
						)
					}
				)}
			</SelectField>
		)

		let mediaSelector = (
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
			/>
		)

		let funcMode = parameterValue.mode == ParameterMode.USE_FUNC;
		let tvMode = parameterValue.mode == ParameterMode.USE_TV;
		let inOtherMode = funcMode || tvMode;
		return (
			<div className="Trial-Form-Item-Container" style={{alignItems: 'center'}}>
		    	{node}
		    	{this.appendArrayEditor(param)}
				{!inOtherMode ? mediaSelector : null}
      			{this.appendFunctionEditor(param)}
				{this.appendTimelineVariable(param)}
		  	</div>
	    	)}

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