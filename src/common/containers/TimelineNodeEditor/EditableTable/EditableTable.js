import { connect } from 'react-redux';
import EditableTable from '../../../components/TimelineNodeEditor/EditableTable/EditableTable';
import * as tableActions from '../../../actions/tableAction';

const onChangeHeader = (dispatch, headerId, newVal) => {
	dispatch(tableActions.changeHeaderAction(headerId, newVal));
}

const onChangeCells = (dispatch, cellId, newVal) => {
	dispatch(tableActions.changeCellAction(cellId, newVal));
}

export const onAddColumn = (dispatch, ownProps) => {
	dispatch(tableActions.addColumn(ownProps.id));
}

export const onAddRow = (dispatch, ownProps) => {
	dispatch(tableActions.addRow(ownProps.id));
}

const onChangeSampling = (dispatch, newVal) => {
	dispatch(tableActions.changeSampling(newVal));
}

const onChangeSize = (dispatch, newVal) => {
	dispatch(tableActions.changeSize(newVal));
}

const onChangeRandomize = (dispatch, newBool) => {
	dispatch(tableActions.changeBool(newBool));
}

const deleteColumn = (dispatch, rowIndex, titleIndex) => {
		dispatch(tableActions.columnDelete(rowIndex, titleIndex));
}

const deleteRow = (dispatch, rowIndex, titleIndex) => {
		dispatch(tableActions.rowDelete(rowIndex, titleIndex));
}

const deleteColumnByHeader = (dispatch, titleIndex) => {
	dispatch(tableActions.columnHeaderDelete(titleIndex));
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	let timeline = experimentState[experimentState.previewId];
	return{
		timeline_variables: timeline.parameters.timeline_variables,
		randomize_order: timeline.parameters.randomize_order,
		sampling: timeline.parameters.sampling,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleHeaderChange: (headerId, newVal) => { onChangeHeader(dispatch, headerId, newVal) },
	handleTableChange: (cellId, newVal) =>  { onChangeCells(dispatch, cellId, newVal) },
	handleAddColumn: (e) => { onAddColumn(dispatch, ownProps) },
	handleAddRow: (e) => { onAddRow(dispatch, ownProps) },
	onChange: (e, key, newVal) => { onChangeSampling(dispatch, newVal) },
	handleSampleSize: (newVal) => { onChangeSize(dispatch, newVal) },
	onToggle: (e, newBool) => { onChangeRandomize(dispatch, newBool) },
	onColumnDelete: (rowIndex, titleIndex) => { deleteColumn(dispatch, rowIndex, titleIndex) },
	onRowDelete: (rowIndex, titleIndex) => { deleteRow(dispatch, rowIndex, titleIndex) },
	onColumnDeleteByHeader: (titleIndex) => { deleteColumnByHeader(dispatch, titleIndex) }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditableTable);
