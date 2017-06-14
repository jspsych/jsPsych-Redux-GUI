import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TreeNode from '../../../components/TimelineNode/OrganizerItem/TreeNode';
import { isTimeline } from '../../../reducers/timelineNodeUtils';


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];
	let isTimelineNode = isTimeline(node);

	return {
		isTimeline: isTimelineNode,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TreeNode);
