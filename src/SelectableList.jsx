var React = require('react');
import { Component, PropTypes } from 'react';
import Mousetrap from 'mousetrap';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { actionToggleSelected, actionHandleDrawer, actionAddTrial, 
    actionMoveTrial, actionRemoveTrial, actionRestoreState, 
    actionAddChild, actionRestoreFutureState, actionToggleTimeline } from 'actions';


// Key for indexing list items
var key = -1;

const trialListFAB = {
    //marginRight: 20,
    //marginLeft: 20,
    //marginTop: 5,
    //position: 'absolute'
}
const openPluginFAB = { 
    // Light grey
    backgroundColor: '#BDBDBD', 
}
const closedPluginFAB = { 
    backgroundColor: 'white', 
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
var preventFlag = false;
class SelectableTrialList extends React.Component {

    /*** Selection Methods ***/
    // Dispatch an action to change the value of 'selected'
    handleTouchTap(id) {
        if (preventFlag) {
            preventFlag = false;
            return 
        } else 
            actionToggleSelected(this.props.store, id);

    }
    handleAddChild(id) {
        actionAddChild(this.props.store, id);
        preventFlag = true;
        return;
    }

    /*** Drag and Drop Methods ***/
    dragStart (e) {
        this.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = "move"

        // For FireFox compatibility
        e.dataTransfer.setData("text/html", e.currentTarget);
        return false;
    }
    dragEnd (e) {
        //e.preventDefault();
        // Set the trial to display in the default way
        this.dragged.style.display = "block";
        // Get the position the trial was dragged from
        var fromPos = Number(this.dragged.dataset.id);
        // Get the position the trial was dropped
        var toPos = Number(this.over.dataset.id);
        // Move the trial
        actionMoveTrial(this.props.store, fromPos, toPos);
    }
    dragOver (e) {
        //e.preventDefault();
        // Set the trial to not display while it's being dragged
        this.dragged.style.display = "none";
        if (e.target.className === "placeholder") return;

        this.over = e.target;
    }


    /*** Hot Key Methods ***/
    add (e) { 
        // Prevent the default action for this HotKey
        e.preventDefault();
        actionAddTrial(this.props.store); 
    }
    remove (e) { 
        e.preventDefault();
        actionRemoveTrial(this.props.store); 
    }
    fastForward (e) { 
        e.preventDefault();
        actionRestoreFutureState(this.props.store); 
    }
    restore (e) { 
        e.preventDefault();
        actionRestoreState(this.props.store); 
    }

    // Bind the keys when this component is mounted
    componentDidMount () {
        // Add Trial
        Mousetrap.bind(['ctrl+a'], this.add.bind(this))
        // Remove Trial
        Mousetrap.bind(['ctrl+x', 'del'], this.remove.bind(this))
        // Undo State Change
        Mousetrap.bind(['ctrl+z'], this.restore.bind(this))
        // Redo State Change
        Mousetrap.bind(['ctrl+q'], this.fastForward.bind(this))
    }


    // Unbind the keys when the component is unmounted
    componentWillUnmount () {
        Mousetrap.unbind(['ctrl+a'], this.add.unbind(this))
        Mousetrap.unbind(['ctrl+x', 'del'], this.remove.unbind(this))
        Mousetrap.unbind(['ctrl+z'], this.restore.unbind(this))
        Mousetrap.unbind(['ctrl+q'], this.fastForward.unbind(this))
    }

    render() {
        return (
            <List 
                defaultValue={this.props.state.trialOrder[0]} 
                onDragOver={this.dragOver.bind(this)} 
                style={trialListFAB}
            >
                <Subheader>Current Trials</Subheader>
                {
                    this.props.state.trialOrder.map(trial => {
                        // Used by all rendered components
                        var dataIden = this.props.state.trialOrder.indexOf(trial);

                        // Each trial gets a unique key
                        return (
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
                        );
                }, this)}
            </List>
        );
    }
}
export default SelectableTrialList;
