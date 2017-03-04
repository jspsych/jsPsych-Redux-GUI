var React = require('react');
import { Component, PropTypes } from 'react';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Mousetrap from 'mousetrap';
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

const openPluginFAB = { 
    // Light grey
    backgroundColor: '#BDBDBD', 
}
const closedPluginFAB = { 
    backgroundColor: 'white', 
}

const trialStyle =({
    trial,
    openTrial,
    indent
}) =>
{

    var margin = indent*10;
    if (margin === NaN)
        margin = 100;
    var styleObject;

    openTrial === trial ? 
        styleObject = Object.assign({}, openPluginFAB) :
        styleObject = Object.assign({}, closedPluginFAB)
    styleObject['marginLeft']= margin; 
    return styleObject;
}

var preventFlag = false;
class TrialItem extends React.Component {
    /*** Drag and Drop Methods ***/
    dragOver (e) {
        //e.preventDefault();
        // Set the trial to not display while it's being dragged
        this.dragged.style.display = "none";
        if (e.target.className === "placeholder") return;

        this.over = e.target;
    }
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
    render (){
        return (
       <ListItem
            key={this.props.trial}
            data-id={this.props.dataIden}
            draggable={true}
            onDragEnd={this.dragEnd.bind(this.props.that)}
            onDragStart={this.dragStart.bind(this.props.that)}
            insetChildren={true}
            initiallyOpen={true}
            style={
                // If this is the trial open in the pluginDrawer highlight it
                this.props.state.openTrial === this.props.trial ? 
                Object.assign({ marginLeft: this.props.state.trialTable[this.props.trial].ancestryHeight * 20}, openPluginFAB) :
                Object.assign({marginLeft: this.props.state.trialTable[this.props.trial].ancestryHeight * 20}, closedPluginFAB)
            }
            rightIcon={
                // If the trial is a timeline
                this.props.state.trialTable[this.props.trial].isTimeline ? 
                <ContentAdd onTouchTap={this.handleAddChild.bind(this, this.props.trial)}/> :
                <div />
            }
            primaryText={
                // Ensure the trials can be dropped on the text
                <div 
                    data-id={this.props.dataIden}>
                    {this.props.state.trialTable[this.props.trial].name}
                </div>
            }
            leftCheckbox={
                <CheckBox
                    checked={this.props.state.trialTable[this.props.trial].selected}
                    labelPosition='right'
                    onCheck={this.handleTouchTap.bind(this, this.props.trial)}
                />
            }
            nestedItems={
                // Display the nested items
                this.props.state.trialTable[this.props.trial].timeline.map(child => {
                    var childIden = this.props.state.trialOrder.indexOf(child);
                    return (
                        <TrialItem
                            dataIden={childIden}
                            that={this}
                            store={this.props.store}
                            state={this.props.state}
                            trial={child}
                            key={child}
                        />
                    );
                }, this)}
            />
        );
    }
}
export default TrialItem;
