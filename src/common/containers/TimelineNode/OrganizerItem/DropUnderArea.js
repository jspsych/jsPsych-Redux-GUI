import { connect } from 'react-redux';
import DropUnderArea from '../../../components/TimelineNode/OrganizerItem/DropUnderArea';
import { moveNode } from './index';
import { getLevel } from '../../../reducers/timelineNode';

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];
	
	return {
		parent: node.parent,
		level: getLevel(timelineNodeState, node),
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	moveNode: (sourceId, targetId, up, dragType) => { moveNode(dispatch, sourceId, targetId, up, dragType); }
})

export default connect(mapStateToProps, mapDispatchToProps)(DropUnderArea);
