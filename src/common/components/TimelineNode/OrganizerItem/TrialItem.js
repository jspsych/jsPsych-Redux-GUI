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

import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { DRAG_TYPE } from '../../../reducers/timelineNode';


const trialTarget = {
  // drop(props, monitor, component) {
  //   const { index:dragIndex, id: sourceId } = monitor.getItem();
  //   const { index: hoverIndex, id: targetId } = props;

  //   props.moveNode(sourceId, targetId, hoverIndex);
  // },

  drop(props, monitor, component) {
  	const { id: sourceId, parent: sourceParent } = monitor.getItem();
    const { id: targetId, parent: targetParent } = props;

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    let up = true;
    if (hoverClientY < hoverMiddleY) {
      up = false;
    }

    let dragType;
    if (sourceParent === targetParent) {
      dragType = DRAG_TYPE.DISPLACEMENT;
    } else {
      dragType = DRAG_TYPE.JUMP;
    }


    props.moveNode(sourceId, targetId, up, dragType);
  }
};


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
		const { isOver, connectDropTarget } = this.props;
		return connectDropTarget(
			<div>
			<MuiThemeProvider>
				<div className="Trial-Item" style={{
						display:'flex', 
						paddingLeft: this.props.level * 15, 
						minWidth: "100%",
						overflow: 'hidden',
						backgroundColor: (this.props.isSelected) ? highlightColor : null
					}} >
					<IconButton 
						hoveredStyle={{backgroundColor: hoverColor}}
						disableTouchRipple={true} 
						onTouchTap={this.props.onClick}>
						<TrialIcon color={(this.props.isSelected) ? iconHighlightColor : normalColor}/>
					</IconButton>
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
			</MuiThemeProvider>
			</div>
		)
	}
}

export default DropTarget(
  	"Organizer-Item",
   	trialTarget, 
   	(connect, monitor) => ({
   		connectDropTarget: connect.dropTarget(),
   		isOver: monitor.isOver(),
	}))(TrialItem);