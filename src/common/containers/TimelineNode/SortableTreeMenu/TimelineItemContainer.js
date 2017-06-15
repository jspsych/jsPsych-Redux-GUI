import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TimelineItem from '../../../components/TimelineNode/SortableTreeMenu/TimelineItem';
import { getTimelineId, getTrialId } from '../../../reducers/timelineNodeUtils';

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

const deleteTimeline = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.deleteTimelineAction(ownProps.id));
}

const duplicateTimeline = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.duplicateTimelineAction(getTimelineId(), ownProps.id, getTimelineId, getTrialId));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];

	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: node.enabled,
		name: node.name,
		collapsed: node.collapsed,
		hasNoChildren: node.childrenById.length === 0,
		childrenById: node.childrenById,
		parent: node.parent,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatch: dispatch,
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	toggleCollapsed: () => { toggleCollapsed(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteTimeline: () => { deleteTimeline(dispatch, ownProps)},
	duplicateTimeline: () => { duplicateTimeline(dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
