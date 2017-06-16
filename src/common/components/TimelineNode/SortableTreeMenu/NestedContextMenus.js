import React from 'react';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import NewTimelineIcon from 'material-ui/svg-icons/av/playlist-add';
import NewTrialIcon from 'material-ui/svg-icons/action/note-add';
import Delete from 'material-ui/svg-icons/action/delete';
import Duplicate from 'material-ui/svg-icons/content/content-copy';

import SelectAllIcon from 'material-ui/svg-icons/content/select-all';
import DeselectAllIcon from 'material-ui/svg-icons/content/block';
import SelectThisOnlyIcon from 'material-ui/svg-icons/device/gps-fixed';

import {
	pink500 as contextMenuIconColor,
	grey100 as contextMenuBackgroundColor,
} from 'material-ui/styles/colors';

const contextMenuStyle = {
	outerDiv: { position: 'absolute', zIndex: 20},
	innerDiv: { backgroundColor: contextMenuBackgroundColor,
				borderBottom: '1px solid #BDBDBD' },
	lastInnerDiv: { backgroundColor: contextMenuBackgroundColor },
	iconColor: contextMenuIconColor,
}

export default class NestedContextMenus extends React.Component {

	render() {
		return (
			<MuiThemeProvider>
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
							onTouchTap={()=>{ this.props.insertTimeline(); this.props.onRequestCloseItemMenu()}}
						/>
						<Divider />
						<MenuItem primaryText="New Trial"  
							leftIcon={<NewTrialIcon color={contextMenuStyle.iconColor}/>}
							onTouchTap={()=>{ this.props.insertTrial(); this.props.onRequestCloseItemMenu()}}
						/><Divider />
						<MenuItem primaryText="Delete"  
							leftIcon={<Delete color={contextMenuStyle.iconColor}/>}
							onTouchTap={()=>{ this.props.deleteNode(); this.props.onRequestCloseItemMenu()}}
						/>
						<Divider />
						<MenuItem primaryText="Duplicate"  
							leftIcon={<Duplicate color={contextMenuStyle.iconColor}/>}
							onTouchTap={()=>{ this.props.duplicateNode(); this.props.onRequestCloseItemMenu()}}
						/>
					</Menu>
					</Popover>

					<Popover
					  open={this.props.openToggleMenu}
					  anchorEl={this.props.anchorEl}
			          anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
			          targetOrigin={{horizontal: 'middle', vertical: 'top'}}
			          onRequestClose={this.props.onRequestCloseToggleMenu}
			          >
			          <Menu>
			          	<MenuItem primaryText="Toggle All" 
							leftIcon={<SelectAllIcon color={contextMenuStyle.iconColor} />}
							onTouchTap={()=>{ this.props.toggleAll(); this.props.onRequestCloseToggleMenu()}}
						/>
						<Divider />
						<MenuItem primaryText="Untoggle All" 
							leftIcon={<DeselectAllIcon color={contextMenuStyle.iconColor} />}
							onTouchTap={()=>{ this.props.untoggleAll(); this.props.onRequestCloseToggleMenu()}}
						/>
						<Divider />
						<MenuItem primaryText="Toggle This Only" 
							leftIcon={<SelectThisOnlyIcon color={contextMenuStyle.iconColor} />}
							onTouchTap={()=>{ this.props.toggleThisOnly(); this.props.onRequestCloseToggleMenu()}}
						/>
						</Menu>
					</Popover>
				</div>
			</MuiThemeProvider>
		)
	}
}

