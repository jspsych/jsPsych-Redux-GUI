import React from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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

export default DragDropContext(HTML5Backend)(SortableTreeMenu);


