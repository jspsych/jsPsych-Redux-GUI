import { connect } from 'react-redux';
import PreviewContent from '../../components/Preview/PreviewContent';

import { generateCode, Undefined } from '../../reducers/TimelineNode/preview';


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
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewContent);

