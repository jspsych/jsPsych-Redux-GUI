// import { connect } from 'react-redux';
// import { isTimeline } from '../../reducers/timelineNodeUtils';
// import TimelineForm from '../../components/TimelineNode/TimelineForm';

// const mapStateToProps = (state, ownProps) => {
// 	let timelineNodeState = state.timelineNodeState;

// 	let timeline = timelineNodeState[timelineNodeState.previewId];

// 	if(timeline != null) {
// 		return {
// 			id: timeline.id,
// 			isTimeline: isTimeline(timeline),
// 		}
// 	} else {
// 		return {
// 		}
// 	}
// };

// const mapDispatchToProps = (dispatch,ownProps) => ({

// })

// export default connect(mapStateToProps, mapDispatchToProps)(TimelineForm);