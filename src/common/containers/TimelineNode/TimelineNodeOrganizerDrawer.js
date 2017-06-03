import { connect } from 'react-redux';
import { resizeTimelineOrganizerAction } from '../../actions/mainViewActions';
import TimelineNodeOrganizerDrawer from '../../components/TimelineNode/TimelineNodeOrganizerDrawer';

const convertPercent = (number) => (number + '%'); 

var dragging = false;

const mapStateToProps = (state, ownProps) => {
	return {
		width: convertPercent(state.timelineOrganizerWidth),
	}
};

const onDrag = (e, dispatch) => {
	e.preventDefault();
	dragging = true;
	dispatch(resizeTimelineOrganizerAction((e.pageX / window.innerWidth) * 100));
}

const onDragEnd = (e, dispatch) => {
	e.preventDefault();
	dispatch(resizeTimelineOrganizerAction((e.pageX / window.innerWidth) * 100));
	dragging = false;
}


const mapDispatchToProps = (dispatch, ownProps) => ({
	onDragEnd: (e) => { onDragEnd(e, dispatch) },
	onDrag: (e) => { onDrag(e, dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeOrganizerDrawer);
