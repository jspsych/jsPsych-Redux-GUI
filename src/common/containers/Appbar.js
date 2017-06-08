import { connect } from 'react-redux';
import * as mainActions from '../actions/mainActions';
import Appbar from '../components/Appbar';

const changeExperimentName = (dispatch, text) => {
	dispatch(mainActions.setExperimentNameAction(text));
}

const mapStateToProps = (state, ownProps) => {
	return {
		experimentName: state.mainState.experimentName
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	changeExperimentName: (e, text) => { changeExperimentName(dispatch, text) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);