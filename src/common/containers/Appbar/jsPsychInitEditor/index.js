import { connect } from 'react-redux';
import * as experimentSettingActions from '../../../actions/experimentSettingActions';

import jsPsychInitEditor from '../../../components/Appbar/jsPsychInitEditor';

const setJsPsychInit = (dispatch, key, value) => {
	dispatch(experimentSettingActions.setJspyschInitAction(key, value));
}

const mapStateToProps = (state, ownProps) => {
	let jsPsychInit = state.experimentState.jsPsychInit;

	return {
		...jsPsychInit,
		min_width: jsPsychInit.exclusions.min_width,
		min_height: jsPsychInit.exclusions.min_height,
		audio: jsPsychInit.exclusions.audio,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	setJsPsychInit: (e, value, key) => { setJsPsychInit(dispatch, key, value); },
})

export default connect(mapStateToProps, mapDispatchToProps)(jsPsychInitEditor);
