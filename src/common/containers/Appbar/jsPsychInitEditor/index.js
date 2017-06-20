import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';

import jsPsychInitEditor from '../../../components/Appbar/jsPsychInitEditor';

const setJsPsychInit = (dispatch, key, value) => {
	dispatch(timelineNodeActions.setJspyschInitAction(key, value));
}

const turnOffLiveEditting = (dispatch) => {
	dispatch(timelineNodeActions.setLiveEdittingAction(false));
}

const turnOnLiveEditting = (dispatch) => {
	dispatch(timelineNodeActions.setLiveEdittingAction(true));
}

const mapStateToProps = (state, ownProps) => {
	let jsPsychInit = state.timelineNodeState.jsPsychInit;

	return {
		...jsPsychInit,
		min_width: jsPsychInit.exclusions.min_width,
		min_height: jsPsychInit.exclusions.min_height,
		audio: jsPsychInit.exclusions.audio,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setJsPsychInit: (e, value, key) => { setJsPsychInit(dispatch, key, value); },
	turnOffLiveEditting: () => { turnOffLiveEditting(dispatch); },
	turnOnLiveEditting: () => { turnOnLiveEditting(dispatch); },
})

export default connect(mapStateToProps, mapDispatchToProps)(jsPsychInitEditor);
