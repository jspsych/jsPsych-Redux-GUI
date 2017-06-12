import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../../actions/timelineNodeActions';
import PreviewTrialItem from '../../../../components/TimelineNode/OrganizerItem/Ghosts/PreviewTrialItem';


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let trial = timelineNodeState[ownProps.id];

	return {
		isSelected: ownProps.id === timelineNodeState.previewId,
		isEnabled: trial.enabled,
		name: trial.name,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewTrialItem);
