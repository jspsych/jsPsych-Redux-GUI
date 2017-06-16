import { connect } from 'react-redux';
import * as jsPsychInitActions from '../../actions/jsPsychInitActions';
import jsPsychInitEditor from '../../components/Appbar/jsPsychInitEditor';


const mapStateToProps = (state, ownProps) => {
	return {
		
	};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(jsPsychInitEditor);