import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TimelineItem from '../../../components/TimelineNode/OrganizerItem/TimelineItem';
import { getLevel } from '../../../reducers/timelineNode';
import { getTimelineId, getTrialId } from '../../../constants/utils';

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

const insertTimeline = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.addTimelineAction(getTimelineId(), ownProps.id));
}

const insertTrial = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.addTrialAction(getTrialId(), ownProps.id));
}

const deleteItem = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.deleteTimelineAction(ownProps.id));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let timeline = timelineNodeState[ownProps.id];
	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: timeline.enabled,
		level: getLevel(timelineNodeState, timeline),
		name: timeline.name,
		children: timeline.childrenById,
		collapsed: timeline.collapsed,
		level: getLevel(timelineNodeState, timeline),
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	toggleCollapsed: () => { toggleCollapsed(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteItem: () => { deleteItem(dispatch, ownProps)},
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
