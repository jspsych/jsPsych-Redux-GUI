import { connect } from 'react-redux';
import { isTimeline } from '../../reducers/Experiment/utils/index';
import TimelineForm from '../../components/TimelineNodeEditor/TimelineForm';
import * as tableActions from '../../actions/tableAction';


const onRepetitions = (dispatch,newVal) => {
	dispatch(tableActions.changeRepetitions(newVal));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let timeline = experimentState[experimentState.previewId];
	if(!timeline) {
		return {}
	} else {
		return {
			id: timeline.id,
			isTimeline: isTimeline(timeline),
			repetitions: timeline.parameters.repetitions,
		}
	}
};

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (e, newVal) => { onRepetitions(dispatch, newVal) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineForm);