import React from 'react';

import TrialItem from '../../../containers/TimelineNode/OrganizerItem/TrialItemContainer';
import TimelineItem from '../../../containers/TimelineNode/OrganizerItem/TimelineItemContainer';
import DropUnderArea from '../../../containers/TimelineNode/OrganizerItem/DropUnderAreaContainer';

import { isAncestor } from '../../../reducers/timelineNode';

import { DragSource } from 'react-dnd';


const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      parent: props.parent,
      areaType: props.areaType
    };
  },
};


class OrganizerItem extends React.Component {
	
	render() {
		const { isDragging, connectDragSource, draggedItem } = this.props;

		let hide = isDragging;
		let draggedItemId = null;
		if (draggedItem) {
			draggedItemId = draggedItem.id;
			hide = isDragging || isAncestor(this.props.state, draggedItemId, this.props.id);
		}

		return connectDragSource(
			(hide) ? <div /> :
			(
			<div className="Organizer-Item">
				{(this.props.isTimeline) ? 
				(<TimelineItem 
					id={this.props.id} 
					areaType={this.props.areaType}
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>) :
				(<TrialItem 
					id={this.props.id} 
					areaType={this.props.areaType}
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>)}
			</div>)
		)
	}
}

export default DragSource(
    "Organizer-Item", 
  	itemSource, 
  	(connect, monitor) => ({
  		connectDragSource: connect.dragSource(),
  		isDragging: monitor.isDragging(),
  		draggedItem: monitor.getItem()
	}))(OrganizerItem);


