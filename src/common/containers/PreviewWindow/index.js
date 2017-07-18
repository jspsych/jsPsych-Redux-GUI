import { connect } from 'react-redux';
// import * as experimentSettingActions from '../../actions/experimentSettingActions';
import PreviewWindow from '../../components/PreviewWindow';
import { generateCode } from '../../backend/deploy';

let code = "";

const playAll = (dispatch, load) => {
	dispatch((dispatch, getState) => {
		code = generateCode(getState().experimentState, true, false);
		load(code);
	})
}

const hotUpdate = (dispatch, load) => {
	dispatch((dispatch, getState) => {
		code = generateCode(getState().experimentState, false, false);
		load(code);
	})
}

const mapStateToProps = (state, ownProps) => {
	let experimentState = state.experimentState;
	return {
		state: experimentState,
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	playAll: (load) => { playAll(dispatch, load); },
	hotUpdate: (load) => { hotUpdate(dispatch, load); }
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewWindow);

