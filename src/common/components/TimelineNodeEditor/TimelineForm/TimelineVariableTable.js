import React from 'react';

import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {Menu, MenuItem} from 'material-ui/Menu';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Popover from 'material-ui/Popover/Popover';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import SvgIcon from 'material-ui/SvgIcon';

import Uncheck from 'material-ui/svg-icons/toggle/star-border';
import Check from 'material-ui/svg-icons/toggle/star';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';
import UnCheckBoxIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CodeButtonIcon from 'material-ui/svg-icons/action/code';
import Add from 'material-ui/svg-icons/content/add-circle';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Launch from  'material-ui/svg-icons/action/launch';
import TableIcon from 'material-ui/svg-icons/action/view-list';
import UndoIcon from  'material-ui/svg-icons/content/undo';
import NumberIcon from 'material-ui/svg-icons/image/looks-one';
import ArrayIcon from 'material-ui/svg-icons/action/view-array';
import StringIcon from 'material-ui/svg-icons/editor/text-fields';
import LongStringIcon from 'material-ui/svg-icons/editor/insert-comment';
import ObjectIcon from 'material-ui/svg-icons/editor/mode-edit';
import FunctionIcon from 'material-ui/svg-icons/action/code';
import MediaIcon from 'material-ui/svg-icons/image/photo-library';
import {
	cyan500 as hoverColor,
	yellow500 as checkColor,
	pink500 as deleteColor,
	indigo500 as addColor,
	green500 as checkRadioColor,
	cyan500 as tableAddColor,
	pink500 as tableDelColor,
	indigo500 as tableAddHoverColor,
	orange500 as tableDelHoverColor
} from 'material-ui/styles/colors';

import { ParameterMode, TimelineVariableInputType, isString, isFunction } from '../../../reducers/Experiment/editor';
import { renderDialogTitle } from '../../gadgets';
import CodeEditor, { CodeLanguage } from '../../CodeEditor';
import ArrayEditor from '../../../containers/ArrayEditor';
import ObjectEditor from '../../../containers/ObjectEditor';
import MediaManager from '../../../containers/MediaManager';
import { MediaManagerMode } from '../../MediaManager';
import { components, style as TrialFormItemStyle } from '../TrialForm/TrialFormItem.js';

import GeneralTheme from '../../theme.js';
import deepEqual from 'deep-equal'

const constants = {
	GhostCellWidth: 50,
	CellHeight: 60,
	CellWidth: 175
}

const colors = {
	...GeneralTheme.colors,
	labelColor: '#B1B1B1',
	functionColor: '#708',
	arrayColor: GeneralTheme.colors.secondaryDeep,
	objectColor: '#00BCD4',
	mediaColor: '#2196F3'
};

const cssStyle = {
	MySheet: {
		root: utils.prefixer({
			width: 720,
			maxWidth: 720,
			minWidth: 720,
			height: 300,
			maxHeight: 300,
			minHeight: 300,
			overflow: 'auto'
		})
	},
	HeaderRow: {
		root: utils.prefixer({
			display: 'flex'
		})
	},
	Cell: {
		root: utils.prefixer({
			width: constants.CellWidth,
			maxWidth: constants.CellWidth,
			minWidth: constants.CellWidth,
			justifyContent: 'center',
			alignItems: 'center',
			display: 'flex',
			height: constants.CellHeight,
			minHeight: constants.CellHeight,
			maxHeight: constants.CellHeight
		})
	},
	GhostCell: {
		root: utils.prefixer({
			width: constants.GhostCellWidth,
			minWidth: constants.GhostCellWidth,
			maxWidth: constants.GhostCellWidth,
			justifyContent: 'center',
			alignItems: 'center',
			display: 'flex',
			height: constants.CellHeight,
			minHeight: constants.CellHeight,
			maxHeight: constants.CellHeight
		})
	},
	HeaderCell: {
		Container: utils.prefixer({
			width: '90%',
			height: '90%',
		}),
		Label: utils.prefixer({
			textOverflow: 'ellipsis',
			overflow: 'hidden',
			fontWeight: 'bold',
			whiteSpace: 'nowrap',
			color: colors.primary,
			maxHeight: 48,
		})
	},
	ContentCell: {
		root: utils.prefixer({
			display: 'flex',
		}),
		Container: utils.prefixer({
			width: '90%',
			height: '90%',
		}),
		Label: utils.prefixer({
			textOverflow: 'ellipsis',
			overflow: 'hidden',
			fontWeight: 'bold',
			textAlign: 'center',
			whiteSpace: 'nowrap',
			color: colors.primary,
			maxHeight: 48,
		})
	}
}

const style = {
	Icon: {
		color: colors.primaryDeep,
		// hoverColor: colors.secondary
	},
	TextFieldFocusStyle: {
		...GeneralTheme.TextFieldFocusStyle()
	},
	triggerIconStyle: {
		hoverColor: colors.secondary
	},
	deleteIconStyle: {
		color: colors.secondaryDeep,
		hoverColor: colors.secondary
	},
	addIconStyle: {
		...GeneralTheme.Icon
	},
	iconSize: {
		width: 36,
		height: 36
	},
	undoIconStyle: {
		hoverColor: colors.secondary
	},
	codeIconStyle: {
		color: colors.primaryDeep,
		hoverColor: colors.secondary
	},
	TriggerStyle: {
		...TrialFormItemStyle.TriggerStyle,
		fullWidth: true
	},
	TriggerIconStyle: {
		...TrialFormItemStyle.TriggerIconStyle
	},
	ContentCellTextFieldFocus: {
		underlineFocusStyle: {
			borderColor: colors.primaryDeep
		}
	}
};

const AddRowIcon = (props) => (
	<SvgIcon {...props}>
		<path d="M14.651 5.521V3.23H1.42v5.238h5.072c-.108.42-.172.858-.172 1.312 0 .037.005.073.005.11H0V1.809h16.072v5.254a5.284 5.284 0 0 0-1.421-1.542z"/>
		<path d="M11.7 14.263a4.378 4.378 0 0 0 4.372-4.373A4.377 4.377 0 0 0 11.7 5.517 4.377 4.377 0 0 0 7.327 9.89a4.379 4.379 0 0 0 4.373 4.373zm0-1.188a3.19 3.19 0 0 1-3.185-3.186A3.19 3.19 0 0 1 11.7 6.703a3.19 3.19 0 0 1 3.186 3.186 3.189 3.189 0 0 1-3.186 3.186z"/>
		<path d="M9.806 10.44V9.299h1.332V7.995h1.142v1.304h1.315v1.141H12.28v1.344h-1.142V10.44z"/>
	</SvgIcon>
)

const DeleteRowIcon = (props) => (
	<SvgIcon {...props}>
		<path d="M0 1.732v7.732h6.053c0-.035-.004-.07-.004-.104 0-.434.061-.854.165-1.255H1.36V3.092h12.662v2.192c.546.396 1.01.897 1.359 1.477V1.732H0z"/>
    	<path d="M11.196 5.28c-2.307 0-4.183 1.877-4.183 4.184 0 2.308 1.876 4.185 4.183 4.185 2.309 0 4.185-1.877 4.185-4.185 0-2.307-1.876-4.184-4.185-4.184zm0 7.233c-1.679 0-3.047-1.367-3.047-3.049 0-1.68 1.368-3.049 3.047-3.049 1.684 0 3.05 1.369 3.05 3.049 0 1.682-1.366 3.049-3.05 3.049z"/>
    	<path d="M9.312 8.759h3.844v1.104H9.312z"/>
	</SvgIcon>
)

const AddColumnIcon = (props) => (
	<SvgIcon {...props}>
		<path d="M6.237 16.546H3.649V1.604h5.916v5.728a5.92 5.92 0 0 1 1.479-.194c.042 0 .083.006.125.006V0H2.044v18.15h5.934a5.98 5.98 0 0 1-1.741-1.604z"/>
		<path d="M11.169 8.275c-2.723 0-4.938 2.215-4.938 4.938s2.215 4.938 4.938 4.938 4.938-2.215 4.938-4.938-2.215-4.938-4.938-4.938zm0 8.535a3.601 3.601 0 0 1-3.598-3.598c0-1.983 1.614-3.597 3.598-3.597s3.597 1.613 3.597 3.597a3.6 3.6 0 0 1-3.597 3.598z"/>
		<path d="M11.792 11.073h-1.29v1.505H9.03v1.29h1.472v1.484h1.29v-1.484h1.517v-1.29h-1.517z"/>
	</SvgIcon>
)

const DeleteColumnIcon = (props) => (
	<SvgIcon {...props}>
  		<path d="M6.237 16.546H3.649V1.604h5.916v5.728c.474-.122.968-.194 1.479-.194.042 0 .083.006.125.006V0H2.044v18.15h5.934c-.683-.414-1.274-.96-1.741-1.604z"/>
  		<path d="M11.169 8.275c-2.723 0-4.938 2.215-4.938 4.938s2.215 4.938 4.938 4.938 4.938-2.215 4.938-4.938-2.215-4.938-4.938-4.938zm0 8.535c-1.983 0-3.598-1.612-3.598-3.598 0-1.983 1.614-3.597 3.598-3.597s3.597 1.613 3.597 3.597c0 1.986-1.613 3.598-3.597 3.598z"/>
  		<path d="M9.312 12.759h3.844v1.104H9.312z"/>
  	</SvgIcon>
)


const matchInputTypeIcon = (type) => {
	switch (type) {
		case TimelineVariableInputType.NUMBER:
			return <NumberIcon {...style.Icon} />;
		case TimelineVariableInputType.MEDIA:
			return <MediaIcon {...style.Icon} />;
		case TimelineVariableInputType.ARRAY:
			return <ArrayIcon {...style.Icon} />;
		case TimelineVariableInputType.OBJECT:
			return <ObjectIcon {...style.Icon} />;
		case TimelineVariableInputType.TEXT:
			return <StringIcon {...style.Icon} />;
		case TimelineVariableInputType.LONG_TEXT:
			return <LongStringIcon {...style.Icon} />;
		case TimelineVariableInputType.FUNCTION:
			return <FunctionIcon {...style.Icon} />;
		default:
			return null;
	}
}

class HeaderCell extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			// dialog open
			open: false, 
			// header name
			variableName: this.props.variableName,
			// this header column input type
			type: this.props.type
		}

		this.handleOpen = () => {
			this.setState({
				open: true,
				variableName: this.props.variableName,
			})

		}

		this.handleClose = () => {
			this.setState({
				open: false
			})
		}

		this.setVariableName = (name) => {
			let c = name === this.props.variableName ? 0 : 1;
			for (let n of this.props.headers) {
				if (n === name) {
					c++;
				}
			}
			let error = name === '' || c > 1;
			this.setState({
				variableName: name,
				error: error,
				errorText: error ? (c > 1 ? 'Variable name duplicated!' : 'Invalid variable name!') : ''
			})
		}

		this.setType = (type) => {
			this.setState({
				type: type
			})
		}

		this.onCommit = () => {
			if (this.state.error) {
				this.props.notifyError(this.state.errorText);
				return;
			}
			let recordHistory = false;
			if (this.state.variableName !== this.props.variableName) {
				this.props.updateTimelineVariableName(this.props.variableName, this.state.variableName);
				this.props.recordHistory();
			}

			if (this.state.type !== this.props.type) {
				let isBothString = isString(this.state.type) && isString(this.props.type);
				let isTargetFunction = isFunction(this.state.type);
				if (isBothString || isTargetFunction) {
					this.props.updateTimelineVariableInputType(this.state.variableName, this.state.type, false);
					this.props.recordHistory();
				} else {
					this.props.notifyConfirm(
						'Value will be cleared for type coercion. Do you want to continue?',
						() => { 
							this.props.updateTimelineVariableInputType(this.state.variableName, this.state.type, true); 
							this.props.recordHistory();
						}
					);
				}
				
			}
			this.handleClose();
		}

		this.onCancel = () => {
			this.setVariableName(this.props.variableName);
			this.setType(this.props.type);
			this.handleClose();
		}
	}

	static defaultProps = {
		type: TimelineVariableInputType.TEXT,
		variableName: ""
	}

	render() {
		let actions = [
			<FlatButton
				label="Cancel"
				labelStyle={{
					color: colors.secondaryDeep
				}}
				onClick={this.onCancel}
			/>,
			<FlatButton
				label="Save"
				labelStyle={{
					color: colors.primaryDeep
				}}
				onClick={this.onCommit}
			/>,
		]

		return (
			<div style={{
				border: `1px solid ${colors.primaryDeep}`,
				...cssStyle.Cell.root,
			}}>
				<div
					style={{
						...cssStyle.HeaderCell.Container
					}}
				>
					<ListItem	
						containerElement="div"
						onClick={this.handleOpen}
						primaryText={
							<div 
								style={{
									...cssStyle.HeaderCell.Label
								}}
								title={`${this.props.variableName}`}
							>
							 {this.state.variableName}
							</div>
						}
						rightIconButton={
							<IconButton 
								disableTouchRipple
								onClick={this.handleOpen}
								tooltip={this.props.type}
							>
								{matchInputTypeIcon(this.props.type)}
							</IconButton>
						}
					/>
				</div>
				<Dialog
				  modal
		          open={this.state.open}
		          titleStyle={{padding: 0}}
		          actions={actions}
		        >	
		        	<TextField
		        		autoFocus
		        		id="TV-Table-Variable-Name_Field"
		        		{...GeneralTheme.TextFieldFocusStyle(this.state.error)}
		        		errorText={this.state.errorText}
		        		floatingLabelText="Variable Name"
		        		floatingLabelFixed
		        		value={this.state.variableName}
		        		onChange={(event, newVal) => this.setVariableName(newVal)} 
		        	/>
		        	<Divider />
					<List>
						{
							Object.values(TimelineVariableInputType).map((v, i) => (
								<ListItem
									key={`Input-Type-Choice-${v}-${i}`}
									primaryText={v}
									onClick={()=>{this.setType(v);}}
									rightIcon={
										v === this.state.type ?
										<CheckBoxIcon color={colors.primary}/>:
										<UnCheckBoxIcon color={colors.primary}/>
									}
								/>
							))
						}
					</List>
				</Dialog>
			</div>
		)
	}
}

const ContentCellLabelItem = ({onClick=()=>{}, value='', label='', rightIcon=null, labelStyle={}}) => (
	<ListItem	
		containerElement="div"
		onClick={onClick}
		primaryText={
			<div 
				style={{
					...cssStyle.ContentCell.Label,
					...labelStyle
				}}
				title={`${value}`}
			>
			 {label}
			</div>
		}
		rightIcon={rightIcon}
	/>
)

class ContentCell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			valueObject: utils.deepCopy(this.props.valueObject)
		}

		this.handleEdit = () => {
			this.setState({
				edit: true,
				// init
				valueObject: utils.deepCopy(this.props.valueObject)
			});
		}

		this.handleCloseEdit = () => {
			this.setState({
				edit: false,
			});
			this.onCommit();
		}

		this.setValue = (newVal, callback=()=>{}, isNormalValue=true) => {
			let clone = utils.deepCopy(this.state.valueObject);
			if (isNormalValue) {
				clone.value = newVal;
			} else {
				clone.func.code = newVal;
			}
			this.setState({
				valueObject: clone
			}, callback
			)
		}

		this.setCode = (code, callback=()=>{}) => {
			let clone = utils.deepCopy(this.state.valueObject);
			clone.func.code = code;
			this.setState({
				valueObject: clone
			}, callback
			)
		}

		this.onCommit = () => {
			if (!deepEqual(this.state.valueObject, this.props.valueObject)) {
				this.props.updateCell(this.props.columnName, this.props.rowNum, this.state.valueObject);
				this.props.recordHistory();
			}
		}

		this.isSelected = () => {
			return this.props.selectedRow === this.props.rowNum && this.props.selectedCol === this.props.colNum;
		}

		this.onCellSelect = () => {
			this.props.onCellSelect({row: this.props.rowNum, col: this.props.colNum})
		}

		this.renderTextFieldDialog = () => {
			let actions = [
				<FlatButton
					label="Cancel"
					labelStyle={{
						color: colors.secondaryDeep
					}}
					onClick={this.handleClose}
				/>,
				<FlatButton
					label="Save"
					labelStyle={{
						color: colors.primaryDeep
					}}
					onClick={this.onCommit}
				/>,
			]
			let isNumber = this.props.type === TimelineVariableInputType.NUMBER,
				value = isNumber ? 
						this.props.valueObject.value : 
						utils.toEmptyString(this.props.valueObject.value),
				label = isNumber ? value : `"${value}"`,
				stateValue = utils.toEmptyString(this.state.valueObject.value);
			return (
					!this.state.edit ?
					<ContentCellLabelItem onClick={this.handleEdit} value={value} label={label} /> :
					<div style={{width: '100%', height: '100%'}}>
						<TextField
							autoFocus
							fullWidth
							type={isNumber ? 'number' : 'text'}
			        		id="TV-Table-Variable-Cell"
			        		{...style.ContentCellTextFieldFocus}
			        		value={stateValue}
			        		onChange={(event, newVal) => this.setValue(newVal)} 
			        		onBlur={this.handleCloseEdit}
			        		onKeyPress={(e) => {
			        			if (e.which === 13) {
			        				this.handleCloseEdit();
			        			}
			        		}}
			        	/>
		        	</div>
			)
		}

		this.renderEditor = () => {
			let value, label;
			switch(this.props.type) {
				case TimelineVariableInputType.TEXT:
				case TimelineVariableInputType.NUMBER:
					return this.renderTextFieldDialog();
				case TimelineVariableInputType.LONG_TEXT:
				case TimelineVariableInputType.FUNCTION:
					let isString = this.props.type === TimelineVariableInputType.LONG_TEXT;
				    value = utils.toEmptyString(isString ? this.props.valueObject.value : this.props.valueObject.func.code),
					label = isString ? `"${value}"` : (value || 'void');
					return (
						<CodeEditor
							value={value}
							onCommit={(v) => {
								this.setValue(v, this.onCommit, isString);
							}}
							Trigger={
								({onClick}) => (
									<ContentCellLabelItem 
										onClick={onClick}
										value={value} 
										label={label}
										labelStyle={isString ? {} : { color: colors.functionColor, textDecoration: 'underline' }}
									/>
								)
							}
							language={isString ? CodeLanguage.html[0] : CodeLanguage.javascript[0]}
							onlyString={isString}
							onlyFunction={!isString}
							evalAsFunction={!isString}
							tooltip="Edit value"
						/>
					)
				case TimelineVariableInputType.ARRAY:
					// must be array
					value = this.props.valueObject.value;
					let len = value.length;
					label = len < 2 ? `[0 item]` : `[${len} items]`;
					
					return (
						<ArrayEditor
							value={value}
							onCommit={(v) => {
								this.setValue(v, this.onCommit);
							}}
							Trigger={
								({onClick}) => (
									<ContentCellLabelItem
										onClick={onClick}
										value={value}
										label={label}
										labelStyle={{color: colors.arrayColor, textDecoration: 'underline'}}
									/>
								)
							}
						/>
					);
				case TimelineVariableInputType.OBJECT:
					value = this.props.valueObject.value;
					label = "[Data Object]";
					return (
						<ObjectEditor
							value={value}
							onCommit={(v) => {
								this.setValue(v, this.onCommit);
							}}
							Trigger={
								({onClick}) => (
									<ContentCellLabelItem
										onClick={onClick}
										value={value}
										label={label}
										labelStyle={{color: colors.objectColor, textDecoration: 'underline'}}
									/>
								)
							}
						/>
					);
				case TimelineVariableInputType.MEDIA:
					value = this.props.valueObject.value;
					if (value.length > 0) {
						label = value[0].replace('<path>', '').replace('</path>', '');
					} else {
						label = "[No File]"
					}
					return (
						<MediaManager
							selected={value}
							onCommit={(v) => {
								this.setValue(v, this.onCommit);
							}}
							mode={MediaManagerMode.select}
							Trigger_insert={
								({onClick}) => (
									<ContentCellLabelItem
										onClick={onClick}
										value={value}
										label={label}
										labelStyle={{color: colors.mediaColor, textDecoration: 'underline'}}
									/>
								)
							}
						/>
					)
				default:
					return null;
			}
		}
	}

	static defaultProps = {
		// JspsychValueObject
		valueObject: {},
		// input type, TimelineVariableInputType ENUM 
		type: '',
		// column name
		columnName: '',
		// column number
		colNum: -1,
		// row number
		rowNum: -1,
	}

	render() {
		let { rowNum, colNum, onCellSelect, selectedRow, selectedCol, onCellDeselect } = this.props;
		let isSelected = selectedRow === rowNum && selectedCol === colNum,
			borderColor = isSelected ? colors.secondary : colors.primaryDeep,
			borderWeight = isSelected ? 2 : 1;

		return (
			<div
				style={{
					border: `${borderWeight}px solid ${borderColor}`,
					...cssStyle.Cell.root
				}}				
				onClick={() => { 
						if (isSelected) {
							onCellDeselect();
						} else {
							this.onCellSelect(); 
						}
					}
				}
			>
				<div
					style={{
						...cssStyle.ContentCell.Container
					}}
					onBlur={onCellDeselect}
				>
					{this.renderEditor()}
				</div>
			</div>
		)
	}
}

