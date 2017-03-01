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
import { actionToggleSelected, actionHandleDrawer, actionAddTrial, 
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
var placeholder = <li className="placeholder" />
class SelectableTrialList extends React.Component {

    // Dispatch an action to change the value of 'selected'
    handleTouchTap(id) {
        var store = this.props.store;
        actionToggleSelected(store, id);
    }
    ///////////////////////////////
    //// Drag and Drop Methods ////
    ///////////////////////////////
    dragStart (e) {
        this.props.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData("text/html", e.currentTarget);
    }
    dragEnd (e) {
        //this.props.dragged.style.display = "block";

        var from = Number(this.props.dragged.dataset.id);
        var to = Number(this.props.over.dataset.id);
        actionMoveTrial(from, to, this.props.store);
    }
    dragOver (e) {
        e.preventDefault();
        //this.props.dragged.style.display = "none";
        if (e.target.className == "placeholder") return;
        this.props.over.bind(e.target);
    }
    /////////////////////////
    //// Hot Key Methods ////
    /////////////////////////
    add () { actionAddTrial(this.props.store); }
    remove () { actionRemoveTrial(this.props.store); }
    fastForward () { actionRestoreFutureState(this.props.store); }
    restore () { actionRestoreState(this.props.store); }
    // Bind the keys when this component is mounted
    componentDidMount () {
        // Add Trial
        Mousetrap.bind(['ctrl+m'], this.add.bind(this)),
            // Remove Trial
            Mousetrap.bind(['ctrl+x', 'del'], this.remove.bind(this)),
            // Undo State Change
            Mousetrap.bind(['ctrl+z'], this.restore.bind(this)),
            // Redo State Change
            Mousetrap.bind(['ctrl+q'], this.fastForward.bind(this))
    }
    // Unbind the keys when the component is unmounted
    componentWillUnmount () {
        Mousetrap.unbind(['ctrl+m'], this.add.unbind(this)),
            Mousetrap.unbind(['ctrl+x', 'del'], this.remove.unbind(this)),
            Mousetrap.unbind(['ctrl+z'], this.restore.unbind(this)),
            Mousetrap.unbind(['ctrl+q'], this.fastForward.unbind(this))
    }
    render() {

        return(
            <ul onDragOver={this.dragOver.bind(this)}>
            <List defaultValue={this.props.state.trialOrder[0]}>
            <Subheader>Current Trials</Subheader>
            {

                this.props.state.trialOrder.map(trial => {

                    // Each trial gets a unique key
                    return (
                        <ListItem
                        data-id={trial}
                        draggable="true"
                        onDragEnd={this.dragEnd.bind(this)}
                        onDragStart={this.dragStart.bind(this)}
                        key={trial}
                        style={
                            this.props.state.openTrial === String(this.props.state.trialTable[trial].id) ? 
                            { backgroundColor: '#BDBDBD'} : // Light grey
                            { backgroundColor: 'white'}
                        }
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
                    );
                })}
            </List>
            </ul>
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
