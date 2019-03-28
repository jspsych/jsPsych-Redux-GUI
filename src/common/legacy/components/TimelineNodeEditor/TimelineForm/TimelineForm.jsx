import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import { CommonComponents } from '../CommonComponents';
import TimelineVariableTable from '../../../containers/TimelineNodeEditor/TimelineForm/TimelineVariableTableContainer';
import CodeEditor from '../../CodeEditor';

const colors = {
    ...theme.colors,
}

const style = {
    SelectFieldStyle: {
        selectedMenuItemStyle: {
            color: colors.secondary
        },
        fullWidth: true,
        floatingLabelFixed: true,
        labelStyle: {
            color: colors.secondary
        }
    },
    NumberFieldStyle: {
        fullWidth: true,
        type: "number",
        floatingLabelFixed: true,
        ...theme.TextFieldFocusStyle()
    }
}

class TimelineForm extends React.Component {
    render(){
        return (
            <div className="TimelineForm">
                <TimelineVariableTable />
                <div className="Trial-Form-Item-Container">
                    <SelectField 
                        value={this.props.randomize}
                        onChange={(event, index, value) => { this.props.setRandomize(value)}}
                        floatingLabelText="Randomize Order"
                        {...style.SelectFieldStyle}
                    >
                        <MenuItem value={true}
                            primaryText="True" />
                        <MenuItem value={false}
                            primaryText="False" />
                    </SelectField>
                </div>
                <div className="Trial-Form-Item-Container">
                    <SelectField 
                        value={this.props.samplingType}
                        onChange={this.props.setSampling} 
                        floatingLabelText="Sampling method"
                        {...style.SelectFieldStyle}
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
                <div className="Trial-Form-Item-Container">
                    <TextField
                        id="Timeline_SampleSize_Input"
                        value={utils.toEmptyString(this.props.samplingSize)}
                        onChange={(event, newVal) => this.props.setSampleSize(newVal)} 
                        floatingLabelText="Sample size"
                        {...style.NumberFieldStyle}
                    />
                </div>
                <div className="Trial-Form-Item-Container">
                    <TextField 
                        id="Timeline_Repetitions_Input"
                        value={(this.props.repetitions) ? this.props.repetitions : ""}
                        onChange={this.props.setRepetitions} 
                        floatingLabelText="Repetitions"
                        {...style.NumberFieldStyle}
                    />
                </div>

                <div className="Trial-Form-Item-Container">
                    <CommonComponents.CustomFloatingLabelField
                        label={"Loop Function"}
                        node={
                            <CodeEditor
                                Trigger={CommonComponents.Triggers.CodeEditor}
                                onlyFunction={true}
                                value={this.props.loopFunction.code}
                                title="Loop function"
                                onCommit={this.props.setLoopFunction}
                            />
                        }
                    />
                </div>
                <div className="Trial-Form-Item-Container">
                    <CommonComponents.CustomFloatingLabelField
                        label={"Condition Function"}
                        node={
                            <CodeEditor
                                Trigger={CommonComponents.Triggers.CodeEditor}
                                onlyFunction={true}
                                value={this.props.conditionalFunction.code}
                                title="Condition function"
                                onCommit={this.props.setConditionFunction}
                            />
                        }
                    />
                </div>
            </div>
        )
    }
}

export default TimelineForm;
