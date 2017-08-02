import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import { labelStyle } from '../TrialForm/TrialFormItem';
import { convertNullToEmptyString } from '../../../utils';
import TimelineVariableTable from '../../../containers/TimelineNodeEditor/TimelineForm/TimelineVariableTableContainer';
import CodeEditor from '../../CodeEditor';

class TimelineForm extends React.Component {
	render(){
		return (
			<div className="TimelineForm">
				<TimelineVariableTable />
				<div style={{display: 'flex', width: "100%"}} >
					<p
						className="Trial-Form-Label-Container"
					    style={labelStyle}
					>
					    Sampling method:
					</p>
					<div className="Trial-Form-Content-Container">
						<SelectField 
							value={this.props.samplingType}
							onChange={this.props.setSampling} 
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
					    Sample size:
					</p>
					<div className="Trial-Form-Content-Container">
						<TextField
							id="Timeline_SampleSize_Input"
							value={convertNullToEmptyString(this.props.samplingSize)}
							fullWidth={true}
							onChange={(event, newVal) => this.props.setSampleSize(newVal)} />
					</div>
				</div>
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
							onChange={this.props.setRepetitions} />
					</div>
				</div>
				<div style={{display: 'flex', width: "100%"}} >
					<p
						className="Trial-Form-Label-Container"
					    style={labelStyle}
					>
					    Loop function:
					</p>
					<div className="Trial-Form-Content-Container">
						<CodeEditor
							initCode={this.props.loopFunction.code}
							title="Loop function"
							submitCallback={this.props.setLoopFunction}
						/>
					</div>
				</div>
				<div style={{display: 'flex', width: "100%"}} >
					<p
						className="Trial-Form-Label-Container"
					    style={labelStyle}
					>
					    Conditional function:
					</p>
					<div className="Trial-Form-Content-Container">
						<CodeEditor
							initCode={this.props.conditionalFunction.code}
							title="Condition function"
							submitCallback={this.props.setConditionFunction}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default TimelineForm;
