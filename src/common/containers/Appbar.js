import { connect } from 'react-redux';
import { resizeTimelineOrganizerAction } from '../actions/mainViewActions';
import Appbar from '../components/Appbar';

const toggleTimelineOrganizerDrawer = (dispatch, ownProps) => {
	ownProps.toggleTimelineOrganizerCallback();
	dispatch((dispatch, getState) => {
		var interval = setInterval(() => {
			let current = getState().timelineOrganizerWidth;
			// we take the opposite as ownProps is not updated yet
			if (!ownProps.timelineOrganizerDrawerToggle) {
				if (current < 20) {
					dispatch(resizeTimelineOrganizerAction(current+2));
				} else {
					clear();
				}
			} else {
				if (current > 0) dispatch(resizeTimelineOrganizerAction(current-2));
				else clear();
			}
		}, 20);

		var clear = function() {
			clearInterval(interval);
		}
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	toggleTimelineOrganizerDrawer: () => { toggleTimelineOrganizerDrawer(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);