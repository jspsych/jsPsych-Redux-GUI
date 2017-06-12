import { connect } from 'react-redux';
import PreviewTimelineItem from '../../../../components/TimelineNode/OrganizerItem/Ghosts/PreviewTimelineItem';

import { getTimelineId, getTrialId } from '../../../../reducers/timelineNodeUtils';


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let timeline = timelineNodeState[ownProps.id];

	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: timeline.enabled,
		name: timeline.name,
		hasNoChild: timeline.childrenById.length === 0,
		collapsed: timeline.collapsed,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewTimelineItem);
