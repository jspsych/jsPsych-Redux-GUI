import React from 'react';
import TextField from 'material-ui/TextField';
import EditableTable from '../../containers/TimelineNodeEditor/EditableTable/EditableTable';
import { labelStyle } from './TrialForm/TrialFormItem';

class TimelineForm extends React.Component {
	render(){
		return (
			<div className="TimelineForm">
				<EditableTable id={this.props.id} />
				<div style={{display: 'flex', width: "100%"}} >
					<p
						className="Trial-Form-Label-Container"
					    style={labelStyle}
					>
					    Repetitions:
					</p>
					<div className="Trial-Form-Content-Container">
						<TextField 
							id="Timeline_Repetitions_Input"
							fullWidth={true}
							value={(this.props.repetitions) ? this.props.repetitions : ""}
							onChange={this.props.onChange} />
					</div>
				</div>
			</div>
		)
	}
}

export default TimelineForm;
