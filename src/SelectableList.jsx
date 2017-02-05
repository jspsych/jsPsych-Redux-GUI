var React = require('react');
import { Component, PropTypes } from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentAdd from 'material-ui/svg-icons/content/add';

//import Trial from 'Trial';
import { actionSelectTrial, actionSelectAdditionalTrial } from 'actions';


// Key for indexing list items
var key = -1;

const addSelectedFAB = {
    //marginRight: 20,
    marginLeft: 100,
    //marginTop: 5,
    position: 'auto'
}

class SelectableTrialList extends React.Component {

    // Dispatch an action to change the value of 'selected'
    handleTouchTap(id) {
        //console.log("Tapped", actionSelectTrial, this);
        var store = this.props.storeState;
        actionSelectTrial(store, id);
    }
    // Dispatch an action the add the clicked trial to the 
    // list of selected trials 
    handleTouchAdd(id) {
        var store = this.props.storeState;
        actionSelectAdditionalTrial(store, id);
    }
    // Determines if the trial is selected/checked
    isChecked(id) {
        console.log(this.props.storeState.selected.includes(id));
        return this.props.storeState.selected.includes(id);
    }
    render() {
        return (
            <div>
                <List defaultValue={this.props.selected}>
                    <Subheader>Current Trials</Subheader>
                    {
                        this.props.list.map(trial => {

                            // Each trial gets a unique key
                            return (
                                <ListItem
                                    key={trial.id}
                                    primaryText={trial.name}
                                    leftAvatar={
                                        <Avatar
                                            onTouchTap={this.handleTouchTap.bind(this, trial.id)}>
                                            {trial.id}
                                        </Avatar>}
                                    rightAvatar = {
                                        <CheckBox
                                            checked={this.props.selected.includes(trial.id)}
                                            labelPosition='left'
                                            style={addSelectedFAB}
                                            onCheck={this.handleTouchAdd.bind(this, trial.id)}
                                        />
                                    }
                                />

                            )
                        })
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
