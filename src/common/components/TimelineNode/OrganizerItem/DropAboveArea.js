import React from 'react';

import { DRAG_TYPE } from '../../../reducers/timelineNode';
import { DropTarget } from 'react-dnd';
import flow from 'lodash/flow';

export const style = (isOver, level) => (
  (isOver) ?
  {
    height: 40,
    border: '1px solid black',
    backgroundColor: "blue",
    paddingLeft: 15 * level, 
  } :
  {
    height: 2,
    paddingLeft: 15 * level, 
  }
)

const dropAboveTarget = {
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

    props.moveNode(sourceId, targetId, true, dragType);
  }
};

class DropAboveArea extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { connectDropTarget, isOver } = this.props;

		return connectDropTarget(
			<div className="Drop-Above-Area"
            style={style(isOver, this.props.level)}
      >
			</div>
		)
	}
}

export default DropTarget(
    "Organizer-Item", 
    dropAboveTarget, 
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    }))(DropAboveArea);