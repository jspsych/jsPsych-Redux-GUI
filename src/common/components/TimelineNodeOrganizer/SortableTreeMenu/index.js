import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';

import TreeItem from '../../../containers/TimelineNodeOrganizer/SortableTreeMenu/TreeItemContainer';

const styles = theme => ({
  treeMenu: {
    width: '100%',
  },
})

class SortableTreeMenu extends React.Component {
	handleNavigation = (e) => {
        this.props.listenKey(e);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleNavigation);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleNavigation);
    }

	render() {
		const { 
			classes,
			children,
		} = this.props;
		// const { openTimelineEditorCallback, closeTimelineEditorCallback } = this.props;

		return (
			<div className="Tree-Menu">
				<List
		            component="nav"
		            subheader={<ListSubheader component="div">Study Steps</ListSubheader>}
		            className={classes.treeMenu}
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
			</div>
		)
	}
}

export default utils.withDnDContext(withStyles(styles)(SortableTreeMenu));


