import React from 'react';
import IconButton from 'material-ui/IconButton';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import * as utils from '../../../reducers/Experiment/utils';
import * as shortcuts from './shortcuts';

import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';

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
		}

		this.handleTouchTap = (event) => {
			event.preventDefault();

			this.setState({
				open:true,
				anchorEl: event.currentTarget
			});
		}

		this.handleRequestClose = () => {
			this.setState({
				open:false
			});
		}
	}

	// componentDidMount() {
	// 	console.log('in component');
 //     	shortcuts.bindKeyboard();
 //    }


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
							onChange={(event) => this.props.handleHeaderChange(event.target.id, event.target.value)} />
						</tr>
					</thead>
					<tr>
						<td style={tableStyles.numbers}>1</td>
						<input id={1 + " "+0} defaultValue={undefined} style={tableStyles.header}
						onChange={(event) => this.props.handleTableChange(event.target.id, event.target.value)} />
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
							onKeyDown={(event) => shortcuts.bindKeyboard(event)}
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
								onKeyDown={(event) => shortcuts.bindKeyboard(event)} /> //{row[headers[titleIndex]]}</input>
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
			<IconButton
			tooltip="add column"
			tooltipPosition="top-right"
			style={tableStyles.small}
			onTouchTap={(event) => this.props.handleAddColumn(event.target.id)} >
			<NavigationArrowForward />
			</IconButton >
			<IconButton
			tooltip="add row"
			tooltipPosition="bottom-right"
			style={tableStyles.small}
			onTouchTap={(event) => this.props.handleAddRow(event.target.id)} >
			<NavigationArrowDownward />
			</IconButton>
			<Toggle label="Randomize_Order"
			defaultToggled={this.props.randomize_order}
			labelPosition="right"
			onToggle={this.props.onToggle} />
			<div style={{display: 'flex'}}>
			<SelectField floatingLabelText="Sampling"
			deafultValue={0}
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
			</Popover>
			</div>
			)
	}
}
export default EditableTable;




