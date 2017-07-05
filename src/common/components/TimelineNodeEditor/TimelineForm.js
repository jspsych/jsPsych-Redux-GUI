import React from 'react';
import TextField from 'material-ui/TextField';
import EditableTable from '../../containers/TimelineNodeEditor/EditableTable/EditableTable';

class TimelineForm extends React.Component {
	render(){
		var form;
		console.log("timeline");
		console.log(this.props.isTimeline);
		if(this.props.isTimeline) {
			form =
			<div className="TimelineForm">
			<EditableTable id={this.props.id} />
			<TextField floatingLabelText="repetitions"
			value={this.props.repetitions}
			onChange={this.props.onChange} />
			</div>
		} else {
			form = <div></div>
		}
		return(
			<div>
			{form}
			</div>
			)
	}
}

export default TimelineForm;
