import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import OrganizerItem from '../../../components/TimelineNode/OrganizerItem';
import { isTimeline } from '../../../constants/utils';


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];
	return {
		isTimeline: isTimeline(node),
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerItem);
