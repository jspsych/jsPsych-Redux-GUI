import React from 'react';
import ReactDataGrid from 'react-data-grid';

import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

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
} from 'material-ui/styles/colors';

import { ParameterMode } from '../../../reducers/Experiment/editor';
const { Menu: { ContextMenu, MenuItem: ContextmenuItem } } = require('react-data-grid-addons');
import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');
import { renderDialogTitle } from '../../gadgets';
import { labelStyle } from '../TrialForm/TrialFormItem';


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
					style={{width: "80%", textAlign: 'center'}}
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
		code: "",
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

	render() {
		let { handleOpen, handleClose } = this;

		const actions = [
	      <FlatButton
	        label="Close"
	        labelStyle={{textTransform: 'none'}}
	        primary={true}
	        onTouchTap={handleClose}
	      />,
	    ];

		return (
			<div>
				<IconButton
					tooltip="Open table"
					onTouchTap={handleOpen}
				>
				<Launch hoverColor={hoverColor} />
				</IconButton>
				<Dialog
					open={this.state.open}
		      		contentStyle={{minHeight: 500}}
	              	titleStyle={{padding: 0}}
	              	style={{zIndex: 1000}}
		            title={renderDialogTitle(
	                <Subheader style={{fontSize: 18, maxHeight: 48}}>
		                <div style={{display: 'flex'}}>
		                	<div style={{paddingTop: 5.5, paddingRight: 5}}><TableIcon color={addColor} /></div>
		                	<p>Timline Variable Table</p>
		                </div>
	                </Subheader>, 
	                handleClose, 
	                null)}
		            actions={actions}
		            modal={true}
		            onRequestClose={handleClose}
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
		selectedCell: {row: 0, col: 0},
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
				headerRenderer: () => { 
					return headerRenderer({
						name: key,
						onCommit: (newName) => {
							this.props.updateTimelineVariableName(key, newName);
						},
						hist: hist
					}); 
				} 
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
			        		setEdittingCell={this.setEdittingCell} 
			        		addColumn={this.props.addColumn}
			        	/>
			        }
			        columns={columns}
			        rowGetter={this.rowGetter}
			        rowsCount={this.props.rows.length}
			        minHeight={250}
			        minColumnWidth={120} 
			        rowHeight={48}
			        headerRowHeight={48}
			        onCellSelected={(data) => {
			        	this.setSelectedCell(data.rowIdx, data.idx);
			        }}
			        onGridKeyDown={(e) => {
			        	let { row, col } = this.state.selectedCell;
			        	switch(e.which) {
			        		// right arrow
			        		case 39:
			        			if (++col === columns.length) {
			        				this.props.addColumn();
			        			}
			        			break;
			        		// down arrow
			        		case 40:
			        			if (++row === this.props.rows.length) {
			        				this.props.addRow();
			        			}
			        			break;
			        		default:
			        			break;
			        	}
			        }}
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
		  	   <div style={{display: 'flex', width: "100%", position: 'relative', paddingBottom: 10}} >
					<p
					    style={labelStyle}
					>
					    Timeline variables:
					</p>
					<div style={{right: 0, position: 'absolute'}}>
		  	  	 		<TimelineVariableTableOpener spreadSheet={spreadSheet} />
		  	  	 	</div>
		  	  	 </div>
			  <div style={{maxHeight: 300, width: "100%"}}>
			      {spreadSheet}
		      </div>
		      <div style={{display: 'flex', width: "100%", paddingTop: 10}} >
					<p
						className="Trial-Form-Label-Container"
					    style={labelStyle}
					>
					    Randomize order:
					</p>
					<div className="Trial-Form-Content-Container">
					<IconButton 
				         onTouchTap={() => { this.props.toggleRandomize(); }} 
				    >
				       {(this.props.randomize) ? <CheckIcon color={checkRadioColor} /> : <UnCheckIcon />}/>
				    </IconButton>
				    </div>
			</div>
	      </div>
		 )
	}
}
