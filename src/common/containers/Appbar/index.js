import { connect } from 'react-redux';
import * as experimentSettingActions from '../../actions/experimentSettingActions';
import Appbar from '../../components/Appbar';

const changeExperimentName = (dispatch, text) => {
	dispatch(experimentSettingActions.setExperimentNameAction(text));
}

const mapStateToProps = (state, ownProps) => {
	return {
		experimentName: state.experimentState.experimentName,
		state: state
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	changeExperimentName: (e, text) => { changeExperimentName(dispatch, text) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);