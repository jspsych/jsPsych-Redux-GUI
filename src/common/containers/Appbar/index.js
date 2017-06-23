import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import Appbar from '../../components/Appbar';

const changeExperimentName = (dispatch, text) => {
	dispatch(timelineNodeActions.setExperimentNameAction(text));
}

const mapStateToProps = (state, ownProps) => {
	return {
		experimentName: state.experimentState.experimentName
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	changeExperimentName: (e, text) => { changeExperimentName(dispatch, text) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);