import React from 'react';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import EditableTable from '../../containers/TimelineNodeEditor/EditableTable/EditableTable';

class TimelineForm extends React.Component {
	render(){
		var form;
		if(this.props.isTimeline) {
			var form = 
			<div className="TimelineForm">
			<EditableTable id={this.props.id} />
			<TextField floatingLabelText="repetitions"
			value={this.props.repetitions}
			onChange={this.props.onChange} />
			</div>
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
