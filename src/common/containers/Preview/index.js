import { connect } from 'react-redux';
import Preview from '../../components/Preview';

import { generateInit } from '../../reducers/TimelineNode/preview';

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;
	let code = "";
	if (timelineNodeState.previewId) {
		code = generateInit(timelineNodeState, [timelineNodeState.previewId]);
	}
	
	return {
		code: code,
		liveEditting: timelineNodeState.liveEditting
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	
})

export default connect(mapStateToProps, mapDispatchToProps)(Preview);