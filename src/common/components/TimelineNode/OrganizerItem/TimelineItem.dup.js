import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import { contextMenuStyle } from './TrialItem';

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

export default class TimelineItem extends React.Component {
	render() {
		return (
			<div>
			<MuiThemeProvider>
				<div className="Timeline-Item-Group" style={{
					paddingLeft: 0,
					overflow: 'hidden'
				}}>
					<div className="Timeline-Item" style={{
								paddingLeft: 15 * this.props.level, 
								display: 'flex',
								backgroundColor: (this.props.isSelected) ? highlightColor : null,
								height: "50%"
							}}>
						<IconButton hoveredStyle={{backgroundColor: hoverColor}}
									onTouchTap={this.props.toggleCollapsed} 
									disableTouchRipple={true} >
							{(this.props.collapsed) ? <CollapsedIcon /> : <ExpandedIcon />}
						</IconButton>
						<div style={{width: "100%"}}>
							<ContextMenuTrigger id={"Timeline-Item-RightClick-Field-"+this.props.id}>
							<ListItem 
									primaryText={this.props.name}
									onClick={this.props.onClick} 
									rightIconButton={
										<IconButton 
											disableTouchRipple={true}
											onTouchTap={this.props.onToggle} 
										>
										{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
										</IconButton>
									}/>
							</ContextMenuTrigger>
						</div>
					</div>
					{(this.props.collapsed || this.props.noChildren) ? 
						null :
						(this.props.children.map((id) => (<OrganizerItem id={id} 
																		key={id} 
																		openTimelineEditorCallback={this.props.openTimelineEditorCallback}
																		closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
														/>)))}
					<div style={contextMenuStyle.outerDiv} >
						<ContextMenu id={"Timeline-Item-RightClick-Field-"+this.props.id} >
								<div style={contextMenuStyle.innerDiv}>
									<MenuItem primaryText="New Timeline" 
										leftIcon={<NewTimelineIcon color={contextMenuStyle.iconColor} />}
										onTouchTap={this.props.insertTimeline}
									/>
								</div>
								<div style={contextMenuStyle.innerDiv}>
									<MenuItem primaryText="New Trial"  
										leftIcon={<NewTrialIcon color={contextMenuStyle.iconColor}/>}
										onTouchTap={this.props.insertTrial}
									/>
								</div>
								<div style={contextMenuStyle.lastInnerDiv}>
									<MenuItem primaryText="Delete"  
										leftIcon={<Delete color={contextMenuStyle.iconColor}/>}
										onTouchTap={this.props.deleteItem}
									/></div>
						</ContextMenu>
					</div>
				</div>
			</MuiThemeProvider>
			</div>
		)
	}
}
