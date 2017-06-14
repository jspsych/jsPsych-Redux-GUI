import React from 'react';

import TreeNode from '../../../containers/TimelineNode/OrganizerItem/TreeNodeContainer';


class Tree extends React.Component {
	
	render() {
		const {
			children,
			parent,
			collapsed,
			move,
			find,
			treeData,
			isOver
		} = this.props;

		return (
			<div className="Sortable-Tree"  >
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

export default Tree;


