import { connect } from 'react-redux';
import { isTimeline } from '../../../reducers/Experiment/utils/index';
import TimelineForm from '../../../components/TimelineNodeEditor/TimelineForm';
import * as tableActions from '../../../actions/tableAction';


const setRepetitions = (dispatch,newVal) => {
	dispatch(tableActions.changeRepetitions(newVal));
}

const setSampling = (dispatch, key, newVal) => {
	dispatch(tableActions.changeSampling(key, newVal));
}

const setSampleSize = (dispatch, newVal) => {
	dispatch(tableActions.changeSize(newVal));
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
			samplingType: timeline.parameters.sample.type,
			samplingSize: timeline.parameters.sample.size
		}
	}
};

const mapDispatchToProps = (dispatch,ownProps) => ({
	setRepetitions: (e, newVal) => { setRepetitions(dispatch, newVal) },
	setSampling: (e, key, newVal) => { setSampling(dispatch, key, newVal) },
	setSampleSize: (newVal) => { setSampleSize(dispatch, newVal) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineForm);