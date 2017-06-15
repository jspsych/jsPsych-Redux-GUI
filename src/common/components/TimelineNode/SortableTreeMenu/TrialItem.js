import React from 'react';

import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 
import TrialIcon from 'material-ui/svg-icons/editor/mode-edit';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import {
	grey400 as normalColor,
	indigo500 as iconHighlightColor,
	green500 as checkColor,
	grey300 as hoverColor,
} from 'material-ui/styles/colors';

import { DropTarget, DragSource } from 'react-dnd';
import flow from 'lodash/flow';
import {
	colorSelector,
	treeNodeDnD,
	setKeyboardFocusId,
	getKeyboardFocusId
} from './TimelineItem';

import NestedContextMenus from './NestedContextMenus';


class TrialItem extends React.Component {
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
			isOverCurrent
		} = this.props;
		
		return connectDragPreview(connectDropTarget(
			<div>
			<MuiThemeProvider>
			<div>
				<div className={treeNodeDnD.ITEM_TYPE} style={{
						display:'flex', 
						backgroundColor: colorSelector(isOverCurrent, this.props.isSelected),
					}} >
					{connectDragSource(<div className="Drag-Handle">
						<IconButton 
							hoveredStyle={{backgroundColor: hoverColor}}
							disableTouchRipple={true} 
							onTouchTap={this.props.onClick}>
							<TrialIcon color={(this.props.isSelected) ? iconHighlightColor : normalColor}/>
						</IconButton>
					</div>)}
					<div style={{width: "100%"}} >
						<ListItem  
							ref={this.props.id}
							primaryText={this.props.name}
							onKeyDown={this.props.listenKey}
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
								</IconButton>}
						/>
					</div>
						<NestedContextMenus
								openItemMenu={this.state.contextMenuOpen}
								anchorEl={this.state.anchorEl}
								onRequestCloseItemMenu={this.closeContextMenu}
								insertTimeline={this.props.insertTimeline}
								insertTrial={this.props.insertTrial}
								deleteNode={this.props.deleteTrial}
								duplicateNode={this.props.duplicateTrial} 

								openToggleMenu={this.state.toggleContextMenuOpen}
								onRequestCloseToggleMenu={this.closeToggleContextMenu}
								toggleAll={this.props.toggleAll}
								untoggleAll={this.props.untoggleAll}
								toggleThisOnly={this.props.toggleThisOnly}
							/>
					</div>
				</div>
			</MuiThemeProvider>
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
		treeNodeDnD.targetCollector))(TrialItem)