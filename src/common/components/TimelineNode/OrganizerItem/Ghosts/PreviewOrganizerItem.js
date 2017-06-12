import React from 'react';

import PreviewTrialItem from '../../../../containers/TimelineNode/OrganizerItem/Ghosts/PreviewTrialItemContainer';
import PreviewTimelineItem from '../../../../containers/TimelineNode/OrganizerItem/Ghosts/PreviewTimelineItemContainer';

import { TREE_MENU_INDENT as INDENT } from '../../TimelineNodeOrganizerDrawer';


class PreviewOrganizerItem extends React.Component {
	
	render() {
		return (
			<div className="Preview-Organizer-Item" style={{
				opacity: 0.9,
				paddingLeft: INDENT * this.props.predictedLevel
			}}
			>
				{(this.props.isTimeline) ? 
				(<PreviewTimelineItem id={this.props.id} />) :
				(<PreviewTrialItem id={this.props.id} />)}
			</div>
		)
	}
}

export default PreviewOrganizerItem;


