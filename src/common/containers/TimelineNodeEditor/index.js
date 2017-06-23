import { connect } from 'react-redux';
import * as organizerActions from '../../actions/organizerActions';
import TimelineNodeEditor from '../../components/TimelineNodeEditor';
import { isTimeline } from '../../reducers/Experiment/utils';

const changeNodeName = (name, dispatch) => {
	dispatch(organizerActions.setNameAction(name));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let node = experimentState[experimentState.previewId];
	if (!node) return {
		previewId: null,
	};

	return {
		previewId: experimentState.previewId,
		pluginType: node.parameters.type,
		nodeName: node.name,
		label: ((isTimeline(node)) ? "Timeline" : "Trial") + " Name"
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	changeNodeName: (e, name) => { changeNodeName(name, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeEditor);
