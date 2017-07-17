import { connect } from 'react-redux';
import { isTrial } from '../../../reducers/Experiment/utils';
import TrialForm from '../../../components/TimelineNodeEditor/TrialForm';
import * as trialFormActions from '../../../actions/trialFormActions';
import { convertEmptyStringToNull } from '../../../utils';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(trialFormActions.onPluginTypeChange(newPluginVal));
}


const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	if (!experimentState.previewId) return {

	};
	let trial = experimentState[experimentState.previewId];
	return {
		pluginType: trial.parameters.type,
	};
}

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
