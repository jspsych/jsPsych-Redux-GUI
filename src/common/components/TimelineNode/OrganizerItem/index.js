import React from 'react';

import { isTimeline } from '../../../constants/utils';
import TrialItem from '../../../containers/TimelineNode/OrganizerItem/TrialItem';
import TimelineItem from '../../../containers/TimelineNode/OrganizerItem/TimelineItem';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class OrganizerItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="Organizer-Item1" >
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

export default  DragDropContext(HTML5Backend)(OrganizerItem);

// import { DragSource, DropTarget } from 'react-dnd';
// import flow from 'lodash/flow';

// const ItemTypes = {
// 	OrganizerItem: "Organizer-Item-Drag-Area"
// }

// const itemSource = {
//   beginDrag(props) {
//     return {
//       id: props.id,
//       index: props.index,
//       parent: props.parent,
//     };
//   },
// };

// const itemTarget = {
//   drop(props, monitor, component) {
//     const { index:dragIndex, id: sourceId } = monitor.getItem();
//     const { index: hoverIndex, id: targetId } = props;

//     props.moveNode(sourceId, targetId, hoverIndex);
//   },

//   hover(props, monitor, component) {
//   	const { index:dragIndex, id: sourceId } = monitor.getItem();
//     const { index: hoverIndex, id: targetId } = props;

//     if (dragIndex === hoverIndex) {
//       return;
//     }
//   }
// };

// class OrganizerItem extends React.Component {
// 	constructor(props) {
// 		super(props);
// 	}

// 	render() {
// 		const { isDragging, connectDragSource, connectDropTarget } = this.props;
// 		const opacity = isDragging ? 0 : 1;

// 		return connectDragSource(connectDropTarget(
// 			<div className="Organizer-Item-Drag-Area" style={{opacity: opacity}}>
// 				{(this.props.isTimeline) ? 
// 				(<TimelineItem id={this.props.id} key={this.props.id} 
// 					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
// 					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
// 				/>) :
// 				(<TrialItem id={this.props.id} key={this.props.id} 
// 					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
// 					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
// 				/>)}
// 			</div>
// 		))
// 	}
// }

// export default flow(
//   DragSource(ItemTypes.OrganizerItem, itemSource, (connect, monitor) => ({
//   connectDragSource: connect.dragSource(),
//   isDragging: monitor.isDragging(),
// })),
//   DropTarget(ItemTypes.OrganizerItem, itemTarget, connect => ({
//   connectDropTarget: connect.dropTarget(),
// }))
// )(OrganizerItem);

