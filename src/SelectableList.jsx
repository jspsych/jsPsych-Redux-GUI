var React = require('react');
import { Component, PropTypes } from 'react';
import Mousetrap from 'mousetrap';
import { List, ListItem, MakeSelectable } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckBox from 'material-ui/Checkbox';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DragSource from 'react-dnd'
//import Trial from 'Trial';
import { actionToggleSelected, actionHandleDrawer, actionAddTrial, actionMoveTrial, 
    actionRemoveTrial, actionRestoreState, actionRestoreFutureState } from 'actions';


// Key for indexing list items
var key = -1;

const addSelectedFAB = {
    //marginRight: 20,
    marginLeft: 100,
    //marginTop: 5,
    position: 'auto'
}

// For display during dragging of a trial
var placeholder = <ListItem className="placeholder" />

    class SelectableTrialList extends React.Component {

        /*** Selection Methods ***/
        // Dispatch an action to change the value of 'selected'
        handleTouchTap(id) {
            var store = this.props.store;
            actionToggleSelected(store, id);
        }


        /*** Drag and Drop Methods ***/
        dragStart (e) {
            this.dragged = e.currentTarget;
            e.dataTransfer.effectAllowed = 'move'

            // For FireFox compatibility
            e.dataTransfer.setData("text/html", e.currentTarget);
        }
        dragEnd (e) {
            this.dragged.style.display = "single";

            var fromPos = Number(this.dragged.dataset.id);
            console.log("Over: ", this.over);
            console.log("Over.style.style: ", this.over.style.style);
            var toPos = Number(this.over.dataset.id);

            console.log("To Position: ",toPos);
            actionMoveTrial(this.props.store, fromPos, toPos);
        }
        dragOver (e) {
            e.preventDefault();
            this.dragged.style.display = "none";
            if (e.target.className === "placeholder") return;

            this.over = e.target;
            //console.log("this.over: ",this.over);
        }


        /*** Hot Key Methods ***/
        add () { actionAddTrial(this.props.store); }
        remove () { actionRemoveTrial(this.props.store); }
        fastForward () { actionRestoreFutureState(this.props.store); }
        restore () { actionRestoreState(this.props.store); }

        // Bind the keys when this component is mounted
        componentDidMount () {
            // Add Trial
            Mousetrap.bind(['ctrl+a'], this.add.bind(this)),
                // Remove Trial
                Mousetrap.bind(['ctrl+x', 'del'], this.remove.bind(this)),
                // Undo State Change
                Mousetrap.bind(['ctrl+z'], this.restore.bind(this)),
                // Redo State Change
                Mousetrap.bind(['ctrl+q'], this.fastForward.bind(this))
        }

        // Unbind the keys when the component is unmounted
        componentWillUnmount () {
            Mousetrap.unbind(['ctrl+a'], this.add.unbind(this))
            Mousetrap.unbind(['ctrl+x', 'del'], this.remove.unbind(this)),
                Mousetrap.unbind(['ctrl+z'], this.restore.unbind(this)),
                Mousetrap.unbind(['ctrl+q'], this.fastForward.unbind(this))
        }
        render() {
            return (

                <ul onDragOver={this.dragOver.bind(this)}>
                    <List defaultValue={this.props.state.trialOrder[0]}>
                        <Subheader>Current Trials</Subheader>
                        {
                            this.props.state.trialOrder.map(trial => {
                                // Used by all rendered components
                                var dataIden = this.props.state.trialOrder.indexOf(trial);
                                console.log("ListRender: ", dataIden)
                                // Each trial gets a unique key
                                return (
                                    <ListItem
                                        data-id={dataIden}
                                        draggable="true"
                                        onDragEnd={this.dragEnd.bind(this)}
                                        onDragStart={this.dragStart.bind(this)}
                                        key={trial}
                                        style={
                                            // If this is the trial open in the pluginDrawer highlight it
                                            this.props.state.openTrial === String(this.props.state.trialTable[trial].id) ? 
                                            { backgroundColor: '#BDBDBD', position: 'relative'} : // Light grey
                                            { backgroundColor: 'white', position: 'relative'}
                                        }
                                        primaryText={this.props.state.trialTable[trial].name}
                                        rightAvatar = {
                                            <CheckBox
                                                data-id={dataIden}
                                                checked={this.props.state.trialTable[trial].selected}
                                                labelPosition='left'
                                                onCheck={this.handleTouchTap.bind(this,trial)}
                                            />}
                                        />
                                );
                            }, this)}
                        </List>
                        </ul>
            );
        }
    }
export default SelectableTrialList;
