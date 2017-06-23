import { connect } from 'react-redux';
import * as timelineNodeActions from '../../actions/timelineNodeActions';
import Preview from '../../components/Preview';

import { generateCode, Undefined } from '../../reducers/TimelineNode/preview';

const playAll = (dispatch) => {
	dispatch(timelineNodeActions.playAllAction());
}

const mapStateToProps = (state, ownProps) => {
	return {
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	playAll: () => { playAll(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Preview);

