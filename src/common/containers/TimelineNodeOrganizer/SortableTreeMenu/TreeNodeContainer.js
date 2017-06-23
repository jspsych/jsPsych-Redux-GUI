import { connect } from 'react-redux';
import TreeNode from '../../../components/TimelineNodeOrganizer/SortableTreeMenu/TreeNode';
import { isTimeline } from '../../../reducers/Experiment/utils';


const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let node = experimentState[ownProps.id];
	let isTimelineNode = isTimeline(node);

	return {
		isTimeline: isTimelineNode,
		children: (isTimelineNode) ? node.childrenById : []
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TreeNode);
