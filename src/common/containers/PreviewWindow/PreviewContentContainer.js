import { connect } from 'react-redux';
import PreviewContent from '../../components/PreviewWindow/PreviewContent';

import { generateCode, Undefined } from '../../reducers/Experiment/preview';


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
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewContent);

