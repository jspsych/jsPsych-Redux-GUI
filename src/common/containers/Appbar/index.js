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
		pushState(getState()).then(() => { 
			feedback('Saved!', true); 
		}).catch((e) => {
			feedback('Save failed!', false);
		});
	});
}

const newExperiment = (dispatch) => {
	dispatch((dispatch ,getState) => {
		dispatch(backendActions.newExperimentAction());
		// pushState(getState());
	});
}

const saveAs = (dispatch, newName) => {
	dispatch((dispatch, getState) => {
		dispatch(backendActions.saveAsAction(newName));
		pushState(getState());
	});
}

const mapStateToProps = (state, ownProps) => {
	return {
		experimentName: convertNullToEmptyString(state.experimentState.experimentName),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	changeExperimentName: (e, text) => { changeExperimentName(dispatch, text); },
	save: (feedback) => { save(dispatch, feedback); },
	newExperiment: () => { newExperiment(dispatch); },
	saveAs: (newName) => { saveAs(dispatch, newName); }
})

export default connect(mapStateToProps, mapDispatchToProps)(Appbar);