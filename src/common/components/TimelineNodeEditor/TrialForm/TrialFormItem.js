import React from 'react';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
// import Divider from 'material-ui/Divider';
// import { ListItem } from 'material-ui/List';

import BoxCheckIcon from 'material-ui/svg-icons/toggle/check-box';
import BoxUncheckIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import DeleteSubItemIcon from 'material-ui/svg-icons/navigation/close';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CollapseIcon from 'material-ui/svg-icons/navigation/more-horiz';
import ExpandIcon from 'material-ui/svg-icons/navigation/expand-more';
import EditCodeIcon from 'material-ui/svg-icons/action/code';
import AddTimelineVarIcon from 'material-ui/svg-icons/action/swap-horiz';
import AddMediaIcon from 'material-ui/svg-icons/av/library-add';
import ObjectEditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import ArrayIcon from 'material-ui/svg-icons/action/view-array';
import {
  grey300 as evenSubItemBackgroundColor,
  grey100 as oddSubItemBackgroundColor,
} from 'material-ui/styles/colors';

import { convertNullToEmptyString, deepCopy, isValueEmpty } from '../../../utils';
import { FloatingLabelButton } from '../../gadgets';
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

import GeneralTheme from '../../theme.js';

const colors = {
	...GeneralTheme.colors,
	labelColor: '#B1B1B1',
	normalToggleColor: '#414141',
	dividerColor: 'rgb(224, 224, 224)',
	disabledColor: '#B1B1B1',
	errorRed: '#F34335'
};

const style = {
	SelectFieldToggleStyle: flag => ({
		labelStyle: {
			// color: flag ? colors.primary : colors.secondary
			color: colors.primaryDeep
		},
		selectedMenuItemStyle: {
			// color: flag ? colors.primary : colors.secondary
			color: colors.secondary
		}
	}),
	SelectFieldStyle: {
		selectedMenuItemStyle: {
			color: colors.secondary
		}
	},
	ToggleStyle: {
		IconButton: toggled => ({
			disableTouchRipple: true,
			style: {
				width: 24,
				height: 24,
				padding: 0,
				// backgroundColor: toggled ? '#C7C7C7' : '',
			},
			iconStyle: {
				width: 16,
				height: 16
			}
		}),
		Icon: toggled => ({
			color: toggled ? 'black' : '#BFBFBF',
			hoverColor: colors.secondary
		}),
	},
	ToggleGroup: {
		display: 'flex',
		justifyContent: 'space-evenly',
		backgroundColor: 'white',
		// boxShadow: '0 2px 5px rgba(0,0,0, .26)',
		marginLeft: '10px'
	},
	CustomFloatingLabelField: {
		root: {
			backgroundColor: 'transparent',
			fontFamily: 'Roboto, sans-serif',
			cursor: 'auto',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			marginTop: '10px',
			marginBottom: '10px',
		},
		FloatingLabel: error => ({
			zIndex: '1',
			transform: 'scale(0.95) translate(-1px, -3px)',
			transformOrigin: 'left top 0px',
			pointerEvents: 'none',
			userSelect: 'none',
			color: error ? colors.errorRed : 'rgba(0, 0, 0, 0.3)',
			display: 'inline-block',
			maxWidth: '100%',
			fontWeight: '700',
			fontSize: '13px',
			margin: 0,
		}),
		FieldGroup: {
			display: 'flex',
			alignItems: 'center'
		},
		ContentGroup: error => ({
			flexGrow: 1,
			borderBottom: error ? `2.5px solid ${colors.errorRed}` : `1px solid ${colors.dividerColor}`,
			paddingBottom: '5px',
		}),
		ErrorText: {
			color: colors.errorRed,
			fontWeight: 'bold',
			fontSize: '10px',
			paddingTop: '5px'
		},
		ToggleGroup: {
			flexBasis: 'auto',
			alignSelf: 'flex-end',
			display: 'flex',
			justifyContent: 'space-evenly',
			backgroundColor: 'white',
			// boxShadow: '0 2px 5px rgba(0,0,0, .26)',
			marginLeft: '10px',
			marginBottom: '10px',
		}
	},
	TriggerStyle: {
		backgroundColor: 'rgba(153, 153, 153, 0.15)',
		hoverColor: 'rgba(153, 153, 153, 0.25)',
		labelStyle: {
			color: colors.primaryDeep
		},
		labelPosition: 'before'
	},
	TriggerIconStyle: {
		...GeneralTheme.Icon,
		style: {
			width: 16,
			height: 16,
		}
	},
	UndefinedStyle: {
		backgroundColor: 'rgba(153, 153, 153, 0.15)',
		hoverColor: 'rgba(153, 153, 153, 0.25)',
	}
}


const components = {
	/*
	Keep them seperate in case of future changes
	*/
	Triggers: {
		ObjectEditor: ({label="Edit Object", onClick=()=>{}}) => (
			<FlatButton
				{...style.TriggerStyle}
				label={label}
				onClick={onClick}
				icon={<ObjectEditorIcon {...style.TriggerIconStyle}/>}
			/>
		),
		ArrayEditor: ({label="Edit Array", onClick=()=>{}}) => (
			<FlatButton
				{...style.TriggerStyle}
				label={label}
				onClick={onClick}
				icon={<ArrayIcon {...style.TriggerIconStyle}/>}
			/>
		),
		CodeEditor: ({label="Edit Code", onClick=()=>{}}) => (
			<FlatButton
				{...style.TriggerStyle}
				label={label}
				onClick={onClick}
				icon={<ObjectEditorIcon {...style.TriggerIconStyle}/>}
			/>
		),
		TimelineVariableSelector: ({label="Timeline Variables", onClick=()=>{}}) => (
			<FlatButton
				{...style.TriggerStyle}
				label={label}
				onClick={onClick}
				icon={<ObjectEditorIcon {...style.TriggerIconStyle}/>}
			/>
		),
		MediaSelector: ({label="Media Manager", onClick=()=>{}}) => (
			<FlatButton
				{...style.TriggerStyle}
				labelStyle={{
					textTransform: 'none',
					color: colors.primaryDeep
				}}
				labelPosition="before"
				icon={<AddMediaIcon {...style.TriggerIconStyle}/>}
				// icon={<img src='./middle.png'/>}
				label={label}
				onClick={onClick}
			/>
		),
	},
	Undefined: ({props={}}) => (
				<FlatButton
					disabled
					label={'[Undefined]'}
					{...props}
					{...style.UndefinedStyle}
				/>
	),
	CustomFloatingLabelField: ({label, node=null, ToggleFunc=null, ToggleTV=null, error=false, errorText=''}) => (
		<div style={{...style.CustomFloatingLabelField.root}}>
			<label style={{...style.CustomFloatingLabelField.FloatingLabel(error)}}>
				{label}
			</label>
			<div style={{...style.CustomFloatingLabelField.FieldGroup}}>
				<div style={{...style.CustomFloatingLabelField.ContentGroup(error)}}>
					{node}
				</div>
				<div style={{...style.CustomFloatingLabelField.ToggleGroup}}>
					{ToggleFunc}
					{ToggleTV}
				</div>
			</div> 
			{error ? 
				<span style={{...style.CustomFloatingLabelField.ErrorText}}>
					{errorText}
				</span> :
				null
			}
		</div>
	)
}

const hoverColor = GeneralTheme.colors.secondary;

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

const isParameterRequired = (parameterInfo) => {
	let isRequired = false;
	if (parameterInfo.hasOwnProperty('default')) {
		isRequired = parameterInfo.default === undefined;
	}
	return isRequired;
}

const generateFieldProps = (parameterValue, parameterInfo, autoConvertToArrayComponent=true) => {
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
			disabled = false;
	}

	return {
		value: val,
		disabled: disabled,
		floatingLabelText: parameterInfo.pretty_name,
		errorText: error ? 'This parameter is required.' : '',
		floatingLabelFixed: true,
		title: parameterInfo.description,
		...GeneralTheme.TextFieldFocusStyle
	}
}

/*
props explanations:

param: Field name of a plugin's parameter
paramInfo: jsPsych.plugins[Plugin Type].info.parameters[Field Name]

*/
export default class TrialFormItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showTool: true,
			// function editor dialog
			openFuncEditor: false, 
			// timeline variable selector dialog
			openTimelineVariable: false,
			keyListStr: "",
			useKeyListStr: false,
			subFormCollapse: false,
		}

		this.toggleSubFormCollapse = () => {
			this.setState({
				subFormCollapse: !this.state.subFormCollapse
			})
		}

		this.setKeyListStr = (str) => {
			this.setState({
				keyListStr: str
			});
		}

		this.showTool = () => {
			this.setState({
				showTool: true
			});
		}

		this.hideTool = () => {
			this.setState({
				// showTool: false
				showTool: true
			});
		}

		this.showFuncEditor = () => {
			this.setState({
				openFuncEditor: true
			});
		}

		this.hideFuncEditor = () => {
			this.setState({
				openFuncEditor: false
			});
		}

		this.showTVSelector = () => {
			this.setState({
				openTimelineVariable: true
			});
		}

		this.hideTVSelector = () => {
			this.setState({
				openTimelineVariable: false
			});
		}
	}

	static defaultProps = {
		paramInfo: "",
		param: "",
	}

	/**************************************************************************/

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
					Trigger={components.Triggers.ArrayEditor}
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
					Trigger={components.Triggers.ArrayEditor}
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
	
	/**************************************************************************/

	renderToggleFunc = ({param, parameterValue, parameterInfo}) => (
		<IconButton
			onClick={() => { this.props.setParamMode(param); }}
			{...style.ToggleStyle.IconButton(parameterValue.mode === ParameterMode.USE_FUNC)}
		>
			<EditCodeIcon {...style.ToggleStyle.Icon(parameterValue.mode === ParameterMode.USE_FUNC)}/>
		</IconButton>
	)

	renderToggleTV = ({param, parameterValue, parameterInfo}) => (
		<IconButton
			{...style.ToggleStyle.IconButton(parameterValue.mode === ParameterMode.USE_TV)}
			onClick={() => { this.props.setParamMode(param, ParameterMode.USE_TV); }}
		>
			<AddTimelineVarIcon {...style.ToggleStyle.Icon(parameterValue.mode === ParameterMode.USE_TV)}/>
		</IconButton>
	)

	renderField = ({
		param,
		parameterValue,
		parameterInfo,
		node = null,
		autoConvertToArrayComponent = true,
		forceCustomFloatingLabel = false,
	}) => {
		let useFunc = parameterValue.mode === ParameterMode.USE_FUNC,
			useTV = parameterValue.mode === ParameterMode.USE_TV,
			customFloatingLabel = true,
			isRequired = isParameterRequired(parameterInfo),
			error = isRequired && isValueEmpty(convertNullToEmptyString(parameterValue.value));  

		if (useFunc) {
			node = (
				<CodeEditor 
					Trigger={components.Triggers.CodeEditor}
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
		} else if (useTV) {
			node = (
				<TimelineVariableSelector 
					Trigger={components.Triggers.TimelineVariableSelector}
					openCallback={this.showTVSelector}
					closeCallback={this.hideTVSelector}
					useTV={parameterValue.mode === ParameterMode.USE_TV}
					title={`${parameterInfo.pretty_name}: `}
					selectedTV={parameterValue.timelineVariable}
					submitCallback={(newTV) => {
						this.props.setTimelineVariable(param, newTV);
					}}
					setParamMode={() => { this.props.setParamMode(param, ParameterMode.USE_TV); }}
				/>
			)
		} else if (parameterInfo.array && autoConvertToArrayComponent) {
			let val = parameterValue.value, label;
			if (Array.isArray(val)) {
				label = val.length > 1 ? `${val.length} Array Items` : `${val.length} Array Item`;
			} else {
				label = '0 Array Item';
			}
			node = (
				<ArrayEditor
					Trigger={({onClick}) => (components.Triggers.ArrayEditor({label: label, onClick: onClick}))}
					targetArray={parameterValue.value}
					title={`${parameterInfo.pretty_name}: `}
					keyName={param}
					submitCallback={(obj) => { this.props.setObject(param, obj); }}
				/>
			)
		} else {
			customFloatingLabel = false;
		}

		let args = {
			param: param,
			parameterValue: parameterValue,
			parameterInfo: parameterInfo,
		}
		let ToggleFunc = this.renderToggleFunc(args);
		let ToggleTV = this.renderToggleTV(args);

		return (customFloatingLabel || forceCustomFloatingLabel ?
			<div className="Trial-Form-Item-Container">
				<components.CustomFloatingLabelField
					label={parameterInfo.pretty_name}
					node={node}
					ToggleFunc={ToggleFunc}
					ToggleTV={ToggleTV}
					error={error}
					errorText={error ? 'This parameter is required.' : ''}
				/>
			</div> :
			<div className="Trial-Form-Item-Container">
				{node}
				<div style={{...style.ToggleGroup}}>
					{ToggleFunc}
					{ToggleTV}
				</div>
			</div>
			);
	}

	renderTextField = (param) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param);
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let args = {
			param: param,
			parameterValue: parameterValue,
			parameterInfo: parameterInfo,
			node: (
				<TextField
			      id={"text-field-"+param}
			      min={-1}
			      fullWidth={true}
			      onChange={(e, v) => { this.props.setText(param, v); }}
			      {...generateFieldProps(parameterValue, parameterInfo)}
			    />
			)
		}
		return this.renderField(args);
	}

	renderNumberField = (param) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param),
			parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param),
			props = generateFieldProps(parameterValue, parameterInfo);
		props.type = props.disabled ? 'text' : 'number';
		let args = {
			param: param,
			parameterValue: parameterValue,
			parameterInfo: parameterInfo,
			node: (
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
		}
		return this.renderField(args);
	}

	renderToggle = (param) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param),
			parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param),
			props = generateFieldProps(parameterValue, parameterInfo, false),
			items = [
				<MenuItem key={`toggle-field-${param}-1`} value={true}  primaryText="True"/>,
				<MenuItem key={`toggle-field-${param}-2`} value={false}  primaryText="False"/>
			];
		let args = {
			param: param,
			parameterValue: parameterValue,
			parameterInfo: parameterInfo,
			node: (
				<SelectField
		          onChange={(event, index, value) => { this.props.setToggle(param, value)}}
		          {...style.SelectFieldToggleStyle(props.value)}
		          {...props}
		        >
		          {items}
		        </SelectField>
			)
		}
		return this.renderField(args);
	}

	renderFunctionEditor = (param) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param),
			parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let args = {
			param: param,
			parameterInfo: parameterInfo,
			parameterValue: parameterValue,
			node: <components.Undefined />,
			forceCustomFloatingLabel: true
		}	
		return this.renderField(args);
	}


	/*
	Render Procedure:
	1. Extract data and information
	2. Parse keys
	3. Set flags
	*/
	renderKeyboardInput = (param) => {

		// 1. Extract data and information
		// deep copy as we need to parse key
		let parameterValue = deepCopy(locateNestedParameterValue(this.props.parameters, param));
		let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let value = parameterValue.value;

		// 2. Parse keys
		// Can its value potentially be an array? That is, can there be multiple keys
		let isArray = !!parameterInfo.array;
		if (isArray && Array.isArray(value)) {
			let s = "";
			for (let v of value) {
				if (v === jsPsych.ALL_KEYS) s += v;
				else if (v.length > 1) s += `{${v}}`;
				else s += v.toUpperCase();
			}
			value = s;
		}

		parameterValue.value = value;

		// 3. Set flags
		// Is its value an Enum?
		let isAllKey = value === jsPsych.ALL_KEYS;
		
		let toggleAllKey = (
			<IconButton 
				onClick={() => {
					if (isAllKey) {
						this.props.setKey(param, null, true);
					} else {
						this.props.setKey(param, jsPsych.ALL_KEYS, true);
					}
				}}
				tooltip="All Keys"
				onMouseEnter={this.hideTool} onMouseLeave={this.showTool}
			>
				{(isAllKey) ? <BoxCheckIcon color={GeneralTheme.colors.primary} /> : <BoxUncheckIcon />}
			</IconButton>
		);

		let props = generateFieldProps(parameterValue, parameterInfo, false);
		value = this.state.useKeyListStr ? this.state.keyListStr : convertNullToEmptyString(props.value);
		props.value = isAllKey ? '[ALL KEYS]' : value;
		props.disabled = props.disabled || isAllKey;

		let node = (
			<div style={{display: 'flex', alignItems: 'baseline'}}>
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
			   {toggleAllKey} 
			</div> 
		)

		let args = {
			param: param,
			parameterValue: parameterValue,
			parameterInfo: parameterInfo,
			node: node,
			autoConvertToArrayComponent: false
		}

		return this.renderField(args);
	}

	renderSelect = (param) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param),
			parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param),
			props = generateFieldProps(parameterValue, parameterInfo, false);
		let args = {
			param: param,
			parameterValue: parameterValue,
			parameterInfo: parameterInfo,
			node: (
				<SelectField
					multiple={paramInfo.array}
					id={this.props.id+"-select-field-"+param}
			    	onChange={(event, index, value) => {
			    		this.props.setText(param, value);
			    	}}
			    	{...style.SelectFieldStyle}
			    	{...props}
			    >
			    	{
			    		this.props.paramInfo.options.map((op, i) => (
			    			<MenuItem value={op} primaryText={op} key={op+"-"+i}/>
			    		))
			    	}
			    </SelectField>
			)
		}
		return this.renderField(args);
	}

	renderMediaSelector = (param, multiSelect) => {

		let parameterValue = locateNestedParameterValue(this.props.parameters, param),
			parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

		let regex = /<path>(.*)<\/path>/g;
		let label = regex.exec(parameterValue.value);
		if (label && label.length > 0) label = label[1];
		else label = 'Select Media';

		let args = {
			param: param,
			parameterValue: parameterValue,
			parameterInfo: parameterInfo,
			node: (
				<MediaManager 
					Trigger_insert={({onClick}) => (components.Triggers.MediaSelector({label: label, onClick: onClick}))}
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
			),
			forceCustomFloatingLabel: true
		};
		return this.renderField(args);
	}

	renderObjectEditor = (param) => {
		let parameterValue = locateNestedParameterValue(this.props.parameters, param),
			parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
		let args = {
			param: param,
			parameterInfo: parameterInfo,
			parameterValue: parameterValue,
			node: (
				<ObjectEditor
					Trigger={components.Triggers.ObjectEditor}
					targetObj={parameterValue.value}
					title={`${parameterInfo.pretty_name}: `}
					keyName={param}
					submitCallback={(obj) => { this.props.setObject(param, obj); }}
				/>
			),
			forceCustomFloatingLabel: true
		}	
		return this.renderField(args);
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
  				onClick={this.toggleSubFormCollapse}
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
				   							onClick={() => {this.props.depopulateComplex(param, i)}}
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
				    		onClick={() => {this.props.populateComplex(param, parameterInfo.nested)}}
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