var React = require('react');
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import {actionCloseDrawer, actionChangeName, actionToggleIsTimeline} from 'actions';
import PluginForm from 'PluginForm';

const removeStyleFAB = {
    marginRight: 20,
    position: 'absolute',
    bottom: window.innerHeight * 0.1,
    right: window.innerWidth * 0.1
}

const inline = {
    display: 'flex',
    position: 'absolute',
    marginRight: 150
}

// Class for handling the pluginDrawer and its contents
class PluginDrawer extends React.Component {
/*   static propTypes = {
     store: PropTypes.object.isRequired,
     state: PropTypes.object.isRequired,
     openTrial: PropTypes.string.isRequired
   }
   */
   close(){
     actionCloseDrawer(this.props.store);
   }
   handleChange(e, newValue) {
     actionChangeName(this.props.store, newValue);
   }
   handleButtonChange() {
     actionToggleIsTimeline(this.props.store);
   }
   render() { // Could depend on if there are any trials in the selected list
     if(this.props.state.openTrial != -1) {
       var inside = <div>
         <TextField
           value={this.props.state.trialTable[this.props.state.openTrial].name} 
           id="trial text"
           underlineShow={false}
           onChange={this.handleChange.bind(this)} />
         <RadioButtonGroup
           name="toggleIsTimeline"
           defaultSelected={this.props.state.trialTable[this.props.openTrial].isTimeline}
           style={inline}
           onChange={this.handleButtonChange.bind(this)} >
           <RadioButton
             value={false}
             label="Trial" />
           <RadioButton
             value={true}
             label="Timeline"/>
         </RadioButtonGroup>
         <FloatingActionButton
           style={removeStyleFAB}
           onTouchTap={this.close.bind(this)}>
           <ContentRemove />
         </FloatingActionButton>
       </div>
      } else {
         var inside = <div></div>
      }
      return (
        <Drawer
          width={300}
          openSecondary={true}
          open={this.props.openTrial != -1}>
          {inside} 
          <PluginForm
            state={this.props.state}
            store={this.props.store} />

        </Drawer>
      ) // Stuff to be rendered inside the drawer could be included above
   }
}

export default PluginDrawer;
