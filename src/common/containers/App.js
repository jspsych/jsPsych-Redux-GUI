import { connect } from 'react-redux';
import { resizeTimelineOrganizerAction } from '../actions/mainViewActions';
import App from '../components/App';

const convertPercent = (number) => (number + '%'); 

const mapStateToProps = (state, ownProps) => {
	return {
		width: convertPercent(state.mainBodyWidth)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	
})

export default connect(mapStateToProps, mapDispatchToProps)(App);