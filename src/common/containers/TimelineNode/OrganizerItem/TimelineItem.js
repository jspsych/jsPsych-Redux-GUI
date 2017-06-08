import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TimelineItem from '../../../components/TimelineNode/OrganizerItem/TimelineItem';
import { getLevel, getIndex } from '../../../reducers/timelineNode';
import { getTimelineId, getTrialId } from '../../../constants/utils';
import { moveNode } from './index';

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

const moveTimeline = (dispatch, sourceId, targetId, index) => {
	dispatch(timelineNodeActions.moveTimelineAction(sourceId, targetId, index));
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
		hasNoChild: timeline.childrenById.length === 0,
		collapsed: timeline.collapsed,
		level: getLevel(timelineNodeState, timeline),
		index: getIndex(timelineNodeState, timeline),
		parent: timeline.parent,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	toggleCollapsed: () => { toggleCollapsed(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteItem: () => { deleteItem(dispatch, ownProps)},
	moveTimeline: (sourceId, targetId, index) => { moveTimeline(dispatch, sourceId, targetId, index) },
	moveNode: (sourceId, targetId, index) => { moveNode(dispatch, sourceId, targetId, index); }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
