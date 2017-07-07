import { connect } from 'react-redux';
// import * as experimentSettingActions from '../../actions/experimentSettingActions';
import PreviewWindow from '../../components/PreviewWindow';

import { generateCode, Undefined } from '../../reducers/Experiment/preview';

let code = "";

const playAll = (dispatch, load) => {
	dispatch((dispatch, getState) => {
		code = generateCode(getState().experimentState, true, false);
		load(code);
	})
}

const hotUpdate = (dispatch, load) => {
	dispatch((dispatch, getState) => {
		code = generateCode(getState().experimentState);
		load(code);
	})
}

const mapStateToProps = (state, ownProps) => {
	return {
		code: code,
		id: state.experimentState.experimentId
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	playAll: (load) => { playAll(dispatch, load); },
	hotUpdate: (load) => { hotUpdate(dispatch, load); }
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewWindow);

