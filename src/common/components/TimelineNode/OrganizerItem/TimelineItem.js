import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
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

export default class TimelineItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			contextMenuOpen: false,
		}

		this.openContextMenu = (event) => {
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

		this.preventDefault = (e) => {
			e.preventDefault();
		}
	}

	componentDidMount() {
        document.addEventListener('contextmenu', this.preventDefault)
    }

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this.preventDefault)
    }

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
							<ListItem 
									primaryText={this.props.name}
									onTouchTap={(e) => {
										if (e.nativeEvent.which === 1) {
											this.props.onClick();
										} else {
											e.preventDefault();
											e.stopPropagation();
											e.nativeEvent.preventDefault();
											e.nativeEvent.stopPropagation();
											this.openContextMenu(e);
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
					</div>
					{(this.props.collapsed || this.props.noChildren) ? 
						null :
						(this.props.children.map((id) => (<OrganizerItem id={id} 
																		key={id} 
																		openTimelineEditorCallback={this.props.openTimelineEditorCallback}
																		closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
														/>)))}
						<Popover
				          open={this.state.contextMenuOpen}
				          anchorEl={this.state.anchorEl}
				          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
				          targetOrigin={{horizontal: 'left', vertical: 'top'}}
				          onRequestClose={this.closeContextMenu}
				        >
				        <Menu>
							<MenuItem primaryText="New Timeline" 
								leftIcon={<NewTimelineIcon color={contextMenuStyle.iconColor} />}
								onTouchTap={()=>{ this.props.insertTimeline(); this.closeContextMenu()}}
							/>
							<MenuItem primaryText="New Trial"  
								leftIcon={<NewTrialIcon color={contextMenuStyle.iconColor}/>}
								onTouchTap={()=>{ this.props.insertTrial(); this.closeContextMenu()}}
							/>
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
