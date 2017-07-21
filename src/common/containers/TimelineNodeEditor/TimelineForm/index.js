import { connect } from 'react-redux';
import TimelineForm from '../../../components/TimelineNodeEditor/TimelineForm';
import * as editorActions from '../../../actions/editorActions';


const setRepetitions = (dispatch,newVal) => {
	dispatch(editorActions.setRepetitionsAction(newVal));
}

const setSampling = (dispatch, key, newVal) => {
	dispatch(editorActions.setSamplingMethodAction(key, newVal));
}

const setSampleSize = (dispatch, newVal) => {
	dispatch(editorActions.setSampleSizeAction(newVal));
}


const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let timeline = experimentState[experimentState.previewId];
	return {
		id: timeline.id,
		repetitions: timeline.parameters.repetitions,
		samplingType: timeline.parameters.sample.type,
		samplingSize: timeline.parameters.sample.size
	}
};

const mapDispatchToProps = (dispatch,ownProps) => ({
	setRepetitions: (e, newVal) => { setRepetitions(dispatch, newVal) },
	setSampling: (e, key, newVal) => { setSampling(dispatch, key, newVal) },
	setSampleSize: (newVal) => { setSampleSize(dispatch, newVal) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineForm);