var React = require('react');
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TrialItem from 'TrialItem';
import { actionSetOver } from 'actions';

class SelectableTrialList extends React.Component {
    static propTypes = {
      state: React.PropTypes.object.isRequired,
      store: React.PropTypes.object.isRequired
    }
    dragOver (e) {
        // Don't update the state unnecessarily
        if (e.target.id === this.props.state.over) return;
        //console.log("DOver", e.target);
        actionSetOver(this.props.store, e.target.id.toString());
    }
    render() {
        return (
            <List
                defaultValue={this.props.state.trialOrder[0]}
                onDragOver={this.dragOver.bind(this)}
            >
                <Subheader>Current Trials</Subheader>
                {
                    this.props.state.trialOrder.map(trial => {
                        // Used by all rendered components
                        // Each trial gets a unique key
                        return (
                            <TrialItem
                                key={trial}
                                store={this.props.store}
                                state={this.props.state}
                                trial={trial}
                            />
                        );
                    }, this)}
                </List>
        );
    }
}
export default SelectableTrialList;
