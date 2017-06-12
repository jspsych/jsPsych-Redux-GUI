import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import CollapsedIcon from 'material-ui/svg-icons/navigation/chevron-right';
import ExpandedIcon from 'material-ui/svg-icons/navigation/expand-more';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import NewTimelineIcon from 'material-ui/svg-icons/av/playlist-add';
import NewTrialIcon from 'material-ui/svg-icons/action/note-add';
import Delete from 'material-ui/svg-icons/action/delete';
import {
	cyan400 as highlightColor,
	green500 as checkColor,
	indigo500 as iconHighlightColor,
	grey300 as hoverColor,
	grey900 as normalColor,
} from 'material-ui/styles/colors';

import { contextMenuStyle } from './TrialItem';

import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { DRAG_TYPE } from '../../../reducers/timelineNode';
import PreviewItemGroup from '../../../containers/TimelineNode/OrganizerItem/Ghosts/PreviewItemGroupContainer';

import { TREE_MENU_INDENT as INDENT } from '../TimelineNodeOrganizerDrawer';
import {setLastAreaType, getLastAreaType} from './DropAboveArea';


const expandTarget = {
  hover(props, monitor, component) {
    const { id: sourceId, parent: sourceParent } = monitor.getItem();
    const { id: targetId, parent: targetParent, areaType: areaType } = props;


    if (areaType === getLastAreaType()) return;
   	setLastAreaType(areaType);

    props.hoverNode(sourceId, targetId, DRAG_TYPE.TRANSPLANT);
  },

  drop(props, monitor, component) {
  	const { id: sourceId } = monitor.getItem();
    const { id: targetId } = props;

    props.moveNode(sourceId, targetId, undefined, DRAG_TYPE.TRANSPLANT);
  },
};


class TimelineItem extends React.Component {
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
		const { isOver, connectDropTarget, source } = this.props;

		const colorSelector = (isOver, isSelected) => {
			if (isOver)
				return null;

			if (isSelected)
				return highlightColor;

			return null;
		} 
		return connectDropTarget(
				<div  className="Timeline-Item-Container">
				<MuiThemeProvider>
				<div>
				<div className="Timeline-Item" style={{
								display: 'flex',
								backgroundColor: colorSelector(isOver, this.props.isSelected),
								height: "50%",
								paddingLeft: INDENT * this.props.level,
							}}>
						<IconButton className="Timeline-Collapse-Icon"
									hoveredStyle={{backgroundColor: hoverColor}}
									onTouchTap={this.props.toggleCollapsed} 
									disableTouchRipple={true} 
						>
							{(this.props.collapsed || this.props.hasNoChild) ? 
								<CollapsedIcon color={(this.props.isSelected) ? iconHighlightColor : normalColor} /> : 
								<ExpandedIcon color={(this.props.isSelected) ? iconHighlightColor : normalColor} />
							}
						</IconButton>
						<div style={{width: "100%"}}>
							<ListItem 
									primaryText={this.props.name}
									onContextMenu={this.openContextMenu}
									onTouchTap={(e) => {
										if (e.nativeEvent.which === 1) {
											this.props.onClick();
										}
									}}
									rightIconButton={
										<IconButton 
											disableTouchRipple={true}
											onTouchTap={this.props.onToggle} 
										>
										{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
										</IconButton>
									}/>
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
					{(isOver) ? <PreviewItemGroup id={source.id} /> : null}
				</div>
				</MuiThemeProvider>
				</div>
		)
	}
}

export default DropTarget(
  	"Organizer-Item",
   	expandTarget, 
   	(connect, monitor) => ({
   		connectDropTarget: connect.dropTarget(),
   		isOver: monitor.isOver(),
   		source: monitor.getItem(),
	}))(TimelineItem);