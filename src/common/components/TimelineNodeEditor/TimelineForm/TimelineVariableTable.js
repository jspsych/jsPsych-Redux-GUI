import React from 'react';
import ReactDataGrid from 'react-data-grid';

import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import SvgIcon from 'material-ui/SvgIcon';

import Uncheck from 'material-ui/svg-icons/toggle/star-border';
import Check from 'material-ui/svg-icons/toggle/star';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import CodeButtonIcon from 'material-ui/svg-icons/action/code';
import Add from 'material-ui/svg-icons/content/add-circle';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Launch from  'material-ui/svg-icons/action/launch';
import TableIcon from 'material-ui/svg-icons/action/view-list';
import UndoIcon from  'material-ui/svg-icons/content/undo';
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

import { ParameterMode } from '../../../reducers/Experiment/editor';
import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');
import { renderDialogTitle } from '../../gadgets';
import { components, style as TrialFormItemStyle } from '../TrialForm/TrialFormItem.js';

import GeneralTheme from '../../theme.js';
import { deepCopy } from '../../../utils';
import deepEqual from 'deep-equal'

const colors = {
	...GeneralTheme.colors,
	labelColor: '#B1B1B1'
};

const style = {
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

class HeaderCell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			value: this.props.name
		}

		this.startEdit = () => {
			this.setState({
				edit: true
			})
		}

		this.closeEdit = () => {
			this.setState({
				edit: false
			})
			this.onCommit();
		}

		this.setValue = (e) => {
			this.setState({
				value: e.target.value
			})
		}

		this.onCommit = () => {
			this.props.recordHistory();
			if (this.state.value !== this.props.name) {
				let newName = this.state.value;
				let i = 0;
				while (!this.isValid(newName)) {
					if (newName.trim() === "") {
						newName = `H${i++}`;
					} else {
						newName = `${this.state.value}${++i}`;
					}
				}
				this.props.onCommit(newName);
			}
		}

		this.isValid = (name) => {
			return name.trim() !== "" && !this.props.hist[name];
		}
	}

	static defaultProps = {
		name: "",
	}

	render() {
		return (
			(this.state.edit) ?
				<div
					style={{width: "80%", textAlign: 'center', fontWeight: 'bold', color: 'black'}}
					onBlur={this.closeEdit} 
				>
					<TextField
						id="Header TextField"
						style={{width: "100%", outline: 'none', height: 36}}
						value={this.state.value}
						onChange={this.setValue}
						underlineFocusStyle={{borderColor: colors.secondary}}
					/>
				</div>:
				<div 
					style={{width: "80%", textAlign: 'center', fontWeight: 'bold', color: 'black'}}
					onDoubleClick={this.startEdit}>
					{this.props.name}
				</div>
		)
	}
}

class CustomEditor extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
	  		value: this.props.value
	  	}

	  	this.getValue = () => ({[this.props.column.key]: this.state.value});

	  	this.getInputNode = () => (this.refs.CustomEditorWrapper);

		this.getStyle = () => ({
			width: '100%'
		});

		this.handleOpen = () => {
			this.setState({
				open: true
			})
		}

		this.handleClose = () => {
			this.setState({
				open: false
			})
		}

		this.setValue = (v) => {
			this.setState({
				value: Object.assign({}, this.state.value, {
					value: v
				})
			});
		}
	}

	inheritContainerStyles() {
		return true;
	}

	render() {
	  	let { value } = this.state;
	    return (
	      <div>
	        <div ref="CustomEditorWrapper">
	          {(value.mode === ParameterMode.USE_FUNC) ?
	          	<div style={{width: "80%"}}>
		          	<TextField 
		          		title="[Custom Code]" 
		          		fullWidth={true}
		          		style={{paddingLeft: "10%", height: 40,}}
		          		inputStyle={{color: colors.primaryDeep, textAlign: 'center', fontSize: 14}}
		          		id="Timeline-Variable-Table-Editor"
		          		value="[Custom Code]" 
		          		underlineShow={false}
		          		disabled={true}
		          	/>
	          	</div> :
	          	<div style={{width: "80%",}}>
		          	<TextField 
		          		title={(value.value === null) ? "" : value.value}
		          		fullWidth={true}
		          		style={{paddingLeft: "10%", height: 40}}
		          		id="Timeline-Variable-Table-Editor"
		          		value={(value.value === null) ? "" : value.value}
		          		onChange={(e, v) => {
		          			this.setValue(v);
		          		}}
		          		underlineFocusStyle={{borderColor: colors.secondary}}
		          	/>
	          	</div>
	          }
	        </div>
	      </div>
	    )
	}
}

class GridCell extends React.Component {
	render() {
		let { value: complextDataObject } = this.props;
		switch(complextDataObject.mode) {
			case ParameterMode.USE_FUNC:
				return <div 
							title="[Custom Code]" 
							style={{color: colors.primaryDeep, textAlign: 'center', cursor: 'none'}}
						>
							[Custom Code]
						</div>;
			default:
				return <div title={complextDataObject.value}>{complextDataObject.value}</div>;
		}
	}
}

class CodeEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			code: this.props.code,
		}

		this.onUpdate = (newCode) => {
			this.setState({
				code: newCode
			});
		}
	}

	componentDidMount() {
		this.setState({
			code: (this.props.code === null) ? "" : this.props.code
		})
	}

	render() {
		let {
			open,
			handleClose,
			setParamMode,
			useFunc,
			setCode,
			title
		} = this.props;

		const actions = [
	      <FlatButton
	        label="Save"
	        style={{color: colors.primaryDeep}}
	        onClick={() => { setCode(this.state.code); handleClose() }}
	      />,
	    ];

		return (
			<Dialog
	      		contentStyle={{minHeight: 500}}
              	titleStyle={{padding: 0}}
	            title={renderDialogTitle(
	                <Subheader style={{fontSize: 18, maxHeight: 48}}>
	                	{title}
	                </Subheader>, 
	                handleClose, 
	                null)
	        	}
	            actions={actions}
	            modal={true}
	            open={open}
	            onRequestClose={handleClose}
	      	>
              <div style={{display: 'flex'}}>
	              <p style={{paddingTop: 15, color: (useFunc) ? colors.secondary : 'black'}}>
	                Use Custom Code:
	              </p>
	              <IconButton
	                onClick={setParamMode}
	                >
	                {(useFunc) ? <Check color={checkColor} /> : <Uncheck />}
	              </IconButton>
              </div>
	          <CodeMirror 
      			value={this.state.code} 
                onChange={this.onUpdate} 
                options={{lineNumbers: true}}
              />
	      	</Dialog>
		)
	}
}