class GhostCell extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		// if is ghost (placeholder) cell of header row
		isHeaderRow: false,
		rowNum: 0,
	}

	render() {
		let { isHeaderRow } = this.props;

		return (
			<div
				style={{
					border: `1px solid ${colors.primaryDeep}`,
					...cssStyle.GhostCell.root
				}}
			>	
				{	
					isHeaderRow ?
					null :
					`${this.props.rowNum+1}.`
				}
			</div>
		)
	}
}

class HeaderRow extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		// headers, safely map row content to corresponding header
		headers: [],
		// this.props.inputType mapping from redux
		inputType: {},
	}

	render() {
		let { headers, inputType } = this.props;

		return (
			<div
				style={{
					...cssStyle.HeaderRow.root
				}}
			>
				<GhostCell isHeaderRow={true}/>
				{
					headers && headers.map((header, i) => {
						let type = inputType[header];
						return (
							<HeaderCell
								key={`timeline-variable-header-${i}`}
								variableName={header}
								type={type}
								{...this.props}
							/>
						)
					})
				}
			</div>
		)
	}
}

class ContentRow extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate() {
		return true;
	}

	static defaultProps = {
		// {} of [{},...,{}]
		row: {}, 
		// headers, safely map row content to corresponding header
		headers: [],
		// this.props.inputType mapping from redux
		inputType: {},
		rowNum: 0,
	}

	render() {
		let { row, headers, rowNum, inputType } = this.props;

		let isSelected;

		return (
			<div
				style={{
					...cssStyle.ContentCell.root
				}}
			>
				<GhostCell rowNum={rowNum}/>
				{
					headers && headers.map((cell, i) => {
						let columnName = headers[i],
							valueObject = row[columnName];

						return (
							<ContentCell
								key={`timeline-variable-cell-${rowNum}-${i}`}
								columnName={columnName}
								valueObject={valueObject}
								type={inputType[columnName]}
								colNum={i}
								{...this.props}
							/>
						)
					})
				}
			</div>
		)
	}
}

