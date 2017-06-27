import React from 'react';
import IconButton from 'material-ui/IconButton';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import TableContextMenu from './TableContextMenu';

import { grey900 } from 'material-ui/styles/colors';

const tableStyles = {
	numbers: {
		border: '1px solid black',
		width: '25px',
		height: '15px'
	},
	small: {
		display: 'flex',
		right: '0px',
		height: '5px',
		width: '5px'
	},
	table: {
		tableLayout: 'fixed'
	},
	header: {
		border: '1px solid black',
		width: '50px',
		height: '20px'
	},
	size: {
		width: '100px',
	}
}

class EditableTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			isOpenContext: false,
			isOpenHeader: false,
		}

		this.handleTouchTap = (event) => {
			event.preventDefault();

			this.setState({
				open:true,
				anchorEl: event.currentTarget,
			});
		}

		this.handleRequestClose = () => {
			this.setState({
				open:false,
			});
		}

		this.closeContext = () => {
			this.setState({
				isOpenContext:false
			});
		}

		this.closeHeader = () => {
			this.setState({
				isOpenHeader:false
			})
		}

		this.handleColumnContextMenu = (event, index) => {
			event.preventDefault();
			console.log(index);
		
			this.setState({
				isOpenHeader: true,
				anchorEl: event.currentTarget,
				index: index
			});
		}

		this.handleContextMenu = (event, rowIndex, titleIndex) => {
			event.preventDefault();
			console.log(rowIndex);
			
			this.setState({
				isOpenContext: true,
				anchorEl: event.currentTarget,
				rowIndex: rowIndex,
				titleIndex: titleIndex
			});
			console.log(rowIndex);
		}

		this.onColumn = (event, rowIndex, titleIndex) => {
			this.props.onColumnDelete(rowIndex, titleIndex);
		}

		this.onRow = (event, rowIndex, titleIndex) => {
			this.props.onRowDelete(rowIndex, titleIndex);
		}

		this.onColumnHeader = (event, titleIndex) => {
			this.props.onColumnDeleteByHeader(titleIndex);
		}

		this.bindKeyboard = (event) => {
			switch(event.key) {
				case 'ArrowUp': this.onUpPress(event);
				break;
				case 'ArrowDown': this.onDownPress(event);
				break; 
				case 'ArrowLeft': this.onLeftPress(event);
				break;
				case 'ArrowRight': this.onRightPress(event);
				break;
				default: console.log("key pressed "+event.key);
			}	
		}

		this.onUpPress = (event) => {
			let cell = document.getElementById(event.target.id);
			let isFirstRow = cell.dataset.row; 
			let nextRowCell = cell.dataset.row-1;
			let column = cell.dataset.column;

			if(event.target.name == "tableHeader") {
			//Do nothing
			} else if(isFirstRow == 1) {
			document.getElementById(column).focus();
			} else {
			document.getElementById(nextRowCell+" "+column).focus();
			}
		}

		this.onDownPress = (event) => {
			let cell = document.getElementById(event.target.id);
			let id = cell.id.split(' ');
			let nextRowCell = id[0]*1+1;
			let column = cell.dataset.column;

	
			if(event.target.name == "tableHeader" && cell != null) {
				document.getElementById(1+" "+column).focus();
			} else if(document.getElementById(nextRowCell+" "+column) == null) {
				this.props.handleAddRow(event.target.id);
			} else {
				document.getElementById(nextRowCell+" "+column).focus();
			}
		}		

		this.onLeftPress = (event) => {
			let cell = document.getElementById(event.target.id);
			let nextColumn = cell.dataset.column-1;
			let row = cell.dataset.row;

			if(event.target.name == "tableHeader") {
				document.getElementById(nextColumn).focus();
			} else {
				document.getElementById(row+" "+nextColumn).focus();
			}

		}

		this.onRightPress = (event) => {
			let cell = document.getElementById(event.target.id);
			let nextColumn = cell.dataset.column*1+1;
			let row = cell.dataset.row;

			if(event.target.name == "tableHeader" && document.getElementById(nextColumn) != null) {
				document.getElementById(nextColumn).focus();
			} else if(event.target.name == "tableHeader" && document.getElementById(nextColumn) == null) {
				this.props.handleAddColumn(event.target.id);
			} else if(document.getElementById(nextColumn) == null) {
				this.props.handleAddColumn(event.target.id);
			} else {
				document.getElementById(row+" "+nextColumn).focus();
			}
		}
	}


	render(){
		var i = 0;
		var displayTable;
		// console.log(this.props.sampling.type);
		if(this.props.timeline_variables === undefined) {
			console.log("first");
				displayTable = 
				<table className="dataTable" style={tableStyles.table}>
					<thead>
						<tr>
							<td style={tableStyles.numbers}></td>
							<input id={0} key={0} defaultValue={undefined} style={tableStyles.header}
							onChange={(event) => this.props.handleHeaderChange(event.target.id, event.target.value)}
							onKeyDown={(event) => this.bindKeyboard(event)} />
						</tr>
					</thead>
					<tr>
						<td style={tableStyles.numbers}>1</td>
						<input id={1 + " "+0} defaultValue={undefined} style={tableStyles.header}
						onChange={(event) => this.props.handleTableChange(event.target.id, event.target.value)}
						onKeyDown={(event) => this.bindKeyboard(event)} />
					</tr>
				</table>

		} else {

			var timelineRows = this.props.timeline_variables;
			var headers = Object.keys(this.props.timeline_variables[0]);

			displayTable = <table className="dataTable" style={tableStyles.table}>
				<thead>
					<tr className="headerRow">
					<td style={tableStyles.numbers}></td>
					{
						headers.map((title, index) => {
							return <input name="tableHeader" data-row={0} data-column={index} id={index} defaultValue={title} 
							key={index}
							onChange={(event) => this.props.handleHeaderChange(event.target.id, event.target.value)} 
							onKeyDown={(event) => this.bindKeyboard(event)}
							onContextMenu={(event) => this.handleColumnContextMenu(event, index)}
							style={tableStyles.header} />
						})
					}
					</tr>
				</thead>
				{
					timelineRows.map((row, rowIndex) => {        ////index is number of rows
						return <tr id={"row"+" "+rowIndex} key={rowIndex}><td style={tableStyles.numbers}>{rowIndex+1}</td>{
							headers.map((title, titleIndex) => {
								return <input name={"cells"} data-row={rowIndex+1} data-column={titleIndex} id={[rowIndex+1] +" "+ titleIndex} style={tableStyles.header} 
								key={[rowIndex+1] +" "+ titleIndex} 
								defaultValue={row[headers[titleIndex]]} 
								onChange={(event) => this.props.handleTableChange(event.target.id, event.target.value)} 
								onKeyDown={(event) => this.bindKeyboard(event)}
								onContextMenu={(event) => this.handleContextMenu(event, rowIndex+1, titleIndex)} />
							})
						}
						</tr>
					})
				}
			</table>
		}

		return(
			<div>
			<RaisedButton
				onTouchTap={this.handleTouchTap}
				label="Timeline_Variables" />
			<Popover
				open={this.state.open}
				anchorEl={this.state.anchorEl}
				anchorOrigin= {{horizontal:"left",vertical:"top"}}
				targetOrigin= {{horizontal:"right",vertical:"top"}}
				onRequestClose={this.handleRequestClose} >

				{displayTable}

			<div>
			<Toggle label="Randomize_Order"
			defaultToggled={this.props.randomize_order}
			labelPosition="right"
			onToggle={this.props.onToggle} />
			<div style={{display: 'flex'}}>
			<SelectField floatingLabelText="Sampling"
			deafultValue="with-replacement"
			onChange={this.props.onChange} >
				<MenuItem value="with-replacement"
				primaryText="with-replacement" />
				<MenuItem value="without-replacement"
				primaryText="without-replacement" />
				<MenuItem value="fixed-repititions"
				primaryText="fixed-repititions" />
				<MenuItem value="custom"
				primaryText="custom" />
			</SelectField>
			<TextField
			floatingLabelText="Sampling Size"
			value={1}
			style={tableStyles.size}
			onChange={(event, newVal) => this.props.handleSampleSize(newVal)} />
			</div>
			</div>
			<TableContextMenu
				openContext={this.state.isOpenContext}
				anchorEl={this.state.anchorEl}
				anchorOrigin= {{horizontal:"left",vertical:"top"}}
				targetOrigin= {{horizontal:"right",vertical:"top"}}
				onDeleteColumn={(event) => this.onColumn(event, this.state.rowIndex, this.state.titleIndex)}
				onDeleteRow={(event) => this.onRow(event, this.state.rowIndex, this.state.titleIndex)}
				handleCloseContext={this.closeContext} 

				openHeader={this.state.isOpenHeader}
				anchorEl={this.state.anchorEl}
				anchorOrigin={{horizontal:"left",vertical:"top"}}
				targetOrigin={{horizontal:"right",vertical:"top"}}
				onDeleteColumnByHeader={(event) => this.onColumnHeader(event, this.state.index)}
				handleCloseHeader={this.closeHeader} />
			</Popover>
			</div>
			)
	}
}
export default EditableTable;



