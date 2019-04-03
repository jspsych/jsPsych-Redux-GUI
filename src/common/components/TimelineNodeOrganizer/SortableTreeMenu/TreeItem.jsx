import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Collapse from '@material-ui/core/Collapse';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TrialIcon from '@material-ui/icons/code';
import TimelineIcon from '@material-ui/icons/FolderOutlined';

import { DropTarget, DragSource } from 'react-dnd';
import flow from 'lodash/flow';

import { moveToAction, moveIntoAction } from '../../../actions/organizerActions';
import TreeItemContainer from '../../../containers/TimelineNodeOrganizer/SortableTreeMenu/TreeItemContainer';

const styles = theme => ({
    selectedListItemText: {
        fontWeight: 600,
    },
    listItemText: {
    },
    focusVisible: {
        '&:focus': {
            backgroundColor: 'red'
        }
    },
    treeItemIconContainer: {
        width: '24px',
        height: '24px',
        margin: 0,
        padding: 0,
        marginLeft: '6px',
    },
    collapsedPart: {
        paddingLeft: INDENT,
    },
});

const INDENT = 32;

const treeNodeDnD = {
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
            const {id: overId, lastItem } = props;

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
                    props.dispatch(moveIntoAction(draggedId));
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

class TreeItem extends React.Component {
    static defaultProps = {
        isTimeline: false,
        isSelected: false,
        isEnabled: false,
        name: '',
        parent: '',
        collapsed: false,
        childrenById: [],
        id: '',
    };

    state = {
        anchorEl: null,
    };

    handleOpenMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleCloseMenu = () => {
        this.setState({ anchorEl: null });
    };

    closeMenuWrapper = (f) => () => {
        f();
        this.handleCloseMenu();
    }

    render() {
        const {
            connectDropTarget,
            connectDragPreview,
            connectDragSource,
            isDragging,

            classes,

            id,

            isTimeline,
            isEnabled,
            isSelected,
            name,
            collapsed,
            parent,
            childrenById,
        } = this.props;

        const { anchorEl } = this.state;

        const itemIcon = isTimeline ? <TimelineIcon /> : <TrialIcon />;

        const collapseIcon = !collapsed ? <ExpandMore /> : <ExpandLess />
        const menuOpened = Boolean(anchorEl);

        const deleteNode = this.closeMenuWrapper(
            isTimeline ? 
            this.props.deleteTimeline : 
            this.props.deleteTrial
        );
        const duplicateNode = this.closeMenuWrapper(
            isTimeline ? 
            this.props.duplicateTimeline : 
            this.props.duplicateTrial
        );
        const insertTimeline = isTimeline ? this.props.insertTimeline : this.props.insertTimelineAfterTrial;
        const insertTrial = isTimeline ? this.props.insertTrial : this.props.insertTrialAfterTrial;

        return connectDropTarget(
                <div>
                    <ListItem 
                        button
                        selected={isSelected}
                        className={treeNodeDnD.ITEM_TYPE}
                        onClick={(e) => {
                            if (e.nativeEvent.which === 1) {
                                this.props.onClick();
                            }
                        }}
                    >
                      { 
                        connectDragSource(
                            <div className={classes.treeItemIconContainer}>
                                <ListItemIcon>
                                    { itemIcon }
                                </ListItemIcon>
                            </div>
                      )}
                      <ListItemText 
                        inset 
                        primary={
                            connectDragPreview(
                                <div>
                                    {name}
                                </div>
                            )
                        }
                        classes={{
                            primary: isSelected ? classes.selectedListItemText : classes.listItemText
                        }}
                      />
                      <ListItemSecondaryAction>
                        {
                            isTimeline &&
                            <IconButton 
                                disabled={!childrenById.length}
                                aria-label="Expand Tree"
                                onClick={this.props.toggleCollapsed}
                            >
                              { collapseIcon }
                            </IconButton>
                        }
                        <IconButton 
                            aria-label="More Options"
                            aria-owns={menuOpened ? 'option-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleOpenMenu}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id="option-menu"
                          anchorEl={anchorEl}
                          open={menuOpened}
                          onClose={this.handleCloseMenu}
                        >
                            <MenuItem key="placeholder" style={{display: "none"}} />
                            <MenuItem onClick={duplicateNode}>
                              Duplicate
                            </MenuItem>
                            <MenuItem onClick={deleteNode}>
                              Delete
                            </MenuItem>
                        </Menu>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {
                        isTimeline &&
                        <Collapse 
                            in={!collapsed} 
                            timeout="auto" 
                            unmountOnExit
                            className={classes.collapsedPart}
                        >
                            <List component="div" disablePadding>
                                {
                                    childrenById &&
                                    childrenById.map((id, idx) => (
                                        <TreeItemContainer
                                            id={id}
                                            key={`tree-menu-key-${id}`}
                                        />
                                    ))
                                }
                            </List>
                        </Collapse>
                    }
                </div>
        )
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
        treeNodeDnD.targetCollector)
    )(
    withStyles(styles)(TreeItem)
    );


