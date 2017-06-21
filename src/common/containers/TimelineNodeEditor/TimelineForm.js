import { connect } from 'react-redux';
import { isTimeline } from '../../reducers/TimelineNode/utils/index';
import TimelineForm from '../../components/TimelineNodeEditor/TimelineForm';

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let timeline = timelineNodeState[timelineNodeState.previewId];

	if(timeline != null) {
		return {
			id: timeline.id,
			isTimeline: isTimeline(timeline),
			timeline_variable: timeline.parameters.timeline_variable
		}
	} else {
		return {
		}
	}
};

const mapDispatchToProps = (dispatch,ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineForm);