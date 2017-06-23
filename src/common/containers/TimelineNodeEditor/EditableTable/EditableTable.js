import { connect } from 'react-redux';
import EditableTable from '../../../components/TimelineNodeEditor/EditableTable/EditableTable';
import * as tableActions from '../../../actions/tableAction';

const onChangeHeader = (dispatch, headerId, newVal) => {
	dispatch(tableActions.changeHeaderAction(headerId, newVal));
}

const onChangeCells = (dispatch, cellId, newVal) => {
	dispatch(tableActions.changeCellAction(cellId, newVal));
}

const onAddColumn = (dispatch, ownProps, index) => {
	dispatch(tableActions.addColumn(ownProps.id, index));
}

const onAddRow = (dispatch, ownProps) => {
	dispatch(tableActions.addRow(ownProps.id));
}

const onChangeSampling = (dispatch, newVal) => {
	// console.log("newVal " + newVal);
	dispatch(tableActions.changeSampling(newVal));
}

const onChangeSize = (dispatch, newVal) => {
	dispatch(tableActions.changeSize(newVal));
}

const onChangeRandomize = (dispatch, newBool) => {
	dispatch(tableActions.changeBool(newBool));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;
	let timeline = timelineNodeState[timelineNodeState.previewId];
    // console.log(timeline);
	return{
		timelineId: timeline.id,
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
})

export default connect(mapStateToProps, mapDispatchToProps)(EditableTable);
