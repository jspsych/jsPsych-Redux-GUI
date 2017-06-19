// import React from 'react';
// import TextField from 'material-ui/TextField';
// import {Table, Column, Cell} from 'fixed-data-table';
// import Toggle from 'material-ui/Toggle';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// const rows = [
// 	['r1a', 'r1b'],
// 	['r2a', 'r2b'],
// 	];


// class TimelineForm extends React.Component {
// 	constructor(props) {
// 		super(props);
// 	}
// 	render(){
// 		var form;
// 		if(this.props.isTimeline) {
// 			// <Table rowHeight={20}
// 			// rowsCount={rows.length}
// 			// width={100}
// 			// height={100}
// 			// headerHeight={20} >
// 			// <Column
// 			// header={<Cell>Col 1</Cell>}
// 			// cell={<Cell>Cell 1</Cell>}
// 			// width={100} />
// 			// <Column
// 			// header={<Cell>Col 2</Cell>}
// 			// cell={<Cell>Cell 2</Cell>}
// 			// width={100} />
// 			// </Table>
// 			var form = <div className="TimelineForm">
// 			<Toggle label="randomize_order"
// 			defaultToggled={false} />
// 			<TextField floatingLabelText="repetitions"
// 			value={0} />
// 			</div>
// 		} else {
// 			var form = <div></div>
// 		}
// 		return(
// 			<div>
// 			{form}
// 			</div>
// 			)
// 	}
// }

// export default TimelineForm;
