import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import OrganizerItem from '../../../components/TimelineNode/OrganizerItem';
import { isTimeline } from '../../../constants/utils';
import { getLevel, getIndex } from '../../../reducers/timelineNode';


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];
	return {
		isTimeline: isTimeline(node),
		index: getIndex(timelineNodeState, node),
		parent: node.parent,
	}
};

export const moveNode = (dispatch, sourceId, targetId, index) => {
	dispatch(timelineNodeActions.moveNodeAction(sourceId, targetId, index));
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	moveNode: (sourceId, targetId, index) => { moveNode(dispatch, sourceId, targetId, index); }
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerItem);
