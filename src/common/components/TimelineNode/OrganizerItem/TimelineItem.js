import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import CollapsedIcon from 'material-ui/svg-icons/navigation/chevron-right';
import ExpandedIcon from 'material-ui/svg-icons/navigation/expand-more';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import {
	cyan400 as highlightColor,
	green500 as checkColor,
} from 'material-ui/styles/colors';

import { isTimeline } from '../../../constants/utils';
import TrialItem from '../../../containers/TimelineNode/OrganizerItem/TrialItem';
import TimelineItemWrapper from '../../../containers/TimelineNode/OrganizerItem/TimelineItem';

class TimelineItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			collapsed: false
		}

		this.toggleCollapsed = () => {
			this.setState({
				collapsed: !this.state.collapsed
			})
		}
	}

	render() {
		return (
			<MuiThemeProvider>
			<div className="Timeline-Item-Container" style={{paddingLeft: (20*this.props.level) }}>
			<div className="Timeline-Item" style={{
						display:'flex', 
						minWidth: "100%",
						overflowY: 'hidden',
						backgroundColor: (this.props.isSelected) ? highlightColor : null
					}}>
				<IconButton onTouchTap={this.toggleCollapsed} disableTouchRipple={true} >
					{(this.state.collapsed || this.props.noChildren) ? <CollapsedIcon /> : <ExpandedIcon />}
				</IconButton>
				<ListItem 
						primaryText={this.props.name}
						onTouchTap={this.props.onClick} 
						rightIconButton={
							<IconButton 
								disableTouchRipple={true}
								onTouchTap={this.props.onToggle} 
							>
							{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
							</IconButton>
						}/>
			</div>
			{(this.state.collapsed) ? null :
				(this.props.children.map((id) => {
					if (isTimeline(id)) return (<TimelineItemWrapper id={id} key={id} />);
					else return (<TrialItem id={id} key={id} />);
				}))}
			</div>
			</MuiThemeProvider>
		)
	}
}

export default TimelineItem;