import { connect } from 'react-redux';
import * as experimentSettingActions from '../../actions/experimentSettingActions';
import Preview from '../../components/Preview';

import { generateCode, Undefined } from '../../reducers/Experiment/preview';

const playAll = (dispatch) => {
	dispatch(experimentSettingActions.playAllAction());
}

const mapStateToProps = (state, ownProps) => {
	return {
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	playAll: () => { playAll(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Preview);