class MySheet extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		// using jsPsych timeline variable structure [{}...]
		table: [],
		// this.props.inputType mapping from redux
		inputType: {}
	}

	render() {
		let { table, headers } = this.props;

		return (
			<div 
				style={{
					...cssStyle.MySheet.root
				}}
			>
				<HeaderRow headers={headers} {...this.props}/>
				{
					table && table.map((row, i) => (
						<ContentRow 
							key={`timeline-variable-row-${i}`}
							{...this.props}
							headers={headers} 
							row={table[i]}
							rowNum={i}
						/>
					))
				}
			</div>
		)
	}
}

class TimelineVariableTableOpener extends React.Component {
	constructor(props) {
		super(props);

		this.onRowDelete = () => {
			if (this.props.selectedRow === null) {
				this.props.notifyWarningBySnackbar('Select a row first !')
				return;
			} else {
				this.props.deleteRow(this.props.selectedRow);
			}
		}

		this.onColDelete = () => {
			if (this.props.selectedCol === null) {
				this.props.notifyWarningBySnackbar('Select a column first !')
				return;
			} else {
				this.props.deleteColumn(this.props.selectedCol);
			}
		}

		this.renderToolbar = () => (
			<Toolbar className="Appbar-tools" style={{backgroundColor: 'white', flexGrow: '1'}}>
                  <ToolbarGroup firstChild={true}>
                    <IconButton
                    	tooltip="Insert Row"
                    	onClick={this.props.addRow}
	                   	iconStyle={{...style.iconSize}}
	                >
	                    <AddRowIcon {...style.addIconStyle}/>
                    </IconButton>
                    <IconButton
                    	tooltip="Delete Row"
                    	onClick={this.onRowDelete}
	                   	iconStyle={{...style.iconSize}}
	                >
	                    <DeleteRowIcon {...style.deleteIconStyle}/>
                    </IconButton>		
     
                    <ToolbarSeparator />

                	<IconButton
                    	tooltip="Insert Column"
                    	onClick={this.props.addColumn}
                    	iconStyle={{...style.iconSize}}
                    >
                    	<AddColumnIcon {...style.addIconStyle}/>
                    </IconButton>

                    <IconButton
                    	tooltip="Delete Column"
                    	onClick={this.onColDelete}
                    	iconStyle={{...style.iconSize}}
                    >
                    	<DeleteColumnIcon {...style.deleteIconStyle}/>
                    </IconButton>

                    <ToolbarSeparator />

                    <IconButton
                    	tooltip="Undo"
                    	disabled={this.props.history.length === 0}
                    	onClick={this.props.handleUndo}
                    >
                    	<UndoIcon {...style.undoIconStyle}/>
                    </IconButton>
                  </ToolbarGroup>
  			</Toolbar>
		)
	}

