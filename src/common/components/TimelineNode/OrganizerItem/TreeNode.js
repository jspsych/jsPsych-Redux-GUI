import React from 'react';

import TrialItem from '../../../containers/TimelineNode/OrganizerItem/TrialItemContainer';
import TimelineItem from '../../../containers/TimelineNode/OrganizerItem/TimelineItemContainer';

import Tree from './Tree';

class TreeNode extends React.Component {
	
	render() {
		const {
			item: { id, children },
			parent,
			move,
			find,
			treeData,
		} = this.props;

		return (
			<div className="Tree-Node">
				{(this.props.isTimeline) ? 
				(<TimelineItem 
					id={id} 
					parent={parent}
					children={children}
					move={move}
					find={find}
					treeData={treeData}
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>) :
				(<TrialItem 
					id={id} 
					parent={parent}
					children={children}
					move={move}
					find={find}
					treeData={treeData}
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>)}
			</div>
		)
	}
}

export default TreeNode;


