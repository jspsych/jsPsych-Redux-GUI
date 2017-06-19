import { connect } from 'react-redux';
import * as jsPsychInitActions from '../../../actions/jsPsychInitActions';
import jsPsychInitEditor from '../../../components/Appbar/jsPsychInitEditor';

const setJsPsychInit = (dispatch, key, value) => {
	dispatch(jsPsychInitActions.setJspyschInitAction(key, value));
}

const mapStateToProps = (state, ownProps) => {
	let jsPsychInit = state.timelineNodeState.jsPsychInit;

	return {
		...jsPsychInit,
		min_width: jsPsychInit.exclusions.min_width,
		min_height: jsPsychInit.exclusions.min_height,
		audio: jsPsychInit.exclusions.audio
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setJsPsychInit: (e, value, key) => { setJsPsychInit(dispatch, key, value) }
})

export default connect(mapStateToProps, mapDispatchToProps)(jsPsychInitEditor);
