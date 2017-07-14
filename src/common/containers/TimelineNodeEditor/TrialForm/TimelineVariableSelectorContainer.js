import { connect } from 'react-redux';
import TimelineVariableSelector from '../../../components/TimelineNodeEditor/TrialForm/TimelineVariableSelector';
import * as trialFormActions from '../../../actions/trialFormActions';
import { convertEmptyStringToNull } from '../../../utils';


const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	if (!experimentState.previewId) return {

	};
	let trial = experimentState[experimentState.previewId];
	let hist = {}, timelineVariables = [];
	let timeline = (trial.parent) ? experimentState[trial.parent] : null;
	while (timeline) {
		for (let tobj of timeline.parameters.timeline_variables) {
			for (let name of Object.keys(tobj)) {
				if (!hist[name]) {
					hist[name] = true;
					timelineVariables.push(name);
				}
			}
		}
		timeline = experimentState[timeline.parent];
	}
	console.log(timelineVariables)
	return {
		timelineVariables: timelineVariables
	};
}

const mapDispatchToProps = (dispatch,ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineVariableSelector);