class TimelineVariableTableOpener extends React.Component {
	constructor(props) {
		super(props);

		this.onRowDelete = () => {
			let index = this.props.selectedCell.row !== null ? this.props.selectedCell.row : this.props.numRows - 1;
			this.props.onRowDelete(index);
			this.props.loseFocusCallback();
		}

		this.onColDelete = () => {
			let index = this.props.selectedCell.col !== null ? this.props.selectedCell.col : this.props.numCols - 1;
			this.props.onColDelete(index);
			this.props.loseFocusCallback();
		}

		this.setEdittingCell = () => {
			if (this.props.selectedCell.row !== null && this.props.selectedCell.col !== null) {
				this.props.setEdittingCell(this.props.selectedCell);
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
                    	tooltip="Insert Code"
                    	onClick={this.setEdittingCell}
                    >
                    	<CodeButtonIcon {...style.codeIconStyle} />
                    </IconButton>

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
	
	render() {
		let { handleOpen, handleClose, open } = this.props;

	    const iconSize = {
	    	width: 36,
	    	height: 36
	    }

		return (
			<div>
				<FlatButton
					{...style.TriggerStyle}
					label={"Open Timeline Table"}
					onClick={handleOpen}
					icon={<Launch {...style.TriggerIconStyle}/>}
				/>
				<Dialog
					open={open}
		      		contentStyle={{minHeight: 700}}
	              	titleStyle={{padding: 0}}
	              	style={{zIndex: 1000}}
		            title={renderDialogTitle(
			            	<Subheader style={{maxHeight: 58}}>{this.renderToolbar()}</Subheader>,  
			            	handleClose,  
			            	null, 
			            	{borderTop: `10px solid ${colors.primaryDeep}`}
		            	)}
		            modal={true}
		            onRequestClose={handleClose}
		            bodyStyle={{
					  	paddingTop: '25px', 
					  	paddingBottom: '50px', 
					  	borderTop: '1px solid #aaa'
				}}
		      	>
		      		{this.props.spreadSheet}
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
			openSheetEditor: false,
			edittingCell: null,
			selectedCell: { row: null, col: null },
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

		this.rowGetter = (i) => {
			return this.props.rows[i];
		}

		this.recordHistory = () => {
			let history = this.state.history.slice();
			history.push(deepCopy(this.props.timeline_variables));
			this.setState({
				history: history
			}) 
		}

		this.handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
			let isUpdated = false;
			for (let i = fromRow; i <= toRow && !isUpdated; i++) {
				let row = this.props.timeline_variables[i];
				for (let key of Object.keys(updated)) {
					if (!deepEqual(row[key], updated[key])) {
						isUpdated = true;
						break;
					}
				}
			}

			if (isUpdated) {
				this.recordHistory();
				this.props.updateTimelineVariableRow(fromRow, toRow, updated);
			}
		}

		this.handleUndo = () => {
			if (this.state.history.length > 0) {
				this.props.setTable(this.state.history.pop());
			}
		}

		this.createDataGridColumn = () => {
			let columns = [];
			let { timeline_variables } = this.props;
			if (timeline_variables.length < 1) return columns;

			// since in jspsych data form, rows are objects with
			// same keys but possibly different values (see reducers/editor for detailed explanation)
			let sampleRowObject = timeline_variables[0];
			// generate table columns
			let variables = Object.keys(sampleRowObject);
			let hist = {};
			variables.forEach((v) => { hist[v] = true });
			for (let key of variables) {
				columns.push({
					key: key,
					name: key,
					resizable: true,
					editable: true,
					editor: CustomEditor,
					formatter: GridCell,
					width: 130,
					headerRenderer: () => (
						<HeaderCell 
							recordHistory={this.recordHistory}
							name={key}
							onCommit={(newName) => {
								this.props.updateTimelineVariableName(key, newName);
							}}
							hist={hist}
						/>
					),
				});
			}

			return columns;
		}

		this.setEdittingCell = (data) => {
			this.setState({
				edittingCell: data,
				openSheetEditor: true,
			});
		}

		this.setSelectedCell = (row, col) => {
			this.setState({
				selectedCell: { row: row, col: col }
			});
		}

		this.loseFocus = () => {
			this.setState({
				selectedCell: {row: null, col: null}
			})
		}

		this.handleCloseCodeEditor = () => {
			this.setState({
				openSheetEditor: false,
				edittingCell: null
			});
		}

		this.deleteRow = () => {
			this.recordHistory();
			this.props.deleteRow();
		}

		this.deleteColumn = () => {
			this.recordHistory();
			this.props.deleteColumn();
		}

		this.addRow = () => {
			this.recordHistory();
			this.props.addRow();
		}

		this.addColumn = () => {
			this.recordHistory();
			this.props.addColumn();
		}
	}
	

	render() {
	    let chosenCol, chosenCell;
		if (this.state.edittingCell) {
			let { row, col } = this.state.edittingCell;
	    	chosenCol = Object.keys(this.props.timeline_variables[0])[col];
	    	chosenCell = this.props.timeline_variables[row][chosenCol];
		}

		let numRows = this.props.timeline_variables.length;
		let numCols = Object.keys(this.props.timeline_variables[0]).length;

		let columns = this.createDataGridColumn();
		let spreadSheet = (
			  <div>
				<ReactDataGrid
			        enableCellSelect={true}
			        columns={columns}
			        rowGetter={this.rowGetter}
			        rowsCount={this.props.rows.length}
			        minHeight={350}
			        minColumnWidth={130} 
			        rowHeight={48}
			        headerRowHeight={48}
			        onCellSelected={(data) => {
			        	this.setSelectedCell(data.rowIdx, data.idx);
			        }}
			        onGridRowsUpdated={this.handleGridRowsUpdated}
			    />
		        {(this.state.edittingCell !== null) ?
	      	  	  <CodeEditor
	      	  		open={this.state.openSheetEditor}
	      	  		code={chosenCell.func.code}
	      	  		useFunc={chosenCell.mode === ParameterMode.USE_FUNC}
	      	  		handleClose={this.handleCloseCodeEditor}
	      	  		setParamMode={() => {
	      	  			let { row, col } = this.state.edittingCell;
	      	  			this.props.setParamMode(row, col);
	      	  		}}
	      	  		title={`${columns[this.state.edittingCell.col].name}, row ${this.state.edittingCell.row}`}
	      	  		setCode={(code) => {
	      	  			let { row, col } = this.state.edittingCell;
	      	  			this.props.setCode(row, col, code);
	      	  		}}
	      	  	  /> :
	      	  	  null
	      	    }
	      	  </div>
		)

		return (
		  <div className="Trial-Form-Item-Container">
		  	<components.CustomFloatingLabelField
		  		label="Timeline Variables"
		  		node={
		  			<TimelineVariableTableOpener
		  	 			open={this.state.open}
		  	 			history={this.state.history}
		  	 			handleUndo={this.handleUndo}
		  	 			handleOpen={this.handleOpen}
		  	 			handleClose={this.handleClose}
		  	 			handleUndo={this.handleUndo}
		  	 			onRowDelete={this.deleteRow} 
		        		onColDelete={this.deleteColumn} 
		        		addRow={this.addRow}
		        		addColumn={this.addColumn}
		  	 			spreadSheet={spreadSheet} 
		  	 			selectedCell={this.state.selectedCell}
		  	 			numCols={numCols}
		  	 			numRows={numRows}
		  	 			setEdittingCell={this.setEdittingCell} 
		  	 		/>
		  		}
		  	/>
		  	
	      </div>
		 )
	}
}


/*

		  	  	

key control


			        // onGridKeyDown={(e) => {
			        // 	let { row, col } = this.state.selectedCell;
			        // 	switch(e.which) {
			        // 		// right arrow
			        // 		case 39:
			        // 			if (++col === columns.length) {
			        // 				this.props.addColumn();
			        // 			}
			        // 			break;
			        // 		// down arrow
			        // 		case 40:
			        // 			if (++row === this.props.rows.length) {
			        // 				this.props.addRow();
			        // 			}
			        // 			break;
			        // 		default:
			        // 			break;
			        // 	}
			        // }}


*/