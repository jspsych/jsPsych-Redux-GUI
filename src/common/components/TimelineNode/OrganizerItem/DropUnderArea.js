import React from 'react';

import { DRAG_TYPE } from '../../../reducers/timelineNode';
import { DropTarget } from 'react-dnd';
import { style } from './DropAboveArea';

const dropUnderTarget = {
  // drop(props, monitor, component) {
  //   const { index:dragIndex, id: sourceId } = monitor.getItem();
  //   const { index: hoverIndex, id: targetId } = props;

  //   props.moveNode(sourceId, targetId, hoverIndex);
  // },

  drop(props, monitor, component) {
  	const { id: sourceId, parent: sourceParent } = monitor.getItem();
    const { id: targetId, parent: targetParent } = props;

    if (sourceId === targetId) return;

    let dragType;
    if (sourceParent === targetParent) {
      dragType = DRAG_TYPE.DISPLACEMENT;
    } else {
      dragType = DRAG_TYPE.JUMP;
    }

    props.moveNode(sourceId, targetId, false, dragType);
  }
};

class DropUnderArea extends React.Component {

	render() {
		const { connectDropTarget, isOver } = this.props;

		return connectDropTarget(
			<div className="Drop-Under-Area"
            style={style(isOver, this.props.level)}
      >
      </div>
		)
	}
}

export default DropTarget(
    "Organizer-Item", 
    dropUnderTarget, 
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    }))(DropUnderArea);