import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TrialItem from '../../../components/TimelineNode/OrganizerItem/TrialItem';
import { getLevel, isAncestor } from '../../../reducers/timelineNode';
import { getTimelineId, getTrialId } from '../../../reducers/timelineNodeUtils';
import { moveNode, hoverNode } from './OrganizerItemContainer';

const onPreview = (dispatch, ownProps) => {
	// console.log(e.nativeEvent.which)
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

const insertTimeline = (dispatch, ownProps) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let parent = timelineNodeState[ownProps.id].parent;
		dispatch(timelineNodeActions.addTimelineAction(getTimelineId(), parent));
	})
}

const insertTrial = (dispatch, ownProps) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let parent = timelineNodeState[ownProps.id].parent;
		dispatch(timelineNodeActions.addTrialAction(getTrialId(), parent));
	})
}

const deleteItem = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.deleteTrialAction(ownProps.id));
}


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let trial = timelineNodeState[ownProps.id];

	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: trial.enabled,
		name: trial.name,
		parent: trial.parent,
		level: getLevel(timelineNodeState, trial),
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteItem: () => { deleteItem(dispatch, ownProps)},
	moveNode: (sourceId, targetId, up, dragType) => { moveNode(dispatch, sourceId, targetId, up, dragType); },
	hoverNode: (sourceId, targetId, dragType) => { hoverNode(dispatch, sourceId, targetId, dragType); }
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialItem);
