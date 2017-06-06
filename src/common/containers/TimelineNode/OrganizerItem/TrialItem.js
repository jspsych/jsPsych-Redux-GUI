import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import TrialItem from '../../../components/TimelineNode/OrganizerItem/TrialItem';

const onPreview = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.onPreviewAction(ownProps.id));
}

const onToggle = (dispatch, ownProps) => {
	dispatch(timelineNodeActions.onToggleAction(ownProps.id));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let trial = timelineNodeState[ownProps.id];
	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: trial.enabled,
		level: trial.level(timelineNodeState),
		name: trial.name
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onClick: () => { onPreview(dispatch, ownProps) },
	onToggle: () => { onToggle(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialItem);
