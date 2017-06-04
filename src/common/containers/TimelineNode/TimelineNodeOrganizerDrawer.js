import { connect } from 'react-redux';
import { resizeTimelineOrganizerAction } from '../../actions/mainViewActions';
import TimelineNodeOrganizerDrawer from '../../components/TimelineNode/TimelineNodeOrganizerDrawer';

var position = 0;

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

const toggleTimelineOrganizerDrawer = (dispatch, ownProps) => {
	ownProps.toggleTimelineOrganizerCallback();
	dispatch((dispatch, getState) => {
		var interval = setInterval(() => {
			let current = getState().timelineOrganizerWidth;
			// we take the opposite as ownProps is not updated yet
			if (!ownProps.open) { // open
				if (current < 20) {
					dispatch(resizeTimelineOrganizerAction(current+2, true));
				} else {
					clear();
				}
			} else { // close
				if (current > 0) dispatch(resizeTimelineOrganizerAction(current-2, true));
				else clear();
			}
		}, 17);

		var clear = function() {
			clearInterval(interval);
		}
	});
}

const onDrag = (e, dispatch) => {
	let percent = (e.pageX / window.innerWidth) * 100;
	if (percent < 20) return;
	position = percent;
	dispatch(resizeTimelineOrganizerAction(position));
	pauseEvent(e);
}

const onDragEnd = (e, dispatch) => {

}

const onDragStart = (e, dispatch) => {

}

const mapStateToProps = (state, ownProps) => {
	return {
		width: state.timelineOrganizerWidth
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	onDragStart: (e) => { onDragStart(e, dispatch) },
	onDragEnd: (e) => { onDragEnd(e, dispatch) },
	onDrag: (e) => { onDrag(e, dispatch) },
	toggleTimelineOrganizerDrawer: () => { toggleTimelineOrganizerDrawer(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineNodeOrganizerDrawer);
