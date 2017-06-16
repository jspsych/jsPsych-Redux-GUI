import { connect } from 'react-redux';
import Tree from '../../../components/TimelineNodeOrganizer/SortableTreeMenu/Tree';

const mapStateToProps = (state, ownProps) => {
	return {
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
