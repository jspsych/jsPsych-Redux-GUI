import React from 'react';

import { isTimeline } from '../../../constants/utils';
import TrialItem from '../../../containers/TimelineNode/OrganizerItem/TrialItem';
import TimelineItem from '../../../containers/TimelineNode/OrganizerItem/TimelineItem';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';


class OrganizerItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				{(this.props.isTimeline) ? 
				(<TimelineItem id={this.props.id} key={this.props.id} 
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>) :
				(<TrialItem id={this.props.id} key={this.props.id} 
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>)}
			</div>
		)
	}
}

export default DragDropContext(HTML5Backend)(OrganizerItem);

