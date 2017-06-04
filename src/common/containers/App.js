import { connect } from 'react-redux';
import { resizeTimelineOrganizerAction } from '../actions/mainViewActions';
import App from '../components/App';


const mapStateToProps = (state, ownProps) => {
	return {
		width: state.mainBodyWidth
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	
})

export default connect(mapStateToProps, mapDispatchToProps)(App);