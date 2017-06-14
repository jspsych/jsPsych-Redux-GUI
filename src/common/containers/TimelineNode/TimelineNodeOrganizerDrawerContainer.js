import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import TimelineNodeOrganizerDrawer from '../../components/TimelineNode/TimelineNodeOrganizerDrawer';
import { isTimeline, 
		getTimelineId, 
		getTrialId, } from '../../reducers/timelineNodeUtils';


const insertTrial = (dispatch) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let previewId = timelineNodeState.previewId;
		if (previewId === null) {
			dispatch(timelineNodeActions.addTrialAction(getTrialId(), null));
			// its a timeline
		} else if (isTimeline(timelineNodeState[previewId])) {
			dispatch(timelineNodeActions.addTrialAction(getTrialId(), previewId));
			// its a trial
		} else {
			let parent = timelineNodeState[previewId].parent;
			dispatch(timelineNodeActions.addTrialAction(getTrialId(), parent));
		}
	})
}

const insertTimeline = (dispatch) => {
	dispatch((dispatch, getState) => {
		let timelineNodeState = getState().timelineNodeState;
		let previewId = timelineNodeState.previewId;
		if (previewId === null) {
			dispatch(timelineNodeActions.addTimelineAction(getTimelineId(), null));
			// its a timeline
		} else if (isTimeline(timelineNodeState[previewId])) {
			dispatch(timelineNodeActions.addTimelineAction(getTimelineId(), previewId));
			// its a trial
		} else {
			let parent = timelineNodeState[previewId].parent;
			dispatch(timelineNodeActions.addTimelineAction(getTimelineId(), parent));
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
		} else if (isTimeline(timelineNodeState[previewId])) {
			dispatch(timelineNodeActions.deleteTimelineAction(previewId));
			// its a trial
		} else {
			dispatch(timelineNodeActions.deleteTrialAction(previewId));
		}
	})
}


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	return {
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	insertTrial: () => { insertTrial(dispatch) },
	insertTimeline: () => { insertTimeline(dispatch) },
	deleteSelected: () => { deleteSelected(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeOrganizerDrawer);
