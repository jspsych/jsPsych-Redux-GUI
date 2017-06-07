import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import { standardizeTimelineId, standardizeTrialId } from '../../constants/utils';
import TimelineNodeOrganizerDrawer from '../../components/TimelineNode/TimelineNodeOrganizerDrawer';
import { isTimeline } from '../../constants/utils';

var timelineId = 0;
var trialId = 0;

const insertTrial = (dispatch) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let previewId = timelineNodeState.previewId;
		if (previewId === null) {
			dispatch(timelineNodeActions.addTrialAction(standardizeTrialId(trialId++), null));
			// its a timeline
		} else if (isTimeline(previewId)) {
			dispatch(timelineNodeActions.addTrialAction(standardizeTrialId(trialId++), previewId));
			// its a trial
		} else {
			let parent = timelineNodeState[previewId].parent;
			dispatch(timelineNodeActions.addTrialAction(standardizeTrialId(trialId++), parent));
		}
	})
}

const insertTimeline = (dispatch) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let previewId = timelineNodeState.previewId;
		if (previewId === null) {
			dispatch(timelineNodeActions.addTimelineAction(standardizeTimelineId(timelineId++), null));
			// its a timeline
		} else if (isTimeline(previewId)) {
			dispatch(timelineNodeActions.addTimelineAction(standardizeTimelineId(timelineId++), previewId));
			// its a trial
		} else {
			let parent = timelineNodeState[previewId].parent;
			dispatch(timelineNodeActions.addTimelineAction(standardizeTimelineId(timelineId++), parent));
		}
	})
}

const deleteSelected = (dispatch) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let previewId = timelineNodeState.previewId;
		if (previewId === null) { 
			return;
			// its a timeline
		} else if (isTimeline(previewId)) {
			dispatch(timelineNodeActions.deleteTimelineAction(previewId));
			// its a trial
		} else {
			dispatch(timelineNodeActions.deleteTrialAction(previewId));
		}
	})
}


const mapStateToProps = (state, ownProps) => {
	let s1 = state.timelineNodeState;

	return {
		mainTimeline: s1.mainTimeline
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	insertTrial: () => { insertTrial(dispatch) },
	insertTimeline: () => { insertTimeline(dispatch) },
	deleteSelected: () => { deleteSelected(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeOrganizerDrawer);
