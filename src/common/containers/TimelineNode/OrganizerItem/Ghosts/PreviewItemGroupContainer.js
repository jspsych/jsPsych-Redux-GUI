import { connect } from 'react-redux';
import PreviewItemGroup from '../../../../components/TimelineNode/OrganizerItem/Ghosts/PreviewItemGroup';
import { isTimeline, preOrderTraversal } from '../../../../reducers/timelineNodeUtils';

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let presentedIds = [ownProps.id];
	let startNode = timelineNodeState[ownProps.id];
	if (isTimeline(startNode))
		presentedIds = preOrderTraversal(timelineNodeState, startNode, presentedIds);

	return {
		presentedIds: presentedIds
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewItemGroup);