	static defaultProps = {
		// using jsPsych timeline variable structure [{}...]
		table: [],
		// this.props.inputType mapping from redux
		inputType: {}
	}

	render() {
		return (
			<div>
				<FlatButton
					{...style.TriggerStyle}
					label={"Open Timeline Table"}
					onClick={this.props.handleOpen}
					icon={<Launch {...style.TriggerIconStyle}/>}
				/>
				<Dialog
					open={this.props.open}
		      		contentStyle={{minHeight: 700}}
	              	titleStyle={{padding: 0}}
	              	style={{zIndex: 1000}}
		            title={renderDialogTitle(
			            	<Subheader style={{maxHeight: 58}}>{this.renderToolbar()}</Subheader>,  
			            	this.props.handleClose,  
			            	null, 
			            	{borderTop: `10px solid ${colors.primaryDeep}`}
		            	)}
		            modal={true}
		            bodyStyle={{
					  	paddingTop: '25px', 
					  	paddingBottom: '50px', 
					  	borderTop: '1px solid #aaa'
				}}
		      	>
		      		<MySheet {...this.props} />
		      	</Dialog>
			</div>
		)
	}
}

export default class TimelineVariableTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			history: [],
			selectedRow: null,
			selectedCol: null,
		}

		this.handleOpen = () => {
			this.setState({
				open: true,
				history: []
			})
		}

		this.handleClose = () => {
			this.setState({
				open: false,
				history: []
			})
		}

		this.recordHistory = () => {
			let history = this.state.history.slice();
			history.push(utils.deepCopy(this.props.timeline_variables));
			this.setState({
				history: history
			}) 
		}


		this.handleUndo = () => {
			if (this.state.history.length > 0) {
				this.props.setTable(this.state.history.pop());
			}
		}

		this.onCellSelect = ({row, col}) => {
			this.setState({
				selectedRow: row,
				selectedCol: col,
			})
		}

		this.onCellDeselect = () => {
			this.setState({
				selectedRow: null,
				selectedCol: null,
			})
		}
	}
	

	render() {
		return (
		  <div className="Trial-Form-Item-Container">
		  	<components.CustomFloatingLabelField
		  		label="Timeline Variables"
		  		node={
		  			<TimelineVariableTableOpener
		  				open={this.state.open}
		  				handleOpen={this.handleOpen}
		  				handleClose={this.handleClose}
		  				handleUndo={this.handleUndo}
		  				recordHistory={this.recordHistory}
		  				history={this.state.history}
						onCellSelect={this.onCellSelect}
						onCellDeselect={this.onCellDeselect}
						selectedRow={this.state.selectedRow}
						selectedCol={this.state.selectedCol}
		  				{...this.props}
		  			/>
		  		}
		  	/>
	      </div>
		 )
	}
}
