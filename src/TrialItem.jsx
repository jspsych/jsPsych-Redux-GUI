var React = require('react');
import { ListItem } from 'material-ui/List';
import CheckBox from 'material-ui/Checkbox';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import Divider from 'material-ui/Divider';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {
    actionToggleSelected, actionMoveTrial, actionRemoveTrial, 
    actionSetDragged, actionSetOver, actionAddChild,
    } from 'actions';

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

const addStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.01,
    left: window.innerWidth * 0.01
};

const removeStyleFAB = {
    marginRight: 10,
    position: 'absolute',
    bottom: window.innerHeight * 0.05,
    left: window.innerWidth * 0.15
};
var preventFlag = false;
class TrialItem extends React.Component {
    static propTypes = {
        store: React.PropTypes.object.isRequired,
        state: React.PropTypes.object.isRequired,
    }
    /*** Drag and Drop Methods ***/
    dragOver (e) {
        // Set the trial to not display while it's being dragged
        //this.props.dragged.style.display = "none";
        if (e.target.className === "placeholder") return;
        // Don't update the state unnecessarily
        else if (this.props.trial === this.props.state.over) return;
        actionSetOver(this.props.store, this.props.trial);
    }
    dragStart (e) {

        actionSetDragged(this.props.store, this.props.trial);
        e.dataTransfer.effectAllowed = "move"
        // For FireFox compatibility
        e.dataTransfer.setData("text/html", e.currentTarget);
        return false;
    }
    dragEnd (e) {
        // Move the trial
        actionMoveTrial(this.props.store);
    }
    handleTouchTap(id) {
        if (preventFlag) {
            preventFlag = false;
            return;
        } else
            actionToggleSelected(this.props.store, id);
    }
    handleAddChild(id) {
        actionAddChild(this.props.store, id);
        preventFlag = true;
        return;
    }
    handleRemoveChild(id){
        actionRemoveTrial(this.props.store, id);
        return;
    }
    render (){
        return (
       <ListItem
            key={this.props.trial}
            id={this.props.trial}
            draggable={true}
            onDragEnd={this.dragEnd.bind(this)}
            onDragStart={this.dragStart.bind(this)}
            insetChildren={true}
            initiallyOpen={true}
            style={
                // If this is the trial open in the pluginDrawer highlight it
                this.props.state.openTrial === this.props.trial ?
                Object.assign(
                    {marginLeft: this.props.state.trialTable[this.props.trial].ancestryHeight * 20},
                    openPluginFAB
                ) :
                Object.assign(
                    {marginLeft: this.props.state.trialTable[this.props.trial].ancestryHeight * 20},
                    closedPluginFAB
                )
            }
            rightIcon={
                    this.props.state.trialTable[this.props.trial].isTimeline ?
                <IconMenu
                    iconButtonElement={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    onMouseOver={open}
                >
                    {
                        this.props.state.trialTable[this.props.trial].isTimeline ?
                        <MenuItem
                            primaryText="Add Child" 
                        >
                            <ContentAdd onTouchTap={this.handleAddChild.bind(this, this.props.trial)}/>
                        </MenuItem> : <div/>
                      }
                      <Divider />
                      {
                        this.props.state.trialTable[this.props.trial].parent !== -1 ?
                        <MenuItem
                            primaryText="Remove Child"
                        >
                            <ContentAdd onTouchTap={this.handleRemoveChild.bind(this, this.props.trial)}/>
                        </MenuItem> : <div/>
                      }
                  </IconMenu> :
                           <ContentRemove
                               onTouchTap={this.handleRemoveChild.bind(this, this.props.trial)}
                           />
            }
            primaryText={
                // Ensure the trials can be dropped on the text
                <div 
                    id={this.props.trial}>
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
                // If this is a timeline
                this.props.state.trialTable[this.props.trial].isTimeline ?
                // Display the nested items
                this.props.state.trialTable[this.props.trial].timeline.map(child => {
                    var childIden = this.props.state.trialOrder.indexOf(child);
                    return (
                        <TrialItem
                            dataIden={child}
                            store={this.props.store}
                            state={this.props.state}
                            trial={child}
                            key={child}
                        />
                    );
                }, this)
                // Otherwise don't render anything
                : []
            } 
        />
        );
    }
}
export default TrialItem;
