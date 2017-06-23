import { connect } from 'react-redux';
import { isTimeline } from '../../reducers/Experiment/utils/index';
import TimelineForm from '../../components/TimelineNodeEditor/TimelineForm';

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let timeline = experimentState[experimentState.previewId];

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