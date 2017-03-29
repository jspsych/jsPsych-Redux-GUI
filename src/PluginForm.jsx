var React = require('react');
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {actionPluginChange} from 'actions';

class PluginForm extends React.Component {
    handleChangePlug(e, i, val) {
        actionPluginChange(this.props.store, val);
    }

    render() {
        var i = 0;
        const pluginItems = Object.keys(jsPsych.plugins).map((plugin) =>
            <MenuItem
                primaryText={plugin}
                value={plugin} />
    );
        if(this.props.state.openTrial != -1) {

            if(this.props.state.trialTable[this.props.state.openTrial].isTimeline != true) {

                var getPlugVal = jsPsych.plugins[this.props.state.trialTable[this.props.state.openTrial].pluginVal];

                const plugForm = {};
                Object.keys(getPlugVal.info.parameters).map((plug) =>
          <TextField
              id="pluginForm"
              key={i++}
              value={plug} />
          );

                var form = <div>
        <SelectField
                value={this.props.state.trialTable[this.props.state.openTrial].pluginVal} 
                autoWidth={true}     
                floatingLabelText="Trial Type"
                maxHeight={300} 
                onChange={this.handleChangePlug.bind(this)} >
            </SelectField>
            {plugForm}
        </div>;
            }
        } else {
            var plugForm = <div
      ></div>;
        }
        return (
    <div>
        {form}
    </div>
        );
    }
}

export default PluginForm; 
