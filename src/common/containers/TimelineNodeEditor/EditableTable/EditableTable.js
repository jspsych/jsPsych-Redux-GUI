import { connect } from 'react-redux';
import EditableTable from '../../../components/TimelineNodeEditor/EditableTable/EditableTable';
import * as tableActions from '../../../actions/tableAction';
import { convertEmptyStringToNull } from '../../../utils';

const onChangeHeader = (dispatch, headerId, newVal) => {
	dispatch(tableActions.changeHeaderAction(headerId, convertEmptyStringToNull(newVal)));
}

const onChangeCells = (dispatch, cellId, newVal) => {
	dispatch(tableActions.changeCellAction(cellId, convertEmptyStringToNull(newVal)));
}

export const onAddColumn = (dispatch, ownProps) => {
	dispatch(tableActions.addColumn(ownProps.id));
}

export const onAddRow = (dispatch, ownProps) => {
	dispatch(tableActions.addRow(ownProps.id));
}

const onChangeSampling = (dispatch, key, newVal) => {
	dispatch(tableActions.changeSampling(key, convertEmptyStringToNull(newVal)));
}

const onChangeSize = (dispatch, newVal) => {
	dispatch(tableActions.changeSize(convertEmptyStringToNull(newVal)));
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

	let tv = timeline.parameters.timeline_variables;
	let headers = Object.keys(tv[0]);
	let nullToString = []; 
	let object; 
	let newObj;

	//each object in the array
	for(let i=0; i<tv.length; i++){
		nullToString.push({});
		for(let j=0; j<headers.length; j++) {
			object = tv[i];
			if(!object[headers[j]]) {
				newObj = nullToString[i];
				newObj[headers[j]] = '';
				nullToString[i] = newObj;
			} else {
				newObj = nullToString[i];
				newObj[headers[j]] = object[headers[j]];
				nullToString[i] = newObj
			}
		}
	}

	return{
		timeline_variables: nullToString,
		randomize_order: timeline.parameters.randomize_order,
		samplingType: timeline.parameters.sampling.type,
		samplingSize: timeline.parameters.sampling.size
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleHeaderChange: (headerId, newVal) => { onChangeHeader(dispatch, headerId, newVal) },
	handleTableChange: (cellId, newVal) =>  { onChangeCells(dispatch, cellId, newVal) },
	handleAddColumn: (e) => { onAddColumn(dispatch, ownProps) },
	handleAddRow: (e) => { onAddRow(dispatch, ownProps) },
	onChange: (e, key, newVal) => { onChangeSampling(dispatch, key, newVal) },
	handleSampleSize: (newVal) => { onChangeSize(dispatch, newVal) },
	onToggle: (e, newBool) => { onChangeRandomize(dispatch, newBool) },
	onColumnDelete: (rowIndex, titleIndex) => { deleteColumn(dispatch, rowIndex, titleIndex) },
	onRowDelete: (rowIndex, titleIndex) => { deleteRow(dispatch, rowIndex, titleIndex) },
	onColumnDeleteByHeader: (titleIndex) => { deleteColumnByHeader(dispatch, titleIndex) }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditableTable);
