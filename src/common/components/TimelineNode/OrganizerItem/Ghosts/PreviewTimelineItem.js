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



class PreviewTimelineItem extends React.Component {

	render() {
		return (
				<MuiThemeProvider>
				<div className="Preview-Timeline-Item" style={{
								display: 'flex',
								height: "50%",
							}}>
						<IconButton className="Preview-Timeline-Collapse-Icon"
									hoveredStyle={{backgroundColor: hoverColor}}
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
									rightIconButton={
										<IconButton 
											disableTouchRipple={true}
										>
										{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
										</IconButton>
									}/>
						</div>
				</div>
				</MuiThemeProvider>
		)
	}
}

export default PreviewTimelineItem;