import { connect } from 'react-redux';
import { getHeaderId, getRowId } from '../../../reducers/timelineNodeUtils';
import Column from '../../../components/TimelineNode/EditableTable/Columns';
import tableActions from '../../../actions/tableActions';

const onTitle = (dispatch, ownProps, input) => {
	dispatch(tableActions.changeHeaderAction(ownProps.id, input));
}

const mapStateToProps = (state, ownProps) => {
	let headerId = getHeaderId();
	let rowId = getRowId();
	return {
		headerId: headerId
		rowId: rowId
	}
};

const mapDispatchToProps = (dispatch,ownProps) => ({
	onInputTitle: (input) => { onTitle(dispatch, ownProps, input) },
})