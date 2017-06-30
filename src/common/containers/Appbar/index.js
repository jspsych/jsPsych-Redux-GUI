import { connect } from 'react-redux';
import * as experimentSettingActions from '../../actions/experimentSettingActions';
import * as backendActions from '../../actions/backendActions';
import Appbar from '../../components/Appbar';
import { pushState } from '../../backend/dynamoDB';
import { convertEmptyStringToNull, convertNullToEmptyString } from '../../utils';

const changeExperimentName = (dispatch, text) => {
	text = convertEmptyStringToNull(text);
	dispatch(experimentSettingActions.setExperimentNameAction(text));
}

const save = (dispatch, feedback) => {
	dispatch((dispatch, getState) => {
		if (!getState().experimentState.anyChange) {
			feedback('Nothing has changed so far!', false);
			return;
		}
		dispatch(backendActions.clickSavePushAction());
		try {
			pushState(getState());
			feedback('Saved!', true);
		} catch(e) {
			feedback('Save failed!', false);
		}
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
	save: (feedback) => { save(dispatch, feedback); },
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);