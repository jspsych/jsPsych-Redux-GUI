import React from 'react';

import PreviewTrialItem from '../../../../containers/TimelineNode/OrganizerItem/Ghosts/PreviewTrialItemContainer';
import PreviewTimelineItem from '../../../../containers/TimelineNode/OrganizerItem/Ghosts/PreviewTimelineItemContainer';



class PreviewOrganizerItem extends React.Component {
	
	render() {
		return (
			<div className="Preview-Organizer-Item" style={{
				opacity: 0.7,
			}}>
				{(this.props.isTimeline) ? 
				(<PreviewTimelineItem id={this.props.id} />) :
				(<PreviewTrialItem id={this.props.id} />)}
			</div>
		)
	}
}

export default PreviewOrganizerItem;


