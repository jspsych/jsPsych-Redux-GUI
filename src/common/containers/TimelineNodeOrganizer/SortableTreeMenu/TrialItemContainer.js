import { connect } from 'react-redux';
import * as organizerActions from '../../../actions/organizerActions';
import TrialItem from '../../../components/TimelineNodeOrganizer/SortableTreeMenu/TrialItem';
import {
	toggleAll,
	untoggleAll,
	toggleThisOnly,
	listenKey
} from './TimelineItemContainer';

const onPreview = (dispatch, ownProps, setKeyboardFocusId) => {
	// console.log(e.nativeEvent.which)
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null || previewId !== ownProps.id) {
			dispatch(organizerActions.onPreviewAction(ownProps.id));
			ownProps.openTimelineEditorCallback();
			setKeyboardFocusId(ownProps.id);
		} else {
			dispatch(organizerActions.onPreviewAction(null));
			// ownProps.closeTimelineEditorCallback();
			setKeyboardFocusId(null);
		}
	})
}

const onToggle = (dispatch, ownProps) => {
	dispatch(organizerActions.onToggleAction(ownProps.id));
}

const insertTimeline = (dispatch, ownProps) => {
	dispatch(organizerActions.insertNodeAfterTrialAction(ownProps.id, true));
}

const insertTrial = (dispatch, ownProps) => {
	dispatch(organizerActions.insertNodeAfterTrialAction(ownProps.id, false));
}

const deleteTrial = (dispatch, ownProps) => {
	dispatch(organizerActions.deleteTrialAction(ownProps.id));
}

const duplicateTrial = (dispatch, ownProps) => {
	dispatch(organizerActions.duplicateTrialAction(ownProps.id));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let node = experimentState[ownProps.id];

	return {
		isSelected: ownProps.id === experimentState.previewId,
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
