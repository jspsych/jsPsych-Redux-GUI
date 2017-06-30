import { connect } from 'react-redux';
import * as organizerActions from '../../actions/organizerActions';
import TimelineNodeOrganizer from '../../components/TimelineNodeOrganizer';
import { isTimeline } from '../../reducers/Experiment/utils';


const insertTrial = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) {
			dispatch(organizerActions.addTrialAction(null));
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(organizerActions.addTrialAction(previewId));
			// its a trial
		} else {
			let parent = experimentState[previewId].parent;
			dispatch(organizerActions.addTrialAction(parent));
		}
	})
}

const insertTimeline = (dispatch) => {
	dispatch((dispatch, getState) => {
		let experimentState = getState().experimentState;
		let previewId = experimentState.previewId;
		if (previewId === null) {
			dispatch(organizerActions.addTimelineAction(null));
			// its a timeline
		} else if (isTimeline(experimentState[previewId])) {
			dispatch(organizerActions.addTimelineAction(previewId));
			// its a trial
		} else {
			let parent = experimentState[previewId].parent;
			dispatch(organizerActions.addTimelineAction(parent));
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
			dispatch(organizerActions.duplicateTimelineAction(previewId));
			// its a trial
		} else {
			dispatch(organizerActions.duplicateTrialAction(previewId));
		}
	})
}

const mapStateToProps = (state, ownProps) => {
	// let experimentState = state.experimentState;

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
