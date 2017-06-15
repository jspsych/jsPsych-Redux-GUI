import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TrialItem from '../../../components/TimelineNode/SortableTreeMenu/TrialItem';
import { getTimelineId, getTrialId } from '../../../reducers/timelineNodeUtils';

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

	let node = timelineNodeState[ownProps.id];

	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: node.enabled,
		name: node.name,
		parent: node.parent,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteItem: () => { deleteItem(dispatch, ownProps)},
	dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialItem);
