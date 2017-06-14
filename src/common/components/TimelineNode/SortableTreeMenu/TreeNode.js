import React from 'react';

import TrialItem from '../../../containers/TimelineNode/SortableTreeMenu/TrialItemContainer';
import TimelineItem from '../../../containers/TimelineNode/SortableTreeMenu/TimelineItemContainer';

class TreeNode extends React.Component {
	
	render() {
		const {
			item: { id, children },
			parent,
		} = this.props;

		return (
			<div className="Tree-Node">
				{(this.props.isTimeline) ? 
				(<TimelineItem 
					id={id} 
					parent={parent}
					children={children}
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>) :
				(<TrialItem 
					id={id} 
					parent={parent}
					children={children}
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>)}
			</div>
		)
	}
}

export default TreeNode;


