import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TrialItem from '../../../components/TimelineNodeOrganizer/SortableTreeMenu/TrialItem';
import { getTimelineId, getTrialId } from '../../../reducers/timelineNodeUtils';
import {
	toggleAll,
	untoggleAll,
	toggleThisOnly,
	listenKey
} from './TimelineItemContainer';

const onPreview = (dispatch, ownProps, setKeyboardFocusId) => {
	// console.log(e.nativeEvent.which)
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

const insertTimeline = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.insertNodeAfterTrialAction(getTimelineId(), ownProps.id, true));
}

const insertTrial = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.insertNodeAfterTrialAction(getTrialId(), ownProps.id, false));
}

const deleteTrial = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.deleteTrialAction(ownProps.id));
}

const duplicateTrial = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.duplicateTrialAction(getTrialId(), ownProps.id));
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
	dispatch: dispatch,
	onClick: (setKeyboardFocusId) => { onPreview(dispatch, ownProps, setKeyboardFocusId) },
	onToggle: () => { onToggle(dispatch, ownProps) },
	insertTimeline: () => { insertTimeline(dispatch, ownProps)},
	insertTrial: () => { insertTrial(dispatch, ownProps)},
	deleteTrial: () => { deleteTrial(dispatch, ownProps)},
	duplicateTrial: () => { duplicateTrial(dispatch, ownProps) },
	toggleAll: () => { toggleAll(dispatch) },
	untoggleAll: () => { untoggleAll(dispatch) },
	toggleThisOnly: () => { toggleThisOnly(dispatch, ownProps) },
	listenKey: (e, getKeyboardFocusId) => { listenKey(e, getKeyboardFocusId, dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialItem);
