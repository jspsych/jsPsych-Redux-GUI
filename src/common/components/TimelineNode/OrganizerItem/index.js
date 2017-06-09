import React from 'react';

import { isTimeline } from '../../../constants/utils';
import TrialItem from '../../../containers/TimelineNode/OrganizerItem/TrialItem';
import TimelineItem from '../../../containers/TimelineNode/OrganizerItem/TimelineItem';
import DropAboveArea from '../../../containers/TimelineNode/OrganizerItem/DropAboveArea';
import DropUnderArea from '../../../containers/TimelineNode/OrganizerItem/DropUnderArea';

import { DragSource } from 'react-dnd';

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
      parent: props.parent,
    };
  },
};


class OrganizerItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { connectDragSource } = this.props;

		return connectDragSource(
			<div>
			<DropAboveArea id={this.props.id} />
			<div className="Organizer-Item" 
			>
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
			</div>
		)
	}
}

export default DragSource(
    "Organizer-Item", 
  	itemSource, 
  	(connect, monitor) => ({
  		connectDragSource: connect.dragSource(),
  		isDragging: monitor.isDragging(),
	}))(OrganizerItem);


