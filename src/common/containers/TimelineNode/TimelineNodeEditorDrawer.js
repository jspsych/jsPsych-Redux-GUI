import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import TimelineNodeEditorDrawer from '../../components/TimelineNode/TimelineNodeEditorDrawer';
import { isTimeline } from '../../reducers/timelineNodeUtils';

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	return {
		previewId: timelineNodeState.previewId
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeEditorDrawer);
