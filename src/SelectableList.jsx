var React = require('react');
import { Component, PropTypes } from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';

import Trial from 'Trial';

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

        componentWillMount() { this.setState({ selectedIndex: this.props.defaultValue, }); };

        handleRequestChange = (event, index) => { this.setState({ selectedIndex: index, }); };

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

// Key for indexing list items
var key = 0;

const SelectableTrialList = ({
    list,
    selected,
    onTap
}) => (
        <div>
            <List defaultValue={selected}>
                <Subheader>Current Trials</Subheader>
                {
                    list.map(function (trial) {
                        key = key + 1;
                        return (
                            <ListItem
                                primaryText={trial.name}
                                value={key}
                                leftAvatar={<Avatar>T</Avatar>}
                                onTouchTap={onTap}
                                key={key}
                                />
                        )
                    })
                }
            </List>
        </div>
    );

export default SelectableTrialList;