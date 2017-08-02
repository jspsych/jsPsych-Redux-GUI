import { connect } from 'react-redux';
// import * as experimentSettingActions from '../../actions/experimentSettingActions';
import PreviewWindow from '../../components/PreviewWindow';
import { generateCode } from '../../backend/deploy';
import { isTimeline, isTrial } from '../../reducers/Experiment/utils';
import { deepCopy } from '../../utils';

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
	let obj = Object.assign({}, deepCopy(state.experimentState), { experimentName: null }); //ignore experiment name change
	for (let key of Object.keys(obj)) {
		if (obj[key] && (isTimeline(obj[key]) || isTrial(obj[key]))) {
			obj[key] = Object.assign({}, obj[key], { name: null }); //ignore name change
		}
	}

	return {
		state: obj
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	playAll: (load) => { playAll(dispatch, load); },
	hotUpdate: (load) => { hotUpdate(dispatch, load); }
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewWindow);

