import { connect } from 'react-redux';
import TimelineVariableTable from '../../../components/TimelineNodeEditor/TimelineForm/TimelineVariableTable';
import * as editorActions from '../../../actions/editorActions';
import { notifyConfirmByDialog, notifyErrorByDialog, notifyWarningBySnackbar } from '../../Notification';
import { GuiIgonoredInfoEnum } from '../../../reducers/Experiment/editor';


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

const updateTimelineVariableInputType = (dispatch, name, inputType, typeCoercion) => {
	dispatch(editorActions.updateTimelineVariableInputTypeAction(name, inputType, typeCoercion))
}

const updateCell = (dispatch, colName, rowNum, valueObject) => {
	dispatch(editorActions.updateCellAction(colName, rowNum, valueObject))
}

const moveTo = (dispatch, sourceIndex, targetIndex) => {
	dispatch(editorActions.moveRowToAction(sourceIndex, targetIndex))
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState,
		timeline = experimentState[experimentState.previewId],
		parameters = timeline.parameters;
	return {
		id: timeline.id,
		// the whole gui info
		parameters: parameters,
		// the table
		table: timeline.parameters.timeline_variables || [],
		// input type of each header
		inputType: parameters[GuiIgonoredInfoEnum.root] && parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderInputType],
		headers: parameters[GuiIgonoredInfoEnum.root] && parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVHeaderOrder],
		rowIds: parameters[GuiIgonoredInfoEnum.root] && parameters[GuiIgonoredInfoEnum.root][GuiIgonoredInfoEnum.TVRowIds],
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	updateTimelineVariableInputType: (name, inputType, typeCoercion) => { updateTimelineVariableInputType(dispatch, name, inputType, typeCoercion); },
	updateCell: (colName, rowNum, valueObject) => { updateCell(dispatch, colName, rowNum, valueObject); },
	updateTimelineVariableName: (oldName, newName) => { updateTimelineVariableName(dispatch, oldName, newName); },
	addRow: (index=-1) => { addRow(dispatch, index); },
	addColumn: () => { addColumn(dispatch); },
	deleteRow: (index) => { deleteRow(dispatch, index); },
	deleteColumn: (index) => { deleteColumn(dispatch, index); },
	setTable: (table) => { setTable(dispatch, table); },
	notifyConfirm: (message, proceedCallback) => { notifyConfirmByDialog(dispatch, message, proceedCallback); },
	notifyError: (message) => { notifyErrorByDialog(dispatch, message); },
	notifyWarningBySnackbar: (message) => { notifyWarningBySnackbar(dispatch, message); },
	moveTo: (sourceIndex, targetIndex) => { moveTo(dispatch, sourceIndex, targetIndex); },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineVariableTable);