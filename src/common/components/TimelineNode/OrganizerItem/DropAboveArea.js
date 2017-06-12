import React from 'react';

import PreviewItemGroup from '../../../containers/TimelineNode/OrganizerItem/Ghosts/PreviewItemGroupContainer';

import { DRAG_TYPE } from '../../../reducers/timelineNode';
import { DropTarget } from 'react-dnd';


export var lastAreaType = null;
export const setLastAreaType = (t) => {
  lastAreaType = t;
}

export const getLastAreaType = () => (lastAreaType);

const dropAboveAreaStyle = () => ({
    height: 7,
    border: 'none', //'1px solid black'
})

const dropAboveTarget = {
  hover(props, monitor, component) {
    const { id: sourceId, parent: sourceParent } = monitor.getItem();
    const { id: targetId, parent: targetParent, areaType: areaType } = props;

    if (areaType === getLastAreaType()) return;
    setLastAreaType(areaType);

    let dragType;
    if (sourceParent === targetParent) {
      dragType = DRAG_TYPE.DISPLACEMENT;
    } else {
      dragType = DRAG_TYPE.JUMP;
    }

    props.hoverNode(sourceId, targetId, dragType);
  },

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
	render() {
		const { connectDropTarget, isOver, source } = this.props;

		return connectDropTarget(
			<div className="Drop-Above-Area" >
      {(isOver) ? <PreviewItemGroup id={source.id} />: <div style={dropAboveAreaStyle()} />}
			</div>
		)
	}
}
//style={{backgroundColor: (isOver)?'blue': null}}
export default DropTarget(
    "Organizer-Item", 
    dropAboveTarget, 
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      source: monitor.getItem()
    }))(DropAboveArea);