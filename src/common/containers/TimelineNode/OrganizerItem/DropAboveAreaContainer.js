import { connect } from 'react-redux';
import DropAboveArea from '../../../components/TimelineNode/OrganizerItem/DropAboveArea';
import { moveNode, hoverNode } from './OrganizerItemContainer';

const mapStateToProps = (state, ownProps) => {
	let timelineNodeState = state.timelineNodeState;

	let node = timelineNodeState[ownProps.id];
	
	return {
		parent: node.parent,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	moveNode: (sourceId, targetId, up, dragType) => { moveNode(dispatch, sourceId, targetId, up, dragType); },
	hoverNode: (sourceId, targetId, dragType) => { hoverNode(dispatch, sourceId, targetId, dragType); }
})

export default connect(mapStateToProps, mapDispatchToProps)(DropAboveArea);
