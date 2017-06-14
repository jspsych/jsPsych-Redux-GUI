import React from 'react';
import { DropTarget } from 'react-dnd'
import TreeNode from '../../../containers/TimelineNode/OrganizerItem/TreeNodeContainer';
import { updateTreeAction } from '../../../actions/timelineNodeActions';

const treeTarget = {

  hover(props, monitor) {
    const {id: draggedId, parent, children: items} = monitor.getItem();

    if (!monitor.isOver({shallow: true})) return;
    const descendantNode = props.find(props.parent, items);
    if (descendantNode) return;
    if (parent == props.parent || draggedId == props.parent) return;
    props.move(draggedId, props.id, props.parent);
    props.dispatch(updateTreeAction(props.treeData));
  }
}

const targetCollector = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver({shallow: true})
})

class Tree extends React.Component {
	
	render() {
		const {
			connectDropTarget,
			children,
			parent,
			collapsed,
			move,
			find,
			treeData,
			isOver
		} = this.props;

		return connectDropTarget(
			<div className="Sortable-Tree" 
				 style={{
				 	minHeight: 15,
			        paddingTop: 10,
			        marginTop: -5,
			     }}>
				{(collapsed) ?
					null:
					(children.map((item) => (
					<TreeNode 
						id={item.id}
						key={item.id}
						parent={parent}
						item={item}
						move={move}
						find={find}
						treeData={treeData}
						openTimelineEditorCallback={this.props.openTimelineEditorCallback}
						closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}/>
					)))
				}
			</div>
		)
	}
}

export default DropTarget(
	"Organizer-Item",
	treeTarget,
	targetCollector)(Tree);


