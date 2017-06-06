import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import TrialIcon from 'material-ui/svg-icons/editor/mode-edit';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import {
	grey800 as normalColor,
	cyan200 as highlightColor,
	teal600 as iconHighlightColor,
	green500 as checkColor,
	grey300 as hoverColor,
} from 'material-ui/styles/colors';

class TrialItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<MuiThemeProvider>
				<div className="Timeline-Item" style={{
						display:'flex', 
						paddingLeft: (20*this.props.level), 
						minWidth: "100%",
						overflowY: 'hidden',
						backgroundColor: (this.props.isSelected) ? highlightColor : null
					}}>
					<IconButton disableTouchRipple={true} onTouchTap={this.props.onClick}>
						<TrialIcon color={(this.props.isSelected) ? iconHighlightColor : normalColor}/>
					</IconButton>
					<ListItem 
						primaryText={this.props.name}
						onTouchTap={this.props.onClick} 
						rightIconButton={
							<IconButton disableTouchRipple={true} onTouchTap={this.props.onToggle}>
							{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
							</IconButton>}
					/>
				</div>
			</MuiThemeProvider>
		)
	}
}

export default TrialItem;