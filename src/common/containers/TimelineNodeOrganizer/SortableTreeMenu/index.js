import { connect } from 'react-redux';
import * as organizerActions from '../../../actions/organizerActions';
import SortableTreeMenu from '../../../components/TimelineNodeOrganizer/SortableTreeMenu';


const listenKey = (e, dispatch, ownProps) => {
    e.preventDefault();
    if (e.which >= 37 && 
         e.which <= 40) {
        dispatch(organizerActions.moveByKeyboardAction(e.which));
    }
}


const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	return {
		children: experimentState.mainTimeline,
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
    listenKey: (e) => { listenKey(e, dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(SortableTreeMenu);
