import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import Preview from '../../components/Preview';

import { generateCode, Undefined } from '../../reducers/TimelineNode/preview';

const playAll = (dispatch) => {
	dispatch(timelineNodeActions.playAllAction());
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;
	let code = Undefined;
	if (timelineNodeState.previewId || timelineNodeState.previewAll) {
		code = generateCode(timelineNodeState);
	}

	return {
		code: code,
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	playAll: () => { playAll(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Preview);

