import { connect } from 'react-redux';
import * as timelineNodeActions from '../../../actions/timelineNodeActions';
import Tree from '../../../components/TimelineNode/OrganizerItem/Tree';


const mapStateToProps = (state, ownProps) => {
	return {
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
