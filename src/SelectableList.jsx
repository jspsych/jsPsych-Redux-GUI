var React = require('react');
import { Component, PropTypes } from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentAdd from 'material-ui/svg-icons/content/add';

//import Trial from 'Trial';
import { actionSelectTrial, actionSelectAdditionalTrial, actionHandleDrawer } from 'actions';


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
    handleTouchTap(name) {
        console.log("Tapped name", name);
        var store = this.props.store;
        actionSelectTrial(store, name);
    }/*
    // Dispatch an action the add the clicked trial to the 
    // list of selected trials 
    handleTouchAdd(name) {
        var store = this.props.storeState;
        actionSelectAdditionalTrial(store, name);
        actionHandleDrawer(store, "pluginDrawer");
    }
    // Determines if the trial is selected/checked
    isChecked(id) {
        console.log(this.props.storeState.selected.includes(id));
        return this.props.storeState.selected.includes(id);
    }
    getTrials(order, trialTable){

        for (trial in trialTable) {

        }
    }*/
        render() {
            return (
                <div>
                <List defaultValue={this.props.state.trialOrder[0]}>
                <Subheader>Current Trials</Subheader>
                {
                    this.props.state.trialOrder.map(trial => {
                        // Each trial gets a unique key
                        return (
                            <ListItem
                            key={this.props.state.trialTable[trial].id}
                            primaryText={this.props.state.trialTable[trial].name}
                            leftAvatar={
                                <Avatar
                                onTouchTap={this.handleTouchTap.bind(this, trial)}>
                                {this.props.state.trialTable[trial].id}
                                </Avatar>}

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



/*                        rightAvatar = {
                            <CheckBox
                            checked={trial.selected}
                            labelPosition='left'
                            style={addSelectedFAB}
                            onCheck={this.handleTouchTap.bind(this,trial)}
                            />
                        }
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
