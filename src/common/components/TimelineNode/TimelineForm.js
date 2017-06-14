import React from 'react';
import TextField from 'material-ui/TextField';
import {Table, Column, Cell} from 'fixed-data-table';
import Toggle from 'material-ui/Toggle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class TimelineForm extends React.Component {
	constructor(props) {
		super(props);
	}
	render(){
		var form;
		if(this.props.isTimeline) {
			var form = <div className="TimelineForm">
			<Toggle label="randomize_order"
			defaultToggled={false} />
			<TextField floatingLabelText="repetitions"
			value={0} />
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
