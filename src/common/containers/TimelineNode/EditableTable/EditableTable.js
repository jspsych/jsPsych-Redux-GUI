import { connect } from 'react-redux';
import EditableTable from '../../../components/TimelineNode/EditableTable/EditableTable';
import { isTimeline } from '../../../reducers/timelineNodeUtils';

const mapStateToProps = (state, ownProps) => {
	let timelineId = null;
	let timelineNodeState = state.timelineNodeState;
	let node = timelinNodeState[ownProps.id];
	if(isTimeline(node)) {
		timelineId = node.id;
	}
	return{
		timelineId: timelineId
	}
};
