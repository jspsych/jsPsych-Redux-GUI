import { connect } from 'react-redux';
import Tree from '../../../components/TimelineNode/SortableTreeMenu/Tree';
// import * as timelineNodeActions from '../../../actions/timelineNodeActions';

const mapStateToProps = (state, ownProps) => {
	return {
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
