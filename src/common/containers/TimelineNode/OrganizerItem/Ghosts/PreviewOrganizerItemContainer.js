import { connect } from 'react-redux';
import PreviewOrganizerItem from '../../../../components/TimelineNode/OrganizerItem/Ghosts/PreviewOrganizerItem';
import { isTimeline } from '../../../../reducers/timelineNodeUtils';


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];

	let isTimelineNode = isTimeline(node);

	return {
		isTimeline: isTimelineNode,
		predictedLevel: node.predictedLevel,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewOrganizerItem);
