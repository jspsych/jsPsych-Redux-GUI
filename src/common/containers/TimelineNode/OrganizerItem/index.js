import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import SortableTreeMenu from '../../../components/TimelineNode/OrganizerItem/SortableTreeMenu';

import { convertToNestedTree } from '../../../reducers/timelineNodeUtils';


const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	return {
		treeData: convertToNestedTree(timelineNodeState),
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SortableTreeMenu);
