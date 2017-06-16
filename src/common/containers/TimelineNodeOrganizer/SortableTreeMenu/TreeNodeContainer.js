import { connect } from 'react-redux';
import TreeNode from '../../../components/TimelineNodeOrganizer/SortableTreeMenu/TreeNode';
import { isTimeline } from '../../../reducers/TimelineNode/utils';


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];
	let isTimelineNode = isTimeline(node);

	return {
		isTimeline: isTimelineNode,
		children: (isTimelineNode) ? node.childrenById : []
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TreeNode);
