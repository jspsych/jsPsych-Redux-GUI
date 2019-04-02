import React from 'react';
import ReactDOM from 'react-dom';

import { withStyles } from '@material-ui/core/styles';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';

import TreeItem from '../../../containers/TimelineNodeOrganizer/SortableTreeMenu/TreeItemContainer';

const styles = theme => ({
  treeMenuContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'center',
  },
  treeMenu: {
    width: '95%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflowY: 'auto',
  },
  treeTitle: {
    marginLeft: '7px',
  },
  focusWorkAround: {
    opacity: 0, 
    border: 0, 
    height: 0,
    display: 'block',
    width: 0,
    margin: 0,
    padding: 0,
  },
})

class SortableTreeMenu extends React.Component {
	handleNavigation = (e) => {
        event.preventDefault();
        this.props.listenKey(e);
    }

    componentDidMount() {
        this.organizer.addEventListener("keydown", this.handleNavigation);
    }

    componentDidUpdate() {
        ReactDOM.findDOMNode(this.focusWorkAround).focus();
    }

    componentWillUnmount() {
        this.organizer.removeEventListener("keydown", this.handleNavigation);
    }

	render() {
		const { 
			classes,
			children,
		} = this.props;
		// const { openTimelineEditorCallback, closeTimelineEditorCallback } = this.props;

		return (
			<div 
                className={classes.treeMenuContainer}
                ref={elm => this.organizer = elm}
                onClick={() => ReactDOM.findDOMNode(this.focusWorkAround).focus()}
            >
				<List
		            component="div"
		            subheader={
                        <ListSubheader 
                            component="div"
                            className={classes.treeTitle}
                        >
                            Study Steps
                        </ListSubheader>
                    }
		            className={classes.treeMenu}
                    key="tree-menu"
		        > 
		        	{
		        		children &&
		        		children.map((id, idx) => (
		        			<TreeItem
		        				id={id}
		        				depth={0}
		        				key={`tree-menu-key-${id}`}
		        			/>
		        		))
		        	}
		        </List>
                {/*focus workaround*/}
                <input
                    className={classes.focusWorkAround}  
                    ref={elm => this.focusWorkAround = elm}
                />
			</div>
		)
	}
}

export default utils.withDnDContext(withStyles(styles)(SortableTreeMenu));


