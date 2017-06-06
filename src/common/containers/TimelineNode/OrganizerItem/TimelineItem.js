import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TimelineItem from '../../../components/TimelineNode/OrganizerItem/TimelineItem';

const onPreview = (dispatch, ownProps) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let previewId = timelineNodeState.previewId;
		if (previewId === null || previewId !== ownProps.id) {
			dispatch(timelineNodeActions.onPreviewAction(ownProps.id));
			ownProps.openTimelineEditorCallback();
		} else {
			dispatch(timelineNodeActions.onPreviewAction(null));
			ownProps.closeTimelineEditorCallback();
		}
	})
}

const onToggle = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.onToggleAction(ownProps.id));
}

const toggleCollapsed = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.setCollapsed(ownProps.id));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let timeline = timelineNodeState[ownProps.id];
	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: timeline.enabled,
		level: timeline.level(timelineNodeState, timeline),
		name: timeline.name,
		children: timeline.childrenById,
		collapsed: timeline.collapsed
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	toggleCollapsed: () => { toggleCollapsed(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
