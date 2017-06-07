import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";

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

export const contextMenuStyle = {
	outerDiv: { position: 'absolute', zIndex: 20},
	innerDiv: { backgroundColor: contextMenuBackgroundColor,
				borderBottom: '1px solid #BDBDBD' },
	lastInnerDiv: { backgroundColor: contextMenuBackgroundColor },
	iconColor: contextMenuIconColor,
}


export default class TrialItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
			<MuiThemeProvider>
				<div className="Timeline-Item" style={{
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
					<div style={{width: "100%"}}>
					<ContextMenuTrigger id={"Trial-Item-RightClick-Field-"+this.props.id}>
						<ListItem 
							primaryText={this.props.name}
							onClick={this.props.onClick} 
							rightIconButton={
								<IconButton disableTouchRipple={true} onTouchTap={this.props.onToggle}>
								{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
								</IconButton>}
						/>
						</ContextMenuTrigger>
					</div>
					<div style={contextMenuStyle.outerDiv} >
						<ContextMenu id={"Trial-Item-RightClick-Field-"+this.props.id} >
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

