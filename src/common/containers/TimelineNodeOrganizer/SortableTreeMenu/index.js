import { connect } from 'react-redux';
import SortableTreeMenu from '../../../components/TimelineNodeOrganizer/SortableTreeMenu';


const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	return {
		children: experimentState.mainTimeline,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SortableTreeMenu);
