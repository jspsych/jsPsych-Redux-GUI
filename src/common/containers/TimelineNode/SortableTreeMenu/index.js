import { connect } from 'react-redux';
import SortableTreeMenu from '../../../components/TimelineNode/SortableTreeMenu/SortableTreeMenu';
import { convertToNestedTree } from '../../../reducers/timelineNodeUtils';

// import * as timelineNodeActions from '../../../actions/timelineNodeActions';



const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	return {
		treeData: convertToNestedTree(timelineNodeState),
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SortableTreeMenu);
