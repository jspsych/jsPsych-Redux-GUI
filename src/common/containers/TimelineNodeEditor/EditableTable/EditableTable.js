import { connect } from 'react-redux';
import EditableTable from '../../../components/TimelineNodeEditor/EditableTable/EditableTable';
import { isTimeline } from '../../../reducers/TimelineNode/utils/index';
import * as tableActions from '../../../actions/tableAction';

const onChangeHeader = (dispatch, headerId, newVal) => {
	console.log("headerId " + headerId);
	console.log("newVal " + newVal);
	dispatch(tableActions.changeHeaderAction(headerId, newVal));
}

const onChangeCells = (dispatch, cellId, newVal) => {
	console.log('in editable table');
	console.log('cellId ' + cellId);
	console.log('value '  + newVal);
	dispatch(tableActions.changeCellAction(cellId, newVal));
}

const onAddColumn = (dispatch, ownProps) => {
	console.log(ownProps.id);
	dispatch(tableActions.addColumn(ownProps.id));
}

const onAddRow = (dispatch, ownProps) => {
	dispatch(tableActions.addRow(ownProps.id));
}

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;
	let timeline = timelineNodeState[timelineNodeState.previewId];
    console.log(timeline);
	return{
		timelineId: timeline.id,
		timeline_variable: timeline.timeline_variable,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleHeaderChange: (headerId, newVal) => { onChangeHeader(dispatch, headerId, newVal) },
	handleTableChange: (cellId, newVal) =>  { onChangeCells(dispatch, cellId, newVal) },
	onTouchTap: (e) => { onAddColumn(dispatch, ownProps) },
	handleAddRow: (e) => { onAddRow(dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(EditableTable);
