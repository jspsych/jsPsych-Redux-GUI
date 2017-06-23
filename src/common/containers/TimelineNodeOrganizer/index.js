import { connect } from 'react-redux';
import * as organizerActions from '../../actions/organizerActions';
import TimelineNodeOrganizer from '../../components/TimelineNodeOrganizer';
import { isTimeline, 
		getTimelineId, 
		getTrialId, } from '../../reducers/Experiment/utils';


const insertTrial = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) {
			dispatch(organizerActions.addTrialAction(getTrialId(), null));
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(organizerActions.addTrialAction(getTrialId(), previewId));
			// its a trial
		} else {
			let parent = experimentState[previewId].parent;
			dispatch(organizerActions.addTrialAction(getTrialId(), parent));
		}
	})
}

const insertTimeline = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) {
			dispatch(organizerActions.addTimelineAction(getTimelineId(), null));
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(organizerActions.addTimelineAction(getTimelineId(), previewId));
			// its a trial
		} else {
			let parent = experimentState[previewId].parent;
			dispatch(organizerActions.addTimelineAction(getTimelineId(), parent));
		}
	})
}

const deleteSelected = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) { 
			return;
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(organizerActions.deleteTimelineAction(previewId));
			// its a trial
		} else {
			dispatch(organizerActions.deleteTrialAction(previewId));
		}
	})
}

const duplicateNode = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) { 
			return;
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(organizerActions.duplicateTimelineAction(getTimelineId(), previewId, getTimelineId, getTrialId));
			// its a trial
		} else {
			dispatch(organizerActions.duplicateTrialAction(getTrialId(), previewId));
		}
	})
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	return {
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	insertTrial: () => { insertTrial(dispatch) },
	insertTimeline: () => { insertTimeline(dispatch) },
	deleteSelected: () => { deleteSelected(dispatch) },
	duplicateNode: () => { duplicateNode(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeOrganizer);
