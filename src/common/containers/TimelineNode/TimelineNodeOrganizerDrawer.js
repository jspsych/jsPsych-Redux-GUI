import { connect } from 'react-redux';
import { resizeTimelineOrganizerAction } from '../../actions/mainViewActions';
import TimelineNodeOrganizerDrawer from '../../components/TimelineNode/TimelineNodeOrganizerDrawer';

var dragging = false;

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

const openTimelineOrganizerDrawer = (dispatch, ownProps) => {
	dispatch(resizeTimelineOrganizerAction(20));
}

const closeTimelineOrganizerDrawer = (dispatch, ownProps) => {
	dispatch(resizeTimelineOrganizerAction(0, true))
}

const onDrag = (e, dispatch) => {
	let percent = (e.pageX / window.innerWidth) * 100;
	if (percent >= 20) dispatch(resizeTimelineOrganizerAction(percent));
	pauseEvent(e)
}

// placeholder
const onDragEnd = (e, dispatch) => {
	console.log('Stop dragging');
	dragging = false;
}
// placeholder
const onDragStart = (e, dispatch) => {
	console.log('Start dragging');
	dragging = true;
}

const mapStateToProps = (state, ownProps) => {
	return {
		width: state.timelineOrganizerWidth,
		animation: (dragging) ? 'none' : 'all 0.3s ease',
		open: state.timelineOrganizerWidth > 0,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onDragStart: (e) => { onDragStart(e, dispatch) },
	onDragEnd: (e) => { onDragEnd(e, dispatch) },
	onDrag: (e) => { onDrag(e, dispatch) },
	openTimelineOrganizerDrawer: () => { openTimelineOrganizerDrawer(dispatch, ownProps) },
	closeTimelineOrganizerDrawer: () => { closeTimelineOrganizerDrawer(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeOrganizerDrawer);
