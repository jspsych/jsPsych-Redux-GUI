import { connect } from 'react-redux';
import * as organizerActions from '../../../actions/organizerActions';
import TimelineItem from '../../../components/TimelineNodeOrganizer/SortableTreeMenu/TreeItem.jsx';
import { isTimeline } from '../../../reducers/Experiment/utils';

const onPreview = (dispatch, ownProps) => {
    dispatch((dispatch, getState) => {
        let experimentState = getState().experimentState;
        let previewId = experimentState.previewId;
        if (previewId === null || previewId !== ownProps.id) {
            dispatch(organizerActions.onPreviewAction(ownProps.id));
            // ownProps.openTimelineEditorCallback();
        } else {
            dispatch(organizerActions.onPreviewAction(null));
            // ownProps.closeTimelineEditorCallback();
        }
    })
}

const onToggle = (dispatch, ownProps) => {
    dispatch(organizerActions.onToggleAction(ownProps.id));
}

const toggleCollapsed = (dispatch, ownProps) => {
    dispatch(organizerActions.setCollapsed(ownProps.id));
}

const insertTimeline = (dispatch, ownProps) => {
    dispatch(organizerActions.addTimelineAction(ownProps.id));
}

const insertTrial = (dispatch, ownProps) => {
    dispatch(organizerActions.addTrialAction(ownProps.id));
}

const deleteTimeline = (dispatch, ownProps) => {
    dispatch(organizerActions.deleteTimelineAction(ownProps.id));
}

const duplicateTimeline = (dispatch, ownProps) => {
    dispatch(organizerActions.duplicateTimelineAction(ownProps.id));
}

// from trial container
const deleteTrial = (dispatch, ownProps) => {
    dispatch(organizerActions.deleteTrialAction(ownProps.id));
}

const duplicateTrial = (dispatch, ownProps) => {
    dispatch(organizerActions.duplicateTrialAction(ownProps.id));
}

const insertTimelineAfterTrial = (dispatch, ownProps) => {
    dispatch(organizerActions.insertNodeAfterTrialAction(ownProps.id, true));
}

const insertTrialAfterTrial = (dispatch, ownProps) => {
    dispatch(organizerActions.insertNodeAfterTrialAction(ownProps.id, false));
}

const mapStateToProps = (state, ownProps) => {
    let experimentState = state.experimentState;

    let node = experimentState[ownProps.id];
    let isTimelineNode = isTimeline(node);
    let lastItem = !isTimelineNode ? null : (
       (node.childrenById.length > 0) ? 
       node.childrenById[node.childrenById.length-1] : 
       null 
    );
    return {
        isSelected: ownProps.id === experimentState.previewId,
        isEnabled: node.enabled,
        name: node.name,
        collapsed: isTimelineNode ? node.collapsed : true,
        childrenById: isTimelineNode ? node.childrenById : [],
        parent: node.parent,
        isTimeline: isTimelineNode,
        lastItem,
    }
};


const mapDispatchToProps = (dispatch, ownProps) => ({
    dispatch,
    onClick: () => { onPreview(dispatch, ownProps) },
    onToggle: () => { onToggle(dispatch, ownProps) },
    toggleCollapsed: () => { toggleCollapsed(dispatch, ownProps) },
    insertTimeline: () => { insertTimeline(dispatch, ownProps)},
    insertTrial: () => { insertTrial(dispatch, ownProps)},
    deleteTimeline: () => { deleteTimeline(dispatch, ownProps)},
    duplicateTimeline: () => { duplicateTimeline(dispatch, ownProps) },
    deleteTrial: () => { deleteTrial(dispatch, ownProps)},
    duplicateTrial: () => { duplicateTrial(dispatch, ownProps) },
    insertTimelineAfterTrial: () => { insertTimelineAfterTrial(dispatch, ownProps)},
    insertTrialAfterTrial: () => { insertTrialAfterTrial(dispatch, ownProps)},
})

export default connect(mapStateToProps, mapDispatchToProps)(TimelineItem);
