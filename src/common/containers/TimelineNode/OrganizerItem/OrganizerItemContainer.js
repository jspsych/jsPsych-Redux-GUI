import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import OrganizerItem from '../../../components/TimelineNode/OrganizerItem/OrganizerItem';
import { isTimeline } from '../../../reducers/timelineNodeUtils';

export const moveNode = (dispatch, sourceId, targetId, up, dragType) => {
	dispatch(timelineNodeActions.moveNodeAction(sourceId, targetId, up, dragType));
}

export const hoverNode = (dispatch, sourceId, targetId, dragType) => {
	dispatch(timelineNodeActions.hoverNodeAction(sourceId, targetId, dragType));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];

	let isTimelineNode = isTimeline(node);
	return {
		isTimeline: isTimelineNode,
		parent: node.parent,
		childrenById: (isTimelineNode) ? node.childrenById : [],
		state: timelineNodeState
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	moveNode: (sourceId, targetId, up, dragType) => { moveNode(dispatch, sourceId, targetId, up, dragType); },
	hoverNode: (sourceId, targetId, dragType) => { hoverNode(dispatch, sourceId, targetId, dragType); }
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerItem);
