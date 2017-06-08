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
	grey300 as hoverColor
} from 'material-ui/styles/colors';

import OrganizerItem from '../../../containers/TimelineNode/OrganizerItem';
import { contextMenuStyle } from './TrialItem';


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
		const { isDragging, connectDragSource, connectDropTarget } = this.props;
		const opacity = isDragging ? 0 : 1;

		return (
			<MuiThemeProvider>
					<div className="Timeline-Item" style={{
								paddingLeft: 15 * this.props.level, 
								display: 'flex',
								backgroundColor: (this.props.isSelected) ? highlightColor : null,
								height: "50%"
							}}>
						<IconButton hoveredStyle={{backgroundColor: hoverColor}}
									onTouchTap={this.props.toggleCollapsed} 
									disableTouchRipple={true} 
									disabled={this.props.hasNoChild}
						>
							{(this.props.collapsed || this.props.hasNoChild) ? <CollapsedIcon /> : <ExpandedIcon />}
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
			</MuiThemeProvider>
		)
	}
}

export default TimelineItem;