import React from 'react';

import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 
import TrialIcon from 'material-ui/svg-icons/editor/mode-edit';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import NewTimelineIcon from 'material-ui/svg-icons/av/playlist-add';
import NewTrialIcon from 'material-ui/svg-icons/action/note-add';
import Delete from 'material-ui/svg-icons/action/delete';
import {
	pink500 as contextMenuIconColor,
	grey100 as contextMenuBackgroundColor,
	grey400 as normalColor,
	cyan400 as highlightColor,
	indigo500 as iconHighlightColor,
	green500 as checkColor,
	grey300 as hoverColor,
} from 'material-ui/styles/colors';

import { DropTarget, DragSource } from 'react-dnd';
import flow from 'lodash/flow';
import { moveToAction, moveIntoAction } from '../../../actions/timelineNodeActions';


const trialSource = {
  beginDrag(props) {
    return {
      id: props.id,
      parent: props.parent,
    };
  },

  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  }
};


const trialTarget = {
	canDrop() {
		return false
	},

	hover(props, monitor, component) {
		const { id: draggedId } = monitor.getItem()
		const { id: overId } = props
		
		if (draggedId === props.parent) return;

	    if (draggedId === overId) {
			let offset = monitor.getDifferenceFromInitialOffset();
			if (offset.x > 32 && draggedId)
				props.dispatch(moveIntoAction(draggedId));
			return;
		}
		if (!monitor.isOver({ shallow: true })) return;

		props.dispatch(moveToAction(draggedId, overId));
	},
};

const sourceCollector = (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	connectDragPreview: connect.dragPreview(),
	isDragging: monitor.isDragging(),
	draggedItem: monitor.getItem()
})

const targetCollector = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	isOverCurrent: monitor.isOver({ shallow: true }),
})


export const contextMenuStyle = {
	outerDiv: { position: 'absolute', zIndex: 20},
	innerDiv: { backgroundColor: contextMenuBackgroundColor,
				borderBottom: '1px solid #BDBDBD' },
	lastInnerDiv: { backgroundColor: contextMenuBackgroundColor },
	iconColor: contextMenuIconColor,
}


class TrialItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			contextMenuOpen: false,
		}

		this.openContextMenu = (event) => {
			event.preventDefault();
			event.stopPropagation();
			this.setState({
				contextMenuOpen: true,
				anchorEl: event.currentTarget, 
			})
		}

		this.closeContextMenu = () => {
			this.setState({
				contextMenuOpen: false
			})
		}
	}

	render() {
		const {
			connectDropTarget,
			connectDragPreview,
			connectDragSource,
			isOver,
			isOverCurrent
		} = this.props;

		let hovered = isOver && isOverCurrent;

		const colorSelector = (hovered, isSelected) => {
			if (hovered)
				return null;

			if (isSelected)
				return highlightColor;

			return null;
		} 

		return connectDragPreview(connectDropTarget(
			<div>
			<MuiThemeProvider>
			<div>
				<div className="Organizer-Item" style={{
						display:'flex', 
						width: "100%",
						overflow: 'hidden',
						backgroundColor: colorSelector(hovered, this.props.isSelected),
					}} >
					{connectDragSource(<div className="Drag-Handle">
						<IconButton 
							hoveredStyle={{backgroundColor: hoverColor}}
							disableTouchRipple={true} 
							onTouchTap={this.props.onClick}>
							<TrialIcon color={(this.props.isSelected) ? iconHighlightColor : normalColor}/>
						</IconButton>
					</div>)}
					<div style={{width: "100%"}} >
						<ListItem  
							primaryText={this.props.name}
							onContextMenu={this.openContextMenu}
							onTouchTap={(e) => {
								if (e.nativeEvent.which === 1) {
									this.props.onClick();
								}
							}}
							rightIconButton={
								<IconButton disableTouchRipple={true} onTouchTap={this.props.onToggle}>
								{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
								</IconButton>}
						/>
					</div>
						<Popover
				          open={this.state.contextMenuOpen}
				          anchorEl={this.state.anchorEl}
				          anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
				          targetOrigin={{horizontal: 'middle', vertical: 'top'}}
				          onRequestClose={this.closeContextMenu}
				        >
						<Menu>
							<MenuItem primaryText="New Timeline" 
								leftIcon={<NewTimelineIcon color={contextMenuStyle.iconColor} />}
								onTouchTap={()=>{ this.props.insertTimeline(); this.closeContextMenu()}}
							/>
							<Divider />
							<MenuItem primaryText="New Trial"  
								leftIcon={<NewTrialIcon color={contextMenuStyle.iconColor}/>}
								onTouchTap={()=>{ this.props.insertTrial(); this.closeContextMenu()}}
							/>
							<Divider />
							<MenuItem primaryText="Delete"  
								leftIcon={<Delete color={contextMenuStyle.iconColor}/>}
								onTouchTap={()=>{ this.props.deleteItem(); this.closeContextMenu()}}
							/>
					    </Menu>
					    </Popover>
					</div>
				</div>
			</MuiThemeProvider>
			</div>
		))
	}
}

export default flow(
	DragSource(
		"Organizer-Item",
		trialSource,
		sourceCollector),
	DropTarget(
		"Organizer-Item",
		trialTarget,
		targetCollector))(TrialItem)