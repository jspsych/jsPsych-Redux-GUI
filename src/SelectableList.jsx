var React = require('react');
import { Component, PropTypes } from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Trial from 'Trial';
import { actionSelectTrial } from 'actions';


// Key for indexing list items
var key = -1;

class SelectableTrialList extends React.Component {

    // Dispatch an action to change the value of 'selected'
    handleTouchTap(id) {
        //console.log("Tapped", actionSelectTrial, this);
        var store = this.props.storeState;
        actionSelectTrial(store, id);
    }
    render() {
        return (
            <div>
                <List defaultValue={this.props.selected}>
                    <Subheader>Current Trials</Subheader>
                    {
                        this.props.list.map(trial => {
                            // Each trial gets a unique key
                            console.log(trial);
                            return (
                                <ListItem
                                    key={trial.id}
                                    primaryText={trial.name}
                                    leftAvatar={<Avatar>{trial.id}</Avatar>}
                                    onTouchTap={this.handleTouchTap.bind(this, trial.id)}
                                    />
                            )
                        }
                        )
                    }
                </List>
            </div>
        );
    }
}
export default SelectableTrialList;


/*TrialItem.defaultValue = {
                        name: "Trial",
    children: [],
    type: "type",
    pluginType: "pluginType",
    pluginData: []

}*/

//let SelectableList = MakeSelectable(List);
/*
function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
                        static propTypes = {
                        children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired,
        };

        componentWillMount() {this.setState({ selectedIndex: this.props.defaultValue, }); };

        handleRequestChange = (event, index) => {this.setState({ selectedIndex: index, }); };

        render() {
            return (
                <ComposedComponent
                        value={this.state.selectedIndex}
                        onChange={this.handleRequestChange}
                        >
                        {this.props.children}
                    </ComposedComponent>
                    );
        }
    };
}


                                <Trial
                        name={trial.name}
                        children={trial.children}
                        type={trial.type}
                        pluginType={trial.pluginType}
                        pluginData={trial.pluginData}
                        errors={trial.errors}
                        />

                    SelectableList = wrapState(SelectableList);
*/