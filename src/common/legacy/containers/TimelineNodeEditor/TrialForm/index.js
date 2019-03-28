import { connect } from 'react-redux';
import TrialForm from '../../../components/TimelineNodeEditor/TrialForm';
import * as editorActions from '../../../actions/editorActions';

const onChangePluginType = (dispatch, newPluginVal) => {
	dispatch(editorActions.onPluginTypeChange(newPluginVal));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	let trial = experimentState[experimentState.previewId];
	return {
		pluginType: trial.parameters.type,
	};
}

const mapDispatchToProps = (dispatch,ownProps) => ({
	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
