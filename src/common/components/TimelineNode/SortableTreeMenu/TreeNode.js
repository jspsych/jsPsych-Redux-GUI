import React from 'react';

import TrialItem from '../../../containers/TimelineNode/SortableTreeMenu/TrialItemContainer';
import TimelineItem from '../../../containers/TimelineNode/SortableTreeMenu/TimelineItemContainer';

class TreeNode extends React.Component {
	
	render() {
		const {
			id,
			children,
		} = this.props;

		return (
			<div className="Tree-Node">
				{(this.props.isTimeline) ? 
				(<TimelineItem 
					id={id} 
					children={children}
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>) :
				(<TrialItem 
					id={id} 
					openTimelineEditorCallback={this.props.openTimelineEditorCallback}
					closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
				/>)}
			</div>
		)
	}
}

export default TreeNode;


