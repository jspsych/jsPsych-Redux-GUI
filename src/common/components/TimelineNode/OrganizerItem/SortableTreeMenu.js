import React from 'react';

import Tree from '../../../containers/TimelineNode/OrganizerItem/TreeContainer';


var treeData = [];

function moveItem(id, afterId, nodeId) {
	if (id == afterId) return;

	const item = { ...findItem(id, treeData) };

	// didn't find anything
	if (!item) {
		return;
	}

	// if go to main timeline
	const dest = (nodeId) ? findItem(nodeId, treeData).children : treeData;

	if (!afterId) {
		removeNode(id, treeData);
		dest.push(item);
	} else {
		const index = dest.indexOf(dest.filter(v => v.id == afterId).shift());
		removeNode(id, treeData);
		dest.splice(index, 0, item);
	}

}

const removeNode = (id, items) => {
	for (const node of items) {
		if (node.id == id) {
			items.splice(items.indexOf(node), 1);
			return;
		}

		if (node.children && node.children.length) {
			removeNode(id, node.children);
		}
	}
}

function findItem(id, items) {
	if (!items) return false;

	for (const node of items) {
		if (node.id == id)
			return node;
		if (node.children && node.children.length) {
			const result = findItem(id, node.children);
			if (result) {
				return result;
			}
		}
	}

	return false;
}

class SortableTreeMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		treeData = this.props.treeData;
		const { openTimelineEditorCallback, closeTimelineEditorCallback } = this.props;

		return (
			<div className="Tree-Menu">
				<Tree parent={null}
					  children={treeData}
					  openTimelineEditorCallback={openTimelineEditorCallback}
					  closeTimelineEditorCallback={closeTimelineEditorCallback}
					  move={moveItem}
       				  find={findItem}
       				  treeData={treeData}
			    />
			</div>
		)
	}
}

export default SortableTreeMenu;


