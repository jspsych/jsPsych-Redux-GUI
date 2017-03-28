var React = require('react');
import { Component, PropTypes } from 'react';
import Mousetrap from 'mousetrap';
import { actionToggleSelected, actionHandleDrawer, actionAddTrial, 
    actionMoveTrial, actionRemoveTrial, actionRestoreState, actionSetOver,
    actionAddChild, actionRestoreFutureState, actionToggleTimeline, 
    actionToggleIsTimeline} from 'actions';

class HotKeys extends React.Component {
    // Dispatch an action to change the value of 'selected'
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
    addChild (e) {
        e.preventDefault();
        actionAddChild(this.props.store, this.props.state.openTrial);
    }
    toggleIsTimeline (e) {
        e.preventDefault();
        console.log("Toggle");
        actionToggleIsTimeline(this.props.store);
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
        // Add Child Trial
        Mousetrap.bind(['ctrl+c'], this.addChild.bind(this))
        // Make trial into timeline 
        Mousetrap.bind(['ctrl+b'], this.toggleIsTimeline.bind(this))
        // Undo State Change
        Mousetrap.bind(['ctrl+z'], this.restore.bind(this))
        // Redo State Change
        Mousetrap.bind(['ctrl+q'], this.fastForward.bind(this))
    }

    // Unbind the keys when the component is unmounted
    componentWillUnmount () {
        Mousetrap.unbind(['ctrl+a'], this.add.unbind(this))
        Mousetrap.unbind(['ctrl+x', 'del'], this.remove.unbind(this))
        Mousetrap.unbind(['ctrl+c'], this.addChild.unbind(this))
        Mousetrap.unbind(['ctrl+b'], this.toggleIsTimeline.unbind(this))
        Mousetrap.unbind(['ctrl+z'], this.restore.unbind(this))
        Mousetrap.unbind(['ctrl+q'], this.fastForward.unbind(this))
    }
    // Doesn't affect the appearence of the gui
    render() {
        return (
            <div draggable={false}/>
        );
    }
}
export default HotKeys;
