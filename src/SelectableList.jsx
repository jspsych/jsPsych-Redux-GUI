var React = require('react');
import { Component, PropTypes } from 'react';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DragSource from 'react-dnd'
//import Trial from 'Trial';
import { actionToggleSelected, actionHandleDrawer } from 'actions';


// Key for indexing list items
var key = -1;

const addSelectedFAB = {
    //marginRight: 20,
    marginLeft: 100,
    //marginTop: 5,
    position: 'auto'
}
/*function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }; 
}
const trialSource = {
    beginDrag(trial) {
        return {
            text: trial.name 
        };
    }
}
const propTypes = {

//    text: PropTypes.string.isRequired,

    // Injected by React DnD
 //   isDragging: PropTypes.bool.isRequired,
  //  connectDragSource: PropTypes.func.isRequired
}
*/


class SelectableTrialList extends React.Component {

    // Dispatch an action to change the value of 'selected'
    handleTouchTap(id) {
        var store = this.props.store;
        actionToggleSelected(store, id);
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
    backgroundColorer (trial) {
        if (this.props.state.openTrial===trial.id) {
            return { backgroundColor: 'blue'}
        } else {
            return { backgroundColor: 'white'}
        }
    }
    render() {
        // I think this is okay
        //oconst {isDragging, connectDragSource, text } = this.props;

        //return connectDragSource(
            ////style={{ opacity: isDragging ? 0.5 : 1 }}>

            return(
                <div >
                <List defaultValue={this.props.state.trialOrder[0]}>
                <Subheader>Current Trials</Subheader>
                {
                    this.props.state.trialOrder.map(trial => {
                        // Each trial gets a unique key
                        return (
                            <ListItem
                            key={trial}
                            style={this.backgroundColorer.bind(this,trial)}
                            primaryText={this.props.state.trialTable[trial].name}
                            leftAvatar={
                                <Avatar>
                                {trial}
                                </Avatar>}
                            rightAvatar = {
                                <CheckBox
                                checked={this.props.state.trialTable[trial].selected}
                                labelPosition='left'
                                style={addSelectedFAB}
                                onCheck={this.handleTouchTap.bind(this,trial)}
                                />}
                            />
                        )
                    })}
                </List>
                </div>
            );
        }
}
//SelectableTrialList.propTypes = propTypes;
export default SelectableTrialList;
//export default DragSource(ListItem, trialSource, collect) (SelectableTrialList);



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
