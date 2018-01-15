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
const { Menu: { ContextMenu, MenuItem: ContextmenuItem } } = require('react-data-grid-addons');
import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');
import { renderDialogTitle } from '../../gadgets';
import { labelStyle } from '../TrialForm/TrialFormItem';


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
	defaultProps = {
		name: "",

	}

	state = {
		edit: false,
		value: this.props.name
	}

	startEdit = () => {
		this.setState({
			edit: true
		})
	}

	closeEdit = () => {
		this.setState({
			edit: false
		})
		this.onCommit();
	}

	setValue = (e) => {
		this.setState({
			value: e.target.value
		})
	}

	onCommit = () => {
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

	isValid = (name) => {
		return name.trim() !== "" && !this.props.hist[name];
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

function headerRenderer(props) {
	return <HeaderCell {...props} />
}

class MyContextMenu extends React.Component {
	
	setEdittingCell = () => {
		this.props.setEdittingCell({
			row: this.props.rowIdx,
			col: this.props.idx
		})
	}

	onRowDelete = () => {
		this.props.onRowDelete(this.props.rowIdx);
	}

	onColDelete = () => {
		this.props.onColDelete(this.props.idx);
	}

	insertRowAbove = () => {
		this.props.addRow(this.props.rowIdx);
	}

	insertRowBelow = () => {
		this.props.addRow(this.props.rowIdx + 1);
	}

	addColumn = () => {
		this.props.addColumn(this.props.idx);
	}

	render() {
	    return (
	    	<ContextMenu >
	    		<ContextmenuItem onClick={this.setEdittingCell}>
	    			<MenuItem primaryText="Insert code" rightIcon={<CodeButtonIcon color={hoverColor} />} />
	    		</ContextmenuItem>
	    		<Divider />
    			<MenuItem 
    				primaryText="Insert Row"
    				focusState="focused"
    				style={{zIndex: 2000}}
    				rightIcon={<Add color={addColor} />}
    				menuItems={[
    					<ContextmenuItem onClick={this.insertRowAbove}>
			    			<MenuItem primaryText="Above" />
						</ContextmenuItem>,
    					<ContextmenuItem onClick={this.insertRowBelow}>
			    			<MenuItem primaryText="Below" />
						</ContextmenuItem>
    					]}
    			/>
    			<ContextmenuItem onClick={this.addColumn}>
    				<MenuItem primaryText="Insert Column" rightIcon={<Add color={addColor} />} />
    			</ContextmenuItem>
	    		<Divider />
				<MenuItem 
    				primaryText="Delete"
    				focusState="focused"
    				rightIcon={<ArrowDropRight color={deleteColor} />}
    				menuItems={[
    					<ContextmenuItem onClick={this.onRowDelete}>
		    				<MenuItem primaryText="Row" />
		    			</ContextmenuItem>,
		    			<ContextmenuItem onClick={this.onColDelete}>
							<MenuItem primaryText="Column" />
						</ContextmenuItem>	
    					]}
    			/>	
		   	</ContextMenu>
	    );
	  }
}

class CustomEditor extends React.Component {
  state = {
  	value: this.props.value
  }

  getValue = () => {
    return {
      [this.props.column.key]: this.state.value
    };
  }

  getInputNode = () => {
    return this.refs.CustomEditorWrapper;
  }

  getStyle = () => {
    return {
      width: '100%'
    };
  }

  inheritContainerStyles() {
    return true;
  }

  handleOpen = () => {
  	this.setState({
  		open: true
  	})
  }

  handleClose = () => {
  	this.setState({
  		open: false
  	})
  }

  setValue = (v) => {
  	this.setState({
  		value: Object.assign({}, this.state.value, {
  			value: v
  		})
  	});
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
	          		inputStyle={{color: 'rgba(0, 0, 0, 0.3)', textAlign: 'center', fontSize: 14}}
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
							style={{color: 'rgba(0, 0, 0, 0.3)', textAlign: 'center'}}
						>
							[Custom Code]
						</div>;
			default:
				return <div title={complextDataObject.value}>{complextDataObject.value}</div>;
		}
	}
}

class CodeEditor extends React.Component {
	state = {
		code: this.props.code,
	}

	componentDidMount() {
		this.setState({
			code: (this.props.code === null) ? "" : this.props.code
		})
	}

	onUpdate = (newCode) => {
		this.setState({
			code: newCode
		});
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
	        label="Finish"
	        primary={true}
	        onTouchTap={() => { setCode(this.state.code); handleClose() }}
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
                null)}
	            actions={actions}
	            modal={true}
	            open={open}
	            onRequestClose={handleClose}
	      	>
              <div style={{display: 'flex'}}>
	              <p style={{paddingTop: 15, color: (useFunc) ? 'blue' : 'black'}}>
	                Use Custom Code:
	              </p>
	              <IconButton
	                onTouchTap={setParamMode}
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
	state = {
		open: false
	}

	handleOpen = () => {
		this.setState({
			open: true
		})
	}

	handleClose = () => {
		this.setState({
			open: false
		})
	}

	onRowDelete = () => {
		let index = this.props.selectedCell.row !== null ? this.props.selectedCell.row : this.props.numRows - 1;
		this.props.onRowDelete(index);
		this.props.loseFocusCallback();
	}

	onColDelete = () => {
		let index = this.props.selectedCell.col !== null ? this.props.selectedCell.col : this.props.numCols - 1;
		this.props.onColDelete(index);
		this.props.loseFocusCallback();
	}

	render() {
		let { handleOpen, handleClose } = this;

		const actions = [
	      // <FlatButton
	      //   label="Close"
	      //   labelStyle={{textTransform: 'none'}}
	      //   primary={true}
	      //   onTouchTap={handleClose}
	      // />,
	    ];

	    const toolbar = (
	    	<Toolbar className="Appbar-tools" style={{backgroundColor: 'white', flexGrow: '1'}}>
	                  <ToolbarGroup firstChild={true}>
	                    <IconButton
	                    	tooltip="Insert Row"
	                    	onTouchTap={this.props.addRow}
		                   	iconStyle={{width: 36, height: 36, color: tableAddColor}}
		                >
		                    <AddRowIcon hoverColor={tableAddHoverColor}/>
	                    </IconButton>
	                    <IconButton
	                    	tooltip="Delete Row"
	                    	onTouchTap={this.onRowDelete}
		                   	iconStyle={{width: 36, height: 36, color: tableDelColor}}
		                >
		                    <DeleteRowIcon hoverColor={tableDelHoverColor}/>
	                    </IconButton>		
	     
	                    <ToolbarSeparator />

	                	<IconButton
	                    	tooltip="Insert Column"
	                    	onTouchTap={this.props.addColumn}
	                    	iconStyle={{width: 36, height: 36, color: tableAddColor}}
	                    >
	                    	<AddColumnIcon hoverColor={tableAddHoverColor}/>
	                    </IconButton>

	                    <IconButton
	                    	tooltip="Delete Column"
	                    	onTouchTap={this.onColDelete}
	                    	iconStyle={{width: 36, height: 36, color: tableDelColor}}
	                    >
	                    	<DeleteColumnIcon hoverColor={tableDelHoverColor}/>
	                    </IconButton>
	                  </ToolbarGroup>
  			</Toolbar>
	    )

		return (
			<div>
				<IconButton
					tooltip="Open in seperate window"
					onTouchTap={handleOpen}
				>
				<Launch hoverColor={hoverColor} />
				</IconButton>
				<Dialog
					open={this.state.open}
		      		contentStyle={{minHeight: 700}}
	              	titleStyle={{padding: 0}}
	              	style={{zIndex: 1000}}
		            title={renderDialogTitle(
			            	<Subheader style={{maxHeight: 58}}>{toolbar}</Subheader>,  
			            	handleClose,  
			            	null, 
			            	{borderTop: `10px solid ${addColor}`}
		            	)}
		            actions={actions}
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

export function createDataGridRows(timelineVariable) {
	return timelineVariable.map((row) => {
		let strRow = {};
		for (let key of Object.keys(row)) {
			strRow[key] = (row[key] === null) ? "" : row[key];
		}
		return strRow;
	})
}

export default class TimelineVariableTable extends React.Component {
	state = {
		open: false,
		edittingCell: null,
		selectedCell: {row: null, col: null},
	}

	rowGetter = (i) => {
		return this.props.rows[i];
	}

	handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
		this.props.updateTimelineVariableRow(fromRow, toRow, updated);
	}

	createDataGridColumn = () => {
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
				width: 120,
				headerRenderer: () => { 
					return headerRenderer({
						name: key,
						onCommit: (newName) => {
							this.props.updateTimelineVariableName(key, newName);
						},
						hist: hist
					}); 
				},

			});
		}

		return columns;
	}

	setEdittingCell = (data) => {
		this.setState({
			edittingCell: data,
			open: true,
		});
	}

	setSelectedCell = (row, col) => {
		this.setState({
			selectedCell: {row: row, col: col}
		});
	}

	loseFocus = () => {
		this.setState({
			selectedCell: {row: null, col: null}
		})
	}

	handleCloseCodeEditor = () => {
		this.setState({
			open: false,
			edittingCell: null
		});
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
			        contextMenu={
			        	<MyContextMenu 
			        		onRowDelete={this.props.deleteRow} 
			        		onColDelete={this.props.deleteColumn} 
			        		addRow={this.props.addRow}
			        		addColumn={this.props.addColumn}
			        		setEdittingCell={this.setEdittingCell} 
			        		loseFocusCallback={this.loseFocus}
			        	/>
			        }
			        columns={columns}
			        rowGetter={this.rowGetter}
			        rowsCount={this.props.rows.length}
			        minHeight={350}
			        minColumnWidth={120} 
			        rowHeight={48}
			        headerRowHeight={48}
			        onCellSelected={(data) => {
			        	this.setSelectedCell(data.rowIdx, data.idx);
			        }}
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
			        onGridRowsUpdated={this.handleGridRowsUpdated}
			      />
			      {(this.state.edittingCell !== null) ?
		      	  	<CodeEditor
		      	  		open={this.state.open}
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
		  <div>
		      <div style={{display: 'flex', width: "100%"}} >
		      	<p  className="Trial-Form-Label-Container"
				    style={labelStyle}
				>
				    Timeline variables:
				</p>
				<div className="Trial-Form-Content-Container">
	  	  	 		<TimelineVariableTableOpener 
	  	  	 			onRowDelete={this.props.deleteRow} 
			        	onColDelete={this.props.deleteColumn} 
			        	addRow={this.props.addRow}
			        	addColumn={this.props.addColumn}
	  	  	 			spreadSheet={spreadSheet} 
	  	  	 			selectedCell={this.state.selectedCell}
	  	  	 			numCols={numCols}
	  	  	 			numRows={numRows}
	  	  	 		/>
	  	  	 	</div>
		  	  </div>
	      </div>
		 )
	}
}


			