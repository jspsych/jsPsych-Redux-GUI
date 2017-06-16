import { connect } from 'react-redux';
import SortableTreeMenu from '../../../components/TimelineNodeOrganizer/SortableTreeMenu';

// import * as timelineNodeActions from '../../../actions/timelineNodeActions';



const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	return {
		children: timelineNodeState.mainTimeline,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SortableTreeMenu);
