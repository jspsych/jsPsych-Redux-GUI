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

const updateTimelineVariableName = (dispatch, oldName, newName) => {
	dispatch(editorActions.updateTimelineVariableNameAction(oldName, newName));
}

const addRow = (dispatch, index) => {
	dispatch(editorActions.addTimelineVariableRowAction(index));
}

const addColumn = (dispatch) => {
	dispatch(editorActions.addTimelineVariableColumnAction());
}

const deleteRow = (dispatch, index) => {
	dispatch(editorActions.deleteTimelineVariableRowAction(index));
}

const deleteColumn = (dispatch, index) => {
	dispatch(editorActions.deleteTimelineVariableColumnAction(index));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	
	let timeline = experimentState[experimentState.previewId];
	return {
		id: timeline.id,
		rows: createDataGridRows(timeline.parameters.timeline_variables),
		timeline_variables: timeline.parameters.timeline_variables
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	updateTimelineVariableRow: (fromRow, toRow, updated) => { updateTimelineVariableRow(dispatch, fromRow, toRow, updated); },
	setParamMode: (row, col) => { setParamMode(dispatch, row, col); },
	setCode: (row, col, code) => { setCode(dispatch, row, col, code); },
	updateTimelineVariableName: (oldName, newName) => { updateTimelineVariableName(dispatch, oldName, newName); },
	addRow: (index=-1) => { addRow(dispatch, index); },
	addColumn: () => { addColumn(dispatch); },
	deleteRow: (index) => { deleteRow(dispatch, index); },
	deleteColumn: (index) => { deleteColumn(dispatch, index); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineVariableTable);