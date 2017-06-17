import { connect } from 'react-redux';
import * as jsPsychInitActions from '../../actions/jsPsychInitActions';
import jsPsychInitEditor from '../../components/Appbar/jsPsychInitEditor';

const setJsPsychInit = (dispatch, key, value) => {
	dispatch(jsPsychInitActions.setJspyschInitAction(key, value));
}

const mapStateToProps = (state, ownProps) => {
	let jsPsychInitState = state.jsPsychInitState;

	return {
		default_iti: jsPsychInitState.default_iti,
		on_finish: jsPsychInitState.on_finish,
		on_trial_start: jsPsychInitState.on_trial_start,
		on_trial_finish: jsPsychInitState.on_trial_finish,
		on_data_update: jsPsychInitState.on_data_update,
		on_interaction_data_update: jsPsychInitState.on_interaction_data_update,
		min_width: jsPsychInitState.exclusions.min_width,
		min_height: jsPsychInitState.exclusions.min_height,
		audio: jsPsychInitState.exclusions.audio,
		show_progress_bar: jsPsychInitState.show_progress_bar,
		auto_update_progress_bar: jsPsychInitState.auto_update_progress_bar,
		show_preload_progress_bar: jsPsychInitState.show_preload_progress_bar,
		preload_audio: jsPsychInitState.preload_audio,
		preload_images: jsPsychInitState.preload_images,
		max_load_time: jsPsychInitState.max_load_time,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setJsPsychInit: (e, value, key) => { setJsPsychInit(dispatch, key, value) }
})

export default connect(mapStateToProps, mapDispatchToProps)(jsPsychInitEditor);