import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import ContentAdd from 'material-ui/svg-icons/content/add';
import StringEditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import Clear from 'material-ui/svg-icons/content/delete-sweep';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import PasteIcon from 'material-ui/svg-icons/content/content-paste';
import ArrayIcon from 'material-ui/svg-icons/action/view-array';
import {
  grey100 as toolbarColor,
  pink500 as clearColor,
  orange500 as fixedTextColor,
  // grey50 as listBackgroundColor
} from 'material-ui/styles/colors';

import { renderDialogTitle } from '../gadgets';
import copy from 'copy-to-clipboard';
import { ParameterMode, createComplexDataObject } from '../../reducers/Experiment/editor';
import { stringify } from '../../backend/deploy';
import { deepCopy } from '../../utils';
import CodeEditor from '../CodeEditor';
import GeneralTheme from '../theme.js';

const colors = {
  ...GeneralTheme.colors,
}

const hoverColor = GeneralTheme.colors.secondary;

const style = {
	TriggerStyle: GeneralTheme.Icon,
	IconStyle: GeneralTheme.Icon,
	AddRowButtonStyle: {
		backgroundColor: colors.primaryDeep,
		mini: true,
	},
	actionButtons: {
		Submit: {
			labelStyle: {
				textTransform: "none",
				color: colors.primaryDeep
			}
		},
	}
}

const jsPysch_Builder_Array_Storage = "jsPsych_builder_array_clipboard";

const copyToLocalStorage = (objStr) => {
	window.localStorage.setItem(jsPysch_Builder_Array_Storage, objStr);
}

const pasteFromLocalStorage = () => {
	return window.localStorage[jsPysch_Builder_Array_Storage];
}

const convertToNull = (s) => {
	if (s === "" || s === undefined) return null;
	return s;
}

const convertReserved = (s) => {
	let floatRegex = /^-?\d+\.?\d*$/;
	let intRegex = /^-?\d+$/;
	switch(s) {
		case "true":
			return true;
		case "false":
			return false;
		case "null":
			return null;
		case "undefined":
			return undefined;
		default:
			if (intRegex.test(s)) {
				return parseInt(s, 10);
			} else if (floatRegex.test(s)) {
				return parseFloat(s);
			} else {
				return s;
			}
	}
}

const ValueTextColor = (value) => {
	switch(typeof value) {
		case 'string':
			return 'green';
		case 'number':
			return 'black';
		default:
			return 'blue';
	}
}

class ArrayValue extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
		}

		this.enterEditMode = () => {
			this.setState({
				edit: true
			});
		}

		this.exitEditMode = () => {
			this.setState({
				edit: false
			});
		}

		this.processNot = (s) => {
			if (s === null) return "null";
			if (s === undefined) return "undefined";
			return s;
		}
	}

	static defaultProps = {
		value: "",
		setArrayItem: () => {},
		index: 0,
	}

	render() {
		let { complexDataObject, index } = this.props;

		let value = complexDataObject.value;
		let textFieldValue = this.processNot(value);
		let displayValue = (typeof value === 'string') ?
		 `"${value}"` : 
		 (value !== null && value !== undefined) ? JSON.stringify(value) : textFieldValue;

		return (
			(complexDataObject.mode === ParameterMode.USE_TV) ? 
			<MenuItem 
				style={{minWidth: 200, maxWidth: 200, textAlign: 'center'}}
				primaryText={
					<p 
						className='truncate-long-string' 
						title={`Timeline variable: ${complexDataObject.timelineVariable}`}
					>
						{`[Timeline variable]`}
					</p>
				}
				disabled={true} 
				/> :
			(this.state.edit) ? 
				<TextField  id={`Array-${value}-${index}`}
							value={textFieldValue}
							onBlur={this.exitEditMode}
							onKeyPress={(e) => {
								if (e.which === 13) {
									document.activeElement.blur();
								} 
							}}
							onChange={(e, v) => { this.props.setArrayItem(v); }}
							inputStyle={{color: ValueTextColor(value), textOverflow: 'ellipsis'}}
							style={{minWidth: 200, maxWidth: 200}}
							/>:
				<MenuItem 
					onClick={this.enterEditMode}
					primaryText={
						<p 
							className='truncate-long-string'
							title={displayValue}
						>
						{displayValue}
						</p>
					}
					style={{minWidth: 200, maxWidth: 200, color: ValueTextColor(value), textAlign: 'center'}}
				/>
			)
	}
}

export default class ArrayEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			arrayItems: [],
		}

		this.unzip = (targetArray) => {
			this.setState({
				arrayItems: targetArray || [],
			})
		}

		this.handleOpen = () => {
			this.unzip(this.props.targetArray);
			this.setState({
				open: true
			});
		}

		this.handleClose = () => {
			this.setState({
				open: false,
			});
		}

		this.setArrayItem = (value, i) => {
			let newArrayItems = this.state.arrayItems.slice();
			newArrayItems[i].value = convertReserved(value);
			this.setState({
				arrayItems: newArrayItems
			})
		}

		this.setArrayItemMode = (i) => {
			let newArrayItems = this.state.arrayItems.slice();
			newArrayItems[i].mode = newArrayItems[i].mode === ParameterMode.USE_TV ? null : ParameterMode.USE_TV;
			this.setState({
				arrayItems: newArrayItems
			})
		}

		this.setArrayTimelineVariable = (v, i) => {
			let newArrayItems = this.state.arrayItems.slice();
			newArrayItems[i].timelineVariable = v;
			this.setState({
				arrayItems: newArrayItems
			})
		}

		this.deleteArrayItem = (i) => {
			let newArrayItems = this.state.arrayItems.slice();
			newArrayItems.splice(i, 1);

			this.setState({
				arrayItems: newArrayItems,
			});
		}

		this.addArrayItem = () => {
			// generate unique default key name

			let newArrayItems = this.state.arrayItems.slice();

			// init
			newArrayItems.push(createComplexDataObject(""));
			this.setState({
				arrayItems: newArrayItems,
			});
		}

		/*
		Will convert "" and undefined to null if we save it in redux store
		(so that dynamoDB will not ignore it)
		*/
		this.generateArray = (convert2Null=false) => {
			let { arrayItems } = this.state;
			let a = [];
			for (let i = 0; i < arrayItems.length; i++) {
				a.push(deepCopy(arrayItems[i]));
				a[i].value = (convert2Null) ? convertToNull(a[i].value) : a[i].value;
			}
			return a;
		}

		this.copyArray = () => {
			let obj = this.generateArray();
			let objStr = JSON.stringify(obj);
			copyToLocalStorage(objStr);
			copy(stringify(obj));
			this.props.notifySuccess("Array copied !");
		}

		this.paste = () => {
			let content = pasteFromLocalStorage();
			if (!content) {
				this.props.notifyError("Content is empty !");
			} else {
				try {
					this.unzip(JSON.parse(content));
				} catch(e) {
					this.props.notifyError(e.message);
				}
			}
		}

		this.onSubmit = () => {
			this.props.submitCallback(this.generateArray(true));
			this.handleClose();
		}


		this.renderRow = (value, i, isLast) => {
			return (
				<div style={{display: 'flex', paddingTop: (i === 0) ? 0 : 5}} key={`array-container-${i}`}>
					<ArrayValue
						complexDataObject={value}
						index={i}
						key={`array-value-${i}`}
						setArrayItem={(newValue) => {
							this.setArrayItem(newValue, i);
						}}
					/>
					<div style={{right: 0}} key={`array-code-container-${i}`}>
						<CodeEditor
							initCode={(typeof value.value === 'string') ? value.value : JSON.stringify(value.value)}
							submitCallback={(v) => {
								this.setArrayItem(v, i);
							}}
							key={`array-code-${i}`}
							tooltip="Edit value"
							buttonIcon={<StringEditorIcon hoverColor={hoverColor} />}
						/>
					</div>
					<div style={{right: 0}} key={`array-delete-container-${i}`}>
						<IconButton
							tooltip="delete item"
							key={`array-delete-${i}`}
							onClick={()=>{ this.deleteArrayItem(i); }}
						>
							<Clear key={`array-delete-icon-${i}`} color={clearColor} />
						</IconButton>
					</div>
					{(isLast) ? null : <MenuItem key={`array-sep-${i}`} primaryText="," disabled={true} />}
				</div>
			)
		}
	}

	static defaultProps = {
		targetArray: [],
		title: "",
		keyName: "",
		submitCallback: (p) => {},
		Trigger: ({onClick}) => (
			<IconButton
				onClick={onClick}
				title="Click to edit"
			>
				<ArrayIcon {...style.TriggerStyle}/>
			</IconButton>
		)
	}

	render() {
		let { title, keyName } = this.props;
		let {
			handleClose,
			renderRow,
			addArrayItem,
			onSubmit,
			copyArray,
			paste,
		} = this;
		let { arrayItems, open } = this.state;
		let actions = [
			<FlatButton 
				label="Save"
				keyboardFocused
				{...style.actionButtons.Submit}
				onClick={onSubmit}
			/>
		]

		return (
			<div>
				<this.props.Trigger onClick={this.handleOpen} />
				<Dialog
					open={open}
					titleStyle={{padding: 0}}
					title={renderDialogTitle(
						<Subheader style={{fontSize: 20}}>{title}</Subheader>,
						this.handleClose,
						null
						)}
					autoScrollBodyContent={true}
					modal={true}
					actions={actions}
				>
					<div style={{display: 'flex', backgroundColor: toolbarColor}}>
						<IconButton 
							tooltip="Copy"
							iconStyle={{width: 20, height: 20}}
							style={{width: 35, height: 35, padding: 10}}
							onClick={copyArray}
						>
							<CopyIcon {...style.IconStyle}/>
						</IconButton>
						<IconButton 
							tooltip="Paste"
							iconStyle={{width: 20, height: 20}}
							style={{width: 35, height: 35, padding: 10}}
							onClick={paste}
						>
							<PasteIcon {...style.IconStyle}/>
						</IconButton>
					</div>
					<p style={{padding: 0, paddingTop: 10, color: 'black'}}>{`${keyName} = [`}</p>
					<div>
						<List style={{
								maxHeight: 200, 
								minHeight: 200, 
								overflow: 'auto', 
								width: "80%", 
								margin: 'auto'}}>
							{Array.isArray(arrayItems) && arrayItems.map((v, i) => (renderRow(v, i, i === arrayItems.length - 1)))}
						</List>
					</div>
					<p style={{color: 'black'}}>]</p>
					<div style={{paddingTop: 15}}>
					<FloatingActionButton 
						onClick={addArrayItem}
						{...style.AddRowButtonStyle}
					>
	      				<ContentAdd />
	    			</FloatingActionButton>
	    			</div>
				</Dialog>
			</div>
		)
	}
}