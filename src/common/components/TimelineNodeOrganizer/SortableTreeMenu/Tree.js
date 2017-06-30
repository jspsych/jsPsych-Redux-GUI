import React from 'react';
import TreeNode from '../../../containers/TimelineNodeOrganizer/SortableTreeMenu/TreeNodeContainer';


class Tree extends React.Component {
	
	render() {
		const {
			children,
			collapsed,
		} = this.props;

		return (
			<div className="Sortable-Tree"  >
				{(collapsed) ?
					null:
					(children.map((id) => (
					<TreeNode 
						id={id}
						key={id}
						openTimelineEditorCallback={this.props.openTimelineEditorCallback}
						closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}/>
					)))
				}
			</div>
		)
	}
}

export default Tree;


