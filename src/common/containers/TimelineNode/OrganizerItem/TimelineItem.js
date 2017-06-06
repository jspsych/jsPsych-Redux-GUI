import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TimelineItem from '../../../components/TimelineNode/OrganizerItem/TimelineItem';

const onPreview = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.onPreviewAction(ownProps.id));
}

const onToggle = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.onToggleAction(ownProps.id));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let timeline = timelineNodeState[ownProps.id];
	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: timeline.enabled,
		level: timeline.level(timelineNodeState),
		name: timeline.name,
		children: timeline.childrenById,
		noChildren: timeline.childrenById.length === 0
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
