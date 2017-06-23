import { connect } from 'react-redux';
import * as experimentSettingActions from '../../actions/experimentSettingActions';
import PreviewWindow from '../../components/PreviewWindow';

import { generateCode, Undefined } from '../../reducers/Experiment/preview';

const playAll = (dispatch) => {
	dispatch(experimentSettingActions.playAllAction());
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	let code = Undefined;
	if (experimentState.previewId || experimentState.previewAll) {
		code = generateCode(experimentState);
	} 

	return {
		code: code,
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	playAll: () => { playAll(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewWindow);

