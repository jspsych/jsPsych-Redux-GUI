import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TimelineItem from '../../../components/TimelineNode/SortableTreeMenu/TimelineItem';
import { getTimelineId, getTrialId } from '../../../reducers/timelineNodeUtils';

const onPreview = (dispatch, ownProps, setKeyboardFocusId) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let previewId = timelineNodeState.previewId;
		if (previewId === null || previewId !== ownProps.id) {
			dispatch(timelineNodeActions.onPreviewAction(ownProps.id));
			ownProps.openTimelineEditorCallback();
			setKeyboardFocusId(ownProps.id);
		} else {
			dispatch(timelineNodeActions.onPreviewAction(null));
			ownProps.closeTimelineEditorCallback();
			setKeyboardFocusId(null);
		}
	})
}

const onToggle = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.onToggleAction(ownProps.id));
}

export const toggleAll = (dispatch) => {
	dispatch(timelineNodeActions.setToggleCollectivelyAction(true));
}

export const untoggleAll = (dispatch) => {
	dispatch(timelineNodeActions.setToggleCollectivelyAction(false));
}

export const toggleThisOnly = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.setToggleCollectivelyAction(false, ownProps.id));
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

export const listenKey = (e, getKeyboardFocusId, dispatch, ownProps) => {
	e.preventDefault();

	if (getKeyboardFocusId() === ownProps.id &&
		 e.which >= 37 && 
		 e.which <= 40) {
		dispatch(timelineNodeActions.moveByKeyboardAction(ownProps.id, e.which));
	}
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];
	let len = node.childrenById.length;
	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: node.enabled,
		name: node.name,
		collapsed: node.collapsed,
		hasNoChildren: len === 0,
		childrenById: node.childrenById,
		parent: node.parent,
		lastItem: (len > 0) ? node.childrenById[len-1] : null
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatch: dispatch,
	onClick: (setKeyboardFocusId) => { onPreview(dispatch, ownProps, setKeyboardFocusId) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	toggleCollapsed: () => { toggleCollapsed(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteTimeline: () => { deleteTimeline(dispatch, ownProps)},
	duplicateTimeline: () => { duplicateTimeline(dispatch, ownProps) },
	toggleAll: () => { toggleAll(dispatch) },
	untoggleAll: () => { untoggleAll(dispatch) },
	toggleThisOnly: () => { toggleThisOnly(dispatch, ownProps) },
	listenKey: (e, getKeyboardFocusId) => { listenKey(e, getKeyboardFocusId, dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
