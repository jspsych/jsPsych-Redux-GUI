import { connect } from 'react-redux';
import * as experimentSettingActions from '../../actions/experimentSettingActions';
import * as backendActions from '../../actions/backendActions';
import Appbar from '../../components/Appbar';
import { clickSavePush } from '../../backend/dynamoDB';
import { convertEmptyStringToNull, convertNullToEmptyString } from '../../utils';

const changeExperimentName = (dispatch, text) => {
	text = convertEmptyStringToNull(text);
	dispatch(experimentSettingActions.setExperimentNameAction(text));
}

const save = (dispatch) => {
	dispatch((dispatch, getState) => {
		if (!getState().experimentState.anyChange) {
			return;
		}
		dispatch(backendActions.clickSavePushAction());
		clickSavePush(getState());
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
		experimentName: convertNullToEmptyString(state.experimentState.experimentName),
		state: state
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	changeExperimentName: (e, text) => { changeExperimentName(dispatch, text); },
	save: () => { save(dispatch); },
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);