import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import OrganizerItem from '../../../components/TimelineNode/OrganizerItem';
import { isTimeline } from '../../../constants/utils';
import { getLevel, getIndex } from '../../../reducers/timelineNode';

export const moveNode = (dispatch, sourceId, targetId, up, dragType) => {
	dispatch(timelineNodeActions.moveNodeAction(sourceId, targetId, up, dragType));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];
	
	return {
		isTimeline: isTimeline(node),
		parent: node.parent,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	moveNode: (sourceId, targetId, up, dragType) => { moveNode(dispatch, sourceId, targetId, up, dragType); }
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerItem);
