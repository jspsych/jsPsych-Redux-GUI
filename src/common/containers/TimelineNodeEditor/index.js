import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import TimelineNodeEditor from '../../components/TimelineNodeEditor';
import { isTimeline } from '../../reducers/TimelineNode/utils';

const changeNodeName = (name, dispatch) => {
	dispatch(timelineNodeActions.setNameAction(name));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[timelineNodeState.previewId];
	if (!node) return {
		previewId: null,
	};

	return {
		previewId: timelineNodeState.previewId,
		pluginType: node.pluginType,
		nodeName: node.name,
		label: ((isTimeline(node)) ? "Timeline" : "Trial") + " Name"
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	changeNodeName: (e, name) => { changeNodeName(name, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeEditor);
