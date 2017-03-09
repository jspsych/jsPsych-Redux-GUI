var React = require('react');
import { Component, PropTypes } from 'react';
import Mousetrap from 'mousetrap';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TrialItem from 'TrialItem';
import { actionToggleSelected, actionHandleDrawer, actionAddTrial, 
    actionMoveTrial, actionRemoveTrial, actionRestoreState, actionSetOver,
    actionAddChild, actionRestoreFutureState, actionToggleTimeline, 
    actionToggleIsTimeline} from 'actions';


// Key for indexing list items
var key = -1;

const trialListFAB = {
    //marginRight: 20,
    //marginLeft: 20,
    //marginTop: 5,
    //position: 'absolute'
}

// For display during dragging of a trial
var placeholder = <ListItem className="placeholder" />

const AddSubTrial = ({ 
    state,
    store,
    id 
}) => (
    // If the trial is a timeline
    state.trialTable[id].isTimeline ? 
    <ContentAdd /> :
    <div />
);
class SelectableTrialList extends React.Component {

    /*** Selection Methods ***/
    dragOver (e) {
        //e.preventDefault();
        // Set the trial to not display while it's being dragged
        if (e.target.className === "placeholder") return;
        // Don't update the state unnecessarily
        else if (e.target.id === this.props.state.over) return;
        //console.log("DOver", e.target);
        actionSetOver(this.props.store, e.target.id.toString());
    }


    render() {
        console.log(this);
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


/*
 *
                            <ListItem
                            key={trial}
                            data-id={dataIden}
                            draggable={true}
                            onDragEnd={this.dragEnd.bind(this)}
                            onDragStart={this.dragStart.bind(this)}
                            insetChildren={true}
                            initiallyOpen={true}
                            style={
                                // If this is the trial open in the pluginDrawer highlight it
                                this.props.state.openTrial === trial ? 
                                openPluginFAB :
                                closedPluginFAB
                            }
                            rightIcon={
                                // If the trial is a timeline
                                this.props.state.trialTable[trial].isTimeline ? 
                                <ContentAdd onTouchTap={this.handleAddChild.bind(this, trial)}/> :
                                <div />
                            }
                            primaryText={
                                // Ensure the trials can be dropped on the text
                                <div 
                                data-id={dataIden}>
                                {this.props.state.trialTable[trial].name}
                                </div>
                            }
                            leftCheckbox={
                                <CheckBox
                                checked={this.props.state.trialTable[trial].selected}
                                labelPosition='right'
                                onCheck={this.handleTouchTap.bind(this,trial)}
                                />
                            }
                            nestedItems={
                                // Display the nested items
                                this.props.state.trialTable[trial].timeline.map(child => {
                                    return (
                                        <ListItem
                                            key={child}
                                            primaryText="Hellp I'm a child"
                                        />
                                    );
                                }, this)}
                            />
                            */
