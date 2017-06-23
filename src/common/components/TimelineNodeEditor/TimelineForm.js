import React from 'react';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import EditableTable from '../../containers/TimelineNodeEditor/EditableTable/EditableTable';

import SpreadsheetComponent from 'react-spreadsheet-component';

class TimelineForm extends React.Component {
	render(){
		var form;
		if(this.props.isTimeline) {
			// var form = <div className="TimelineForm">
			// <Toggle label="randomize_order"
			// defaultToggled={false} />
			// <TextField floatingLabelText="repetitions"
			// value={0} />
			// </div>
			// var form =
		 	//    <div>
			// <SpreadsheetComponent 
			// initialData={this.props.timeline_variable}
			// config={config}
			// spreadsheetId="1"/>
			// </div>
			var form = <EditableTable id={this.props.id} />
		} else {
			var form = <div></div>
		}
		return(
			<div>
			{form}
			</div>
			)
	}
}

export default TimelineForm;
