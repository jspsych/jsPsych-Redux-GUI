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
					<div style={{width: "100%"}} >
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
								<IconButton disableTouchRipple={true} onTouchTap={this.props.onToggle}>
								{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
								</IconButton>}
						/>
					</div>
						<Popover
				          open={this.state.contextMenuOpen}
				          anchorEl={this.state.anchorEl}
				          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
				          targetOrigin={{horizontal: 'right', vertical: 'top'}}
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

