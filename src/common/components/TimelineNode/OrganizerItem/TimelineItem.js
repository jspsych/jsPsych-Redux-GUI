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
	grey300 as hoverColor
} from 'material-ui/styles/colors';

import { isTimeline } from '../../../constants/utils';
import TrialItem from '../../../containers/TimelineNode/OrganizerItem/TrialItem';
import TimelineItemWrapper from '../../../containers/TimelineNode/OrganizerItem/TimelineItem';

class TimelineItem extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<MuiThemeProvider>
			<div className="Timeline-Item-Container" style={{
				paddingLeft: 0,
				overflow: 'hidden'
			}}>
			<div className="Timeline-Item" style={{
						paddingLeft: 20 * this.props.level, 
						display: 'flex',
						backgroundColor: (this.props.isSelected) ? highlightColor : null
					}}>
				<IconButton hoveredStyle={{backgroundColor: hoverColor}}
							onTouchTap={this.props.toggleCollapsed} 
							disableTouchRipple={true} >
					{(this.props.collapsed) ? <CollapsedIcon /> : <ExpandedIcon />}
				</IconButton>
				<div style={{width: "100%"}}>
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
						}/></div>
			</div>
			{(this.props.collapsed || this.props.noChildren) ? null :
				(this.props.children.map((id) => {
					if (isTimeline(id)) return (<TimelineItemWrapper id={id} key={id} 
						openTimelineEditorCallback={this.props.openTimelineEditorCallback}
						closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
						/>);
					else return (<TrialItem id={id} key={id} 
						openTimelineEditorCallback={this.props.openTimelineEditorCallback}
						closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
						/>);
				}))}
			</div>
			</MuiThemeProvider>
		)
	}
}

export default TimelineItem;