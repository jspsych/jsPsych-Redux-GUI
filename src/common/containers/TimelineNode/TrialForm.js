// import { connect } from 'react-redux';
// import { isTrial } from '../../reducers/timelineNodeUtils';
// import TrialForm from '../../components/TimelineNode/TrialForm';
// import * as trialFormActions from '../../actions/trialFormActions';

// const onChangePluginType = (dispatch, newPluginVal) => {
// 	dispatch(trialFormActions.onPluginTypeChange(newPluginVal));
// }

// const onToggleParam = (dispatch, e, newVal) => {
// 	dispatch(trialFormActions.onToggleValue(e, newVal));
// }

// const onChangeTextParam = (dispatch, e, newVal) => {
// 	dispatch(trialFormActions.onParamTextChange(e, newVal));
// }

// const onChangeIntParam = (dispatch, e, newVal) => {
// 		dispatch(trialFormActions.onParamIntChange(e, newVal));
// }

// const onChangeFloatParam = (dispatch, e, newVal) => {
// 	dispatch(trialFormAction.onParamFloatChange(e, newVal));
// }

// const mapStateToProps = (state, ownProps) => {
// 	let timelineNodeState = state.timelineNodeState;

// 	let trial = timelineNodeState[timelineNodeState.previewId];
// 	console.log(trial);
// 	if(trial != null) {
// 	return {
// 		id: trial.id,
// 		isTrial: isTrial(trial),
// 		parameters: trial.parameters,
// 		pluginType: trial.pluginType,
// 		}
// 	} else {
// 		return {
// 		}
// 	}
// };

// const mapDispatchToProps = (dispatch,ownProps) => ({
// 	onChange: (newPluginVal) => { onChangePluginType(dispatch, newPluginVal) },
// 	onToggle: (e, newVal) => { onToggleParam(dispatch, e, newVal) },
// 	onChangeText: (e, newVal) => { onChangeTextParam(dispatch, e, newVal) },
// 	onChangeInt: (e, newVal) => { onChangeIntParam(dispatch, e, newVal) },
// 	onChangeFloat: (e, newVal) => { onChangeFloatParam(dispatch, e, newVal) },
// 	onChangeParamSelect: (key) => { onParamSelectChange(dispatch, key) },
// })

// export default connect(mapStateToProps, mapDispatchToProps)(TrialForm);
