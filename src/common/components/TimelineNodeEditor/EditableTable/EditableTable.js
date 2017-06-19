import React from 'react';
import IconButton from 'material-ui/IconButton';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';

import { grey900 } from 'material-ui/styles/colors';

const tableStyles = {
	small: {
		display: 'flex',
		height: '15px',
		width: '15px'
	},
	table: {
		tableLayout: 'fixed'
	},
	header: {
		border: '1px solid black',
		width: '50px',
		height: '20px'
	}
}

class EditableTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render(){
		var i = 0;
		var timelineRows = this.props.timeline_variable;
		console.log("before header");
		var headers = Object.keys(this.props.timeline_variable[0]);
		console.log("after header " + headers);

		var config = {
			rows: 2,
			columns: 2,
			hasHeadRow: true,
			isHeadRowString: true,
			canAddRow: true,
			canAddColumn: true,
		}
		var i = 0;
		return(
			<div>
			<table className="dataTable" style={tableStyles.table}>
				<thead>
					<tr className="headerRow">
					{
						headers.map((title) => {
							return <input id={i++} defaultValue={title} 
							onChange={(event) => this.props.handleHeaderChange(event.target.id, event.target.value)} 
							style={tableStyles.header} /> 
						})
					}
					</tr>
				</thead>
				{
					timelineRows.map((row, rowIndex) => {        ////index is number of rows
						return <tr>{
							headers.map((title, titleIndex) => {
								return <input id={[rowIndex+1] +" "+ titleIndex} style={tableStyles.header}  
								defaultValue={row[headers[titleIndex]]} 
								onChange={(event) => this.props.handleTableChange(event.target.id, event.target.value)} /> //{row[headers[titleIndex]]}</input>
							})
						}
						</tr>
					})
				}
			</table>
			<div>
			<IconButton
			tooltip="add column"
			tooltipPosition="top-right"
			style={tableStyles.small}
			onTouchTap={this.props.onTouchTap} >
			<NavigationArrowForward />
			</IconButton >
			<IconButton
			tooltip="add row"
			tooltipPosition="bottom-right"
			style={tableStyles.small}
			onTouchTap={(event) => this.props.handleAddRow(event.target.id)} >
			<NavigationArrowDownward />
			</IconButton>
			</div>
			</div>
			)
	}
}

			// <div>
			// <SpreadsheetComponent 
			// initialData={this.props.timeline_variable}
			// spreadsheetId="1"/>
			// </div>
			// <table className="dataTable" style={tableStyles.table}>
			// 	<thead>
			// 		<tr className="headerRow">
			// 		{
			// 			headers.map((title) => {
			// 				return <input id={i++} defaultValue={title} 
			// 				onChange={(event) => this.props.handleHeaderChange(event.target.id, event.target.value)} 
			// 				style={tableStyles.header} /> 
			// 			})
			// 		}
			// 		</tr>
			// 	</thead>
			// 	{
			// 		timelineRows.map((row, rowIndex) => {        ////index is number of rows
			// 			return <tr>{
			// 				headers.map((title, titleIndex) => {
			// 					return <input id={rowIndex +" "+ titleIndex} style={tableStyles.header}  
			// 					defaultValue={row[headers[titleIndex]]} 
			// 					onChange={(event) => this.props.handleTableChange(event.target.id, event.target.value)} /> //{row[headers[titleIndex]]}</input>
			// 				})
			// 			}
			// 			</tr>
			// 		})
			// 	}
			// </table>
			// <div>
			// <IconButton
			// tooltip="add column"
			// tooltipPosition="top-right"
			// style={tableStyles.small}
			// onTouchTap={this.props.onTouchTap} >
			// <NavigationArrowForward />
			// </IconButton >
			// </div>
			// </div>
export default EditableTable;




