import { connect } from 'react-redux';
import TimelineVariableTable from '../../../components/TimelineNodeEditor/TimelineForm/TimelineVariableTable';
import * as editorActions from '../../../actions/editorActions';
import { notifyConfirmByDialog, notifyErrorByDialog } from '../../Notification';
import { GUI_INFO_IGNORE, TV_HEADER_INPUT_TYPE, TV_HEADER_ORDER } from '../../../reducers/Experiment/editor';


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

const setTable = (dispatch, table) => {
	dispatch(editorActions.setTimelineVariableAction(table));
}

const updateTimelineVariableInputType = (dispatch, name, inputType) => {
	dispatch(editorActions.updateTimelineVariableInputTypeAction(name, inputType))
}

const updateCell = (dispatch, colName, rowNum, valueObject) => {
	dispatch(editorActions.updateCellAction(colName, rowNum, valueObject))
}

function createDataGridRows(timelineVariable) {
	return timelineVariable.map((row) => {
		let strRow = {};
		for (let key of Object.keys(row)) {
			strRow[key] = (row[key] === null) ? "" : row[key];
		}
		return strRow;
	})
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	let timeline = experimentState[experimentState.previewId];
	return {
		id: timeline.id,
		rows: createDataGridRows(timeline.parameters.timeline_variables),
		// the table
		table: timeline.parameters.timeline_variables || [],
		timeline_variables: timeline.parameters.timeline_variables || [],
		// input type of each header
		inputType: timeline.parameters[GUI_INFO_IGNORE] && timeline.parameters[GUI_INFO_IGNORE][TV_HEADER_INPUT_TYPE],
		headers: timeline.parameters[GUI_INFO_IGNORE] && timeline.parameters[GUI_INFO_IGNORE][TV_HEADER_ORDER]
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	updateTimelineVariableInputType: (name, inputType) => { updateTimelineVariableInputType(dispatch, name, inputType); },
	updateCell: (colName, rowNum, valueObject) => { updateCell(dispatch, colName, rowNum, valueObject); },
	updateTimelineVariableName: (oldName, newName) => { updateTimelineVariableName(dispatch, oldName, newName); },
	addRow: (index=-1) => { addRow(dispatch, index); },
	addColumn: () => { addColumn(dispatch); },
	deleteRow: (index) => { deleteRow(dispatch, index); },
	deleteColumn: (index) => { deleteColumn(dispatch, index); },
	setTable: (table) => { setTable(dispatch, table); },
	notifyConfirm: (message, proceedCallback) => { notifyConfirmByDialog(dispatch, message, proceedCallback); },
	notifyError: (message) => { notifyErrorByDialog(dispatch, message); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineVariableTable);