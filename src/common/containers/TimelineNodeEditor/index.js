import { connect } from 'react-redux';
import * as organizerActions from '../../actions/organizerActions';
import TimelineNodeEditor from '../../components/TimelineNodeEditor';
import { isTimeline } from '../../reducers/Experiment/utils';
import * as editorActions from '../../actions/editorActions';


const changeNodeName = (name, dispatch) => {
	dispatch(organizerActions.setNameAction(name));
}

const changePlugin = (dispatch, newPluginVal) => {
	dispatch(editorActions.onPluginTypeChange(newPluginVal));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let node = experimentState[experimentState.previewId];
	if (!node) {
		return {
			previewId: null,
			nodeName: "",
			label: ""
		};
	}
	
	return {
		previewId: experimentState.previewId,
		pluginType: node.parameters.type,
		nodeName: node.name,
		isTimeline: isTimeline(node),
		// label: ((isTimeline(node)) ? "Timeline" : "Trial") + " Name"
		label: "",
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	changeNodeName: (e, name) => { changeNodeName(name, dispatch) },
	changePlugin: (newPluginVal) => { changePlugin(dispatch, newPluginVal); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeEditor);
