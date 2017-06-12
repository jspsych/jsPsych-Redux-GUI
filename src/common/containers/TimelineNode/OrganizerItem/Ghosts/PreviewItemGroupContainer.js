import { connect } from 'react-redux';
import PreviewItemGroup from '../../../../components/TimelineNode/OrganizerItem/Ghosts/PreviewItemGroup';
import { isTimeline, preOrderTraversal } from '../../../../reducers/timelineNodeUtils';

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let presentedIds = [ownProps.id];

	return {
		presentedIds: presentedIds,
		predictedLevel: timelineNodeState[ownProps.id].predictedLevel
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewItemGroup);
