import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import TableContextMenu from './TableContextMenu';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { convertNullToEmptyString } from '../../../utils';

import { labelStyle } from '../TrialForm/TrialFormItem';

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
			expanded: false,
		}

		this.handleTouchTap = (event) => {
			event.preventDefault();

			this.setState({
				open: true,
				anchorEl: event.currentTarget,
			});
		}

		this.handleRequestClose = () => {
			this.setState({
				open: false,
			});
		}

		this.closeContext = () => {
			this.setState({
				isOpenContext: false
			});
		}

		this.closeHeader = () => {
			this.setState({
				isOpenHeader: false
			})
		}

		this.handleColumnContextMenu = (event, index) => {
			event.preventDefault();
			this.setState({
				isOpenHeader: true,
				anchorElColumn: event.currentTarget,
				index: index
			});
		}

		this.handleContextMenu = (event, rowIndex, titleIndex) => {
			event.preventDefault();
			this.setState({
				isOpenContext: true,
				anchorElContext: event.currentTarget,
				rowIndex: rowIndex,
				titleIndex: titleIndex
			});
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
			switch (event.key) {
				case 'ArrowUp':
					this.onUpPress(event);
					break;
				case 'ArrowDown':
					this.onDownPress(event);
					break;
				case 'ArrowLeft':
					this.onLeftPress(event);
					break;
				case 'ArrowRight':
					this.onRightPress(event);
					break;
				default:
					console.log("key pressed " + event.key);
			}
		}

		this.onUpPress = (event) => {
			let cell = document.getElementById(event.target.id);
			let isFirstRow = cell.dataset.row;
			let nextRowCell = cell.dataset.row - 1;
			let column = cell.dataset.column;

			if (event.target.name === "tableHeader") {
				//Do nothing
			} else if (isFirstRow === 1) {
				document.getElementById(column).focus();
			} else {
				document.getElementById(nextRowCell + " " + column).focus();
			}
		}

		this.onDownPress = (event) => {
			let cell = document.getElementById(event.target.id);
			let id = cell.id.split(' ');
			let nextRowCell = id[0] * 1 + 1;
			let column = cell.dataset.column;


			if (event.target.name === "tableHeader" && cell != null) {
				document.getElementById(1 + " " + column).focus();
			} else if (document.getElementById(nextRowCell + " " + column) === null) {
				this.props.handleAddRow(event.target.id);
			} else {
				document.getElementById(nextRowCell + " " + column).focus();
			}
		}

		this.onLeftPress = (event) => {
			let cell = document.getElementById(event.target.id);
			let nextColumn = cell.dataset.column - 1;
			let row = cell.dataset.row;

			if (event.target.name === "tableHeader") {
				document.getElementById(nextColumn).focus();
			} else {
				document.getElementById(row + " " + nextColumn).focus();
			}

		}

		this.onRightPress = (event) => {
			let cell = document.getElementById(event.target.id);
			let nextColumn = cell.dataset.column * 1 + 1;
			let row = cell.dataset.row;

			if (event.target.name === "tableHeader" && document.getElementById(nextColumn) != null) {
				document.getElementById(nextColumn).focus();
			} else if (event.target.name === "tableHeader" && document.getElementById(nextColumn) == null) {
				this.props.handleAddColumn(event.target.id);
			} else if (document.getElementById(nextColumn) === null) {
				this.props.handleAddColumn(event.target.id);
			} else {
				document.getElementById(row + " " + nextColumn).focus();
			}
		}

		this.handleExpandChange = (expanded) => {
			this.setState({
				expanded: expanded
			});
		}

		this.handleToggle = (event, toggle) => {
			this.setState({
				expanded: toggle
			});
		}

		this.handleExpand = () => {
			this.setState({
				expanded: true
			});
		}

		this.handleReduce = () => {
			this.setState({
				expanded: false
			});
		}
	}
	

	render(){
		var timelineRows = this.props.timeline_variables;
		var headers = Object.keys(this.props.timeline_variables[0]);
		console.log(headers);
		let displayTable = (
			<table className="dataTable" style={tableStyles.table}>
				<thead>
					<tr className="headerRow">
						<td style={tableStyles.numbers}></td>
						{
							headers.map((title, index) => (
								<td key={"header-td-"+index}>
									<input 
										name="tableHeader" 
										data-row={0} 
										data-column={index} 
										id={index} 
										value={title}
										key={"header-input-"+index}
										onChange={(event) => this.props.handleHeaderChange(event.target.id, event.target.value)}
										onKeyDown={(event) => this.bindKeyboard(event)}
										onContextMenu={(event) => this.handleColumnContextMenu(event, index)}
										style={tableStyles.header} 
										/>
								</td>
							))
						}
					</tr>
				</thead>
				<tbody>
					{
					timelineRows.map((row, rowIndex) => (
							<tr id={"row "+rowIndex} key={"body-row-"+rowIndex}>
								<td style={tableStyles.numbers} key={"body-row-td-"+rowIndex}>{rowIndex+1}</td>
								{headers.map((title, titleIndex) => (
									<td key={"body-row-header-td-"+rowIndex+"-"+titleIndex}>
										<input 
											name={"cells"} 
											data-row={rowIndex+1} 
											data-column={titleIndex} 
											id={[rowIndex+1] +" "+ titleIndex} 
											style={tableStyles.header}
											key={[rowIndex+1] +" "+ titleIndex}
											value={row[headers[titleIndex]]}
											onChange={(event) => this.props.handleTableChange(event.target.id, event.target.value)}
											onKeyDown={(event) => this.bindKeyboard(event)}
											onContextMenu={(event) => this.handleContextMenu(event, rowIndex+1, titleIndex)} 
										/>
									</td>)
								)}
							</tr>
					))}
				</tbody>
			</table>
		)

				return(
					<div>
						<div style={{paddingTop: 10}}>
							<Card >
								<CardHeader
						          subtitle="Timeline Variables"
						        />
						        <div style={{overflow: 'auto', maxHeight: 300, width: '90%', paddingLeft: 5}}>
						        	{displayTable}
						        </div>
						        <div style={{paddingTop: 20}}>
						        	<Toggle 
										label="Randomize order"
										defaultToggled={this.props.randomize_order}
										labelPosition="right"
										onToggle={this.props.onToggle} 
									/>
						        </div>
							</Card>
						</div>

						<div style={{paddingTop: 20}}>
							<div style={{display: 'flex', width: "100%"}} >
								<p
									className="Trial-Form-Label-Container"
								    style={labelStyle}
								>
								    Sampling:
								</p>
								<div className="Trial-Form-Content-Container">
									<SelectField 
										value={this.props.samplingType}
										onChange={this.props.onChange} 
									>
										<MenuItem value="with-replacement"
											primaryText="with-replacement" />
										<MenuItem value="without-replacement"
											primaryText="without-replacement" />
										<MenuItem value="fixed-repititions"
											primaryText="fixed-repititions" />
										<MenuItem value="custom"
											primaryText="custom" />
									</SelectField>
								</div>
							</div>

							<div style={{display: 'flex', width: "100%"}} >
								<p
									className="Trial-Form-Label-Container"
								    style={labelStyle}
								>
								    Sampling size:
								</p>
								<div className="Trial-Form-Content-Container">
									<TextField
										id="Timeline_SampleSize_Input"
										value={convertNullToEmptyString(this.props.samplingSize)}
										fullWidth={true}
										onChange={(event, newVal) => this.props.handleSampleSize(newVal)} />
								</div>
							</div>
						</div>
						<TableContextMenu
							openContext={this.state.isOpenContext}
							anchorEl={this.state.anchorElContext}
							onDeleteColumn={(event) => this.onColumn(event, this.state.rowIndex, this.state.titleIndex)}
							onDeleteRow={(event) => this.onRow(event, this.state.rowIndex, this.state.titleIndex)}
							handleCloseContext={this.closeContext}

							openHeader={this.state.isOpenHeader}
							anchorElHeader={this.state.anchorElColumn}
							onDeleteColumnByHeader={(event) => this.onColumnHeader(event, this.state.index)}
							handleCloseHeader={this.closeHeader} />
					</div>
				)
		}
}
export default EditableTable;
