import React from 'react';

import Tree from '../../../containers/TimelineNode/SortableTreeMenu/TreeContainer';


class SortableTreeMenu extends React.Component {

	render() {
		const { openTimelineEditorCallback, closeTimelineEditorCallback } = this.props;

		return (
			<div className="Tree-Menu">
				<Tree parent={null}
					  children={this.props.treeData}
					  openTimelineEditorCallback={openTimelineEditorCallback}
					  closeTimelineEditorCallback={closeTimelineEditorCallback}
			    />
			</div>
		)
	}
}

export default SortableTreeMenu;


