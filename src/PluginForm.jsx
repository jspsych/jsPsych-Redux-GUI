var React = require('react');
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {actionPluginChange} from 'actions';

class PluginForm extends React.Component {

    state propTypes = {
        store: React.PropTypes.object.isRequired,
        state: React.PropTypes.object.isRequired,
    }

    handleChangePlug(e, i, val) {
        actionPluginChange(this.props.store, val);
    }

    render() {
        var i = 0;
        var getPlugVal = jsPsych.plugins[this.props.state.trialTable[this.props.state.openTrial].pluginVal];
        return (
        // This type of if-then logic is allowed within the render method
        (
        this.props.state.openTrial !== -1 &&
            this.props.state.trialTable[this.props.state.openTrial].isTimeline !== true
            ) ?
                    <SelectField
                        value={this.props.state.trialTable[this.props.state.openTrial].pluginVal} 
                        autoWidth={true}     
                        floatingLabelText="Trial Type"
                        maxHeight={300} 
                        onChange={this.handleChangePlug.bind(this)} 
                    >
                        {
                        Object.keys(getPlugVal.info.parameters).map((plug) =>
                             <TextField
                                 id="pluginForm"
                                 key={i++}
                                 value={plug} 
                             />
   );
                        Object.keys(jsPsych.plugins).map((plugin) =>
                             <MenuItem
                                 primaryText={plugin}
                                 value={plugin} 
                             />
   );
                    }
                </SelectField> : <div />
        );
    }
}

export default PluginForm; 
