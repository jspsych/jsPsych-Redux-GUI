import React from 'react';
import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';

import CollapsedIcon from 'material-ui/svg-icons/navigation/chevron-right';
import ExpandedIcon from 'material-ui/svg-icons/navigation/expand-more';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import {
	cyan400 as highlightColor,
	green500 as checkColor,
	indigo500 as iconHighlightColor,
	grey300 as hoverColor,
	grey900 as normalColor,
} from 'material-ui/styles/colors';

import { DropTarget, DragSource } from 'react-dnd';
import flow from 'lodash/flow';

import Tree from '../../../containers/TimelineNodeOrganizer/SortableTreeMenu/TreeContainer';
import NestedContextMenus from './NestedContextMenus';
import { moveToAction, moveIntoAction } from '../../../actions/organizerActions';

export const INDENT = 32;

export const colorSelector = (hovered, isSelected) => {
	if (hovered)
		return null;

	if (isSelected)
		return highlightColor;

	return null;
}

export const treeNodeDnD = {
	ITEM_TYPE: "Organizer-Item",

	itemSource: {
		beginDrag(props) {
			return {
				id: props.id,
				parent: props.parent,
				children: props.children
			};
		},

		isDragging(props, monitor) {
			return props.id === monitor.getItem().id;
		}
	},

	itemTarget: {
		// better this way since we always want hover (for preview effects)
		canDrop() {
			return false;
		},

	  	hover(props, monitor, component) {
		  	const {id: draggedId } = monitor.getItem()
		    const {id: overId, lastItem } = props

		    // leave
		    // if parent dragged into its children (will check more in redux)
		    // or if source is not over current target
		    if (draggedId === props.parent ||       
		    	!monitor.isOver({shallow: true})) { 
		    	return;
			}

			// allow move into
			let offset = monitor.getDifferenceFromInitialOffset();
		    if (draggedId === overId) {
				if (offset.x >= INDENT && draggedId) {
					let action = moveIntoAction(draggedId);
					props.dispatch(action);
				}
				return;
			}

			let isLast = lastItem === draggedId;
			if (offset.x < 0 && !isLast) {
				return;
			}

			// replace
		    props.dispatch(moveToAction(draggedId, overId, isLast));
		}
	},

	sourceCollector: (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging(),
	}),

	targetCollector: (connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOverCurrent: monitor.isOver({
			shallow: true
		}),
	})
}

var keyboardFocusId = null;

export const setKeyboardFocusId = (id) => {
	keyboardFocusId = id;
}

export const getKeyboardFocusId = () => (keyboardFocusId);

class TimelineItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			contextMenuOpen: false,
			toggleContextMenuOpen: false,
		}

		this.openContextMenu = (event) => {
			event.preventDefault();
			event.stopPropagation();
			this.setState({
				contextMenuOpen: true,
				anchorEl: event.currentTarget, 
			})
		}

		this.closeContextMenu = () => {
			this.setState({
				contextMenuOpen: false
			})
		}

		this.openToggleContextMenu = (event) => {
			event.preventDefault();
			event.stopPropagation();
			this.setState({
				toggleContextMenuOpen: true,
				anchorEl: event.currentTarget, 
			})
		}

		this.closeToggleContextMenu = () => {
			this.setState({
				toggleContextMenuOpen: false
			})
		}
	}

	componentDidMount() {
		if (getKeyboardFocusId() === this.props.id) {
			this.refs[this.props.id].applyFocusState('keyboard-focused');
		}
	}

	render() {
		const {
			connectDropTarget,
			connectDragPreview,
			connectDragSource,
			isOverCurrent,
		} = this.props;

		return connectDragPreview(connectDropTarget(
				<div>
					<div className={treeNodeDnD.ITEM_TYPE} style={{
									display: 'flex',
									backgroundColor: colorSelector(isOverCurrent, this.props.isSelected),
								}}>
							{connectDragSource(<div>
								<IconButton className="Timeline-Collapse-Icon"
										hoveredStyle={{backgroundColor: hoverColor}}
										onTouchTap={this.props.toggleCollapsed} 
										disableTouchRipple={true} 
								>
								{(this.props.collapsed || this.props.hasNoChildren) ? 
									<CollapsedIcon color={(this.props.isSelected) ? iconHighlightColor : normalColor} /> : 
									<ExpandedIcon color={(this.props.isSelected) ? iconHighlightColor : normalColor} />
								}
							</IconButton>
							</div>)}
							<div style={{width: "100%"}}>
								<ListItem 
										ref={this.props.id}
										primaryText={this.props.name}
										onKeyDown={(e) => { this.props.listenKey(e, getKeyboardFocusId) }}
										onContextMenu={this.openContextMenu}
										onTouchTap={(e) => {
											if (e.nativeEvent.which === 1) {
												this.props.onClick(setKeyboardFocusId);
											}
										}}
										rightIconButton={
											<IconButton 
												onContextMenu={this.openToggleContextMenu}
												disableTouchRipple={true}
												onTouchTap={(e) => {
															if (e.nativeEvent.which === 1) {
																this.props.onToggle();
																}
															}} 
											>
											{(this.props.isEnabled) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
											</IconButton>
										}/>
							</div>
							<NestedContextMenus
								openItemMenu={this.state.contextMenuOpen}
								anchorEl={this.state.anchorEl}
								onRequestCloseItemMenu={this.closeContextMenu}
								insertTimeline={this.props.insertTimeline}
								insertTrial={this.props.insertTrial}
								deleteNode={this.props.deleteTimeline}
								duplicateNode={this.props.duplicateTimeline} 

								openToggleMenu={this.state.toggleContextMenuOpen}
								onRequestCloseToggleMenu={this.closeToggleContextMenu}
								toggleAll={this.props.toggleAll}
								untoggleAll={this.props.untoggleAll}
								toggleThisOnly={this.props.toggleThisOnly}
							/>
					</div>	
					<div style={{paddingLeft: INDENT}}>
						<Tree children={this.props.childrenById}
							  collapsed={this.props.collapsed}
							  openTimelineEditorCallback={this.props.openTimelineEditorCallback}
							  closeTimelineEditorCallback={this.props.closeTimelineEditorCallback} />
					</div>
				</div>
		))
	}
}

export default flow(
	DragSource(
		treeNodeDnD.ITEM_TYPE,
		treeNodeDnD.itemSource,
		treeNodeDnD.sourceCollector),
	DropTarget(
		treeNodeDnD.ITEM_TYPE,
		treeNodeDnD.itemTarget,
		treeNodeDnD.targetCollector))(TimelineItem);