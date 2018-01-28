import { connect } from 'react-redux';
import App from '../components/App';


const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;

	let shouldOrganizerStayOpen = !!experimentState.previewId || experimentState.mainTimeline.length > 0;
	let shouldEditorStayOpen = !!experimentState.previewId;
	return {
		shouldOrganizerStayOpen: shouldOrganizerStayOpen,
		shouldEditorStayOpen: shouldEditorStayOpen
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	
})

export default connect(mapStateToProps, mapDispatchToProps)(App);