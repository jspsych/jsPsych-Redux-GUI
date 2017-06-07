import React from 'react';

import { isTimeline } from '../../../constants/utils';
import TrialItem from '../../../containers/TimelineNode/OrganizerItem/TrialItem';
import TimelineItem from '../../../containers/TimelineNode/OrganizerItem/TimelineItem';

class OrganizerItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			isTimeline(this.props.id) ? 
				(<TimelineItem id={this.props.id} key={this.props.id} 
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>) :
				(<TrialItem id={this.props.id} key={this.props.id} 
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>)
		)
	}
}


export default OrganizerItem;