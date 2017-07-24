import { connect } from 'react-redux';
import TimelineVariableTable, {
	createDataGridRows
} from '../../../components/TimelineNodeEditor/TimelineForm/TimelineVariableTable';
import * as editorActions from '../../../actions/editorActions';

const updateTimelineVariableRow = (dispatch, fromRow, toRow, updated) => {
	dispatch(editorActions.updateTimelineVariableRowAction(fromRow, toRow, updated));
}

const setParamMode = (dispatch, row, col) => {
	dispatch(editorActions.updateTimelineVariableCellAction(row, col, true));
}

const setCode = (dispatch, row, col, code) => {
	dispatch(editorActions.updateTimelineVariableCellAction(row, col, false, code));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	
	let timeline = experimentState[experimentState.previewId];
	return {
		id: timeline.id,
		rows: createDataGridRows(timeline.parameters.timeline_variables),
		timeline_variables: timeline.parameters.timeline_variables,
		repetitions: timeline.parameters.repetitions,
		samplingType: timeline.parameters.sample.type,
		samplingSize: timeline.parameters.sample.size
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	updateTimelineVariableRow: (fromRow, toRow, updated) => { updateTimelineVariableRow(dispatch, fromRow, toRow, updated); },
	setParamMode: (row, col) => { setParamMode(dispatch, row, col); },
	setCode: (row, col, code) => { setCode(dispatch, row, col, code); }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineVariableTable);