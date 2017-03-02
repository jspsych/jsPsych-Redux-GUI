var React = require('react');
import { Component, PropTypes } from 'react';
import Mousetrap from 'mousetrap';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { actionToggleSelected, actionHandleDrawer, actionAddTrial, actionMoveTrial, 
    actionRemoveTrial, actionRestoreState, actionRestoreFutureState, actionToggleTimeline } from 'actions';


// Key for indexing list items
var key = -1;

const addSelectedFAB = {
    //marginRight: 20,
    marginLeft: 20,
    //marginTop: 5,
    position: 'auto'
}

// For display during dragging of a trial
var placeholder = <ListItem className="placeholder" />

class SelectableTrialList extends React.Component {

    /*** Selection Methods ***/
    // Dispatch an action to change the value of 'selected'
    handleTouchTap(id) {
        actionToggleSelected(this.props.store, id);
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
        e.preventDefault();
        // Set the trial to display in the default way
        this.dragged.style.display = "initial";
        // Get the position the trial was dragged from
        var fromPos = Number(this.dragged.dataset.id);
        // Get the position the trial was dropped
        var toPos = Number(this.over.dataset.id);
        // Move the trial
        actionMoveTrial(this.props.store, fromPos, toPos);
        return false;
    }
    dragOver (e) {
        e.preventDefault();
        // Set the trial to not display while it's being dragged
        this.dragged.style.display = "none";
        if (e.target.className === "placeholder") return;

        this.over = e.target;
        return false;
        //console.log("this.over: ",this.over);
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
                style={addSelectedFAB}
            >
                <Subheader>Current Trials</Subheader>
                {
                    this.props.state.trialOrder.map(trial => {
                        // Used by all rendered components
                        var dataIden = this.props.state.trialOrder.indexOf(trial);

                        // Each trial gets a unique key
                        return (
                            <div
                                id="wrapper" 
                                key={trial}
                            >
                                <CheckBox
                                    data-id={dataIden}
                                    draggable={true}
                                    checked={this.props.state.trialTable[trial].selected}
                                    labelPosition='right'
                                    onCheck={this.handleTouchTap.bind(this,trial)}
                                    style={
                                        // If this is the trial open in the pluginDrawer highlight it
                                        this.props.state.openTrial === trial ? 
                                            { backgroundColor: '#BDBDBD'} : // Light grey
                                            { backgroundColor: 'white'}
                                    }
                                />
                                <ListItem
                                    data-id={dataIden}
                                    draggable={true}
                                    onDragEnd={this.dragEnd.bind(this)}
                                    onDragStart={this.dragStart.bind(this)}
                                    style={
                                        // If this is the trial open in the pluginDrawer highlight it
                                        this.props.state.openTrial === trial ? 
                                            { backgroundColor: '#BDBDBD'} : // Light grey
                                            { backgroundColor: 'white'}
                                    }
                                    primaryText={this.props.state.trialTable[trial].name}
                                    rightAvatar={<Avatar>T</Avatar>}
                                    />
                                </div>
                        );
                    }, this)}
                </List>
        );
    }
}
export default SelectableTrialList;
