import React from 'react';

import Tree from '../../../containers/TimelineNodeOrganizer/SortableTreeMenu/TreeContainer';

class SortableTreeMenu extends React.Component {

	render() {
		const { openTimelineEditorCallback, closeTimelineEditorCallback } = this.props;

		return (
			<div className="Tree-Menu">
				<Tree children={this.props.children}
					  openTimelineEditorCallback={openTimelineEditorCallback}
					  closeTimelineEditorCallback={closeTimelineEditorCallback}
			    />
			</div>
		)
	}
}

export default utils.withDnDContext(SortableTreeMenu);


