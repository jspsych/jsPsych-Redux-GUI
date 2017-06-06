import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import { standardizeTimelineId, standardizeTrialId } from '../../constants/utils';
import TimelineNodeOrganizerDrawer from '../../components/TimelineNode/TimelineNodeOrganizerDrawer';

var timelineId = 0;
var trialId = 0;

const addTrialToMain = (dispatch) => {
	dispatch(timelineNodeActions.addTrialAction(standardizeTrialId(trialId++), null));
}

const addTimelineToMain = (dispatch) => {
	dispatch(timelineNodeActions.addTimelineAction(standardizeTimelineId(timelineId++), null));
}

const mapStateToProps = (state, ownProps) => {
	let s1 = state.timelineNodeState;

	return {
		mainTimeline: s1.mainTimeline
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	addTrialToMain: () => { addTrialToMain(dispatch) },
	addTimelineToMain: () => { addTimelineToMain(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeOrganizerDrawer);
