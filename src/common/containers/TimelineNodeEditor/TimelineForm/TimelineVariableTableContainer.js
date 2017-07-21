import { connect } from 'react-redux';
import TimelineVariableTable from '../../../components/TimelineNodeEditor/TimelineForm/TimelineVariableTable';
import * as editorActions from '../../../actions/editorActions';

const setTimelineVariable = (dispatch, tv) => {
	dispatch(editorActions.setTimelineVariableAction(tv));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let timeline = experimentState[experimentState.previewId];
	return {
		id: timeline.id,
		timelineVariable: timeline.parameters.timeline_variables,
		repetitions: timeline.parameters.repetitions,
		samplingType: timeline.parameters.sample.type,
		samplingSize: timeline.parameters.sample.size
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setTimelineVariable: (tv) => { setTimelineVariable(dispatch, tv); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineVariableTable);