import React from 'react';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import NewTimelineIcon from 'material-ui/svg-icons/av/playlist-add';
import NewTrialIcon from 'material-ui/svg-icons/action/note-add';
import Delete from 'material-ui/svg-icons/action/delete';
import Duplicate from 'material-ui/svg-icons/content/content-copy';

import SelectAllIcon from 'material-ui/svg-icons/content/select-all';
import DeselectAllIcon from 'material-ui/svg-icons/content/block';
import SelectThisOnlyIcon from 'material-ui/svg-icons/device/gps-fixed';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import theme from './theme.js';

const contextMenuStyle = theme.contextMenuStyle; 

export default class NestedContextMenus extends React.Component {

	render() {
		return (
				<div>
					<Popover
			          open={this.props.openItemMenu}
			          anchorEl={this.props.anchorEl}
			          anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
			          targetOrigin={{horizontal: 'middle', vertical: 'top'}}
			          onRequestClose={this.props.onRequestCloseItemMenu}
			        >
			        <Menu>
						<MenuItem primaryText="New Timeline" 
							leftIcon={<NewTimelineIcon color={contextMenuStyle.iconColor} />}
							onClick={()=>{ this.props.insertTimeline(); this.props.onRequestCloseItemMenu()}}
						/>
						<Divider />
						<MenuItem primaryText="New Trial"  
							leftIcon={<NewTrialIcon color={contextMenuStyle.iconColor}/>}
							onClick={()=>{ this.props.insertTrial(); this.props.onRequestCloseItemMenu()}}
						/><Divider />
						<MenuItem primaryText="Delete"  
							leftIcon={<Delete color={contextMenuStyle.iconColor}/>}
							onClick={()=>{ this.props.deleteNode(); this.props.onRequestCloseItemMenu()}}
						/>
						<Divider />
						<MenuItem primaryText="Duplicate"  
							leftIcon={<Duplicate color={contextMenuStyle.iconColor}/>}
							onClick={()=>{ this.props.duplicateNode(); this.props.onRequestCloseItemMenu()}}
						/>
						<Divider />
						<MenuItem primaryText={this.props.isEnabled ? "Disable" : "Enable"}
							leftIcon={
								this.props.isEnabled ?
								<CheckIcon color={contextMenuStyle.iconColor} />:
								<UnCheckIcon color={contextMenuStyle.iconColor} />
							}
							onClick={()=>{ this.props.onToggle(); this.props.onRequestCloseItemMenu()}}
						/>
					</Menu>
					</Popover>
				</div>
		)
	}
}

