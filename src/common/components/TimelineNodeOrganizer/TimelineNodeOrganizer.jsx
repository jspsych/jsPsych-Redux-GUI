import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TrialIcon from '@material-ui/icons/DescriptionOutlined';
import TimelineIcon from '@material-ui/icons/FolderOutlined';

import SortableTreeMenu from '../../containers/TimelineNodeOrganizer/SortableTreeMenu';

const styles = theme => ({
  timelineNodeOrganizer: {
    width: '25%',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRight: 'solid 1.2px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  fab: {
    position: 'relative',
    top: '-20px',
    left: '30px',
    zIndex: 1200,
    backgroundColor: '#009688',
    width: '36px',
    height: '36px',
    color: '#ffffff'
  },
})


class TimelineNodeOrganizer extends React.Component {
    state = {
      anchorEl: null,
    };

    handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
      this.setState({ anchorEl: null });
    };

    menuCloseWrapper = (f) => () => {
      f();
      this.handleClose()
    }

    render() {
      const { 
        classes, 
        theme,
      } = this.props;
      const { anchorEl } = this.state;

      return (
        <div className={classes.timelineNodeOrganizer}>
          <Fab 
            aria-label="Add" 
            className={classes.fab}
            aria-owns={anchorEl ? 'add-node-menu' : undefined}
            onClick={this.handleClick}
          >
            <AddIcon />
          </Fab>
          <Menu
            id="add-node-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem key="placeholder" style={{display: "none"}} />
            <MenuItem onClick={this.menuCloseWrapper(this.props.insertTrial)}>
              <ListItemIcon>
                <TrialIcon />
              </ListItemIcon>
              <ListItemText inset primary="Trial" />
            </MenuItem>
            <MenuItem onClick={this.menuCloseWrapper(this.props.insertTimeline)}>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText inset primary="Timeline" />
            </MenuItem>
          </Menu>

          <SortableTreeMenu key="sortable-tree" />
        </div>
      )

    }
}

TimelineNodeOrganizer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withTheme()(TimelineNodeOrganizer));
