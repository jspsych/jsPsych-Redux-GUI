import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { capitalize } from '@material-ui/core/utils/helpers';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';


const styles = theme => ({
  timelineNodeOrganizer: {
    width: '300px',
    height: '100%',
    backgroundColor: '#ffffff',
    borderRight: 'solid 1.2px rgba(0, 0, 0, 0.12)'
  },
  speedDial: {
    position: 'absolute',
    top: '31px',
    left: '30px',
    zIndex: 1200,
  },
  speedDialButton: {
    backgroundColor: '#009688',
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundColor: '#009688',
    },
    '&:focus': {
      backgroundColor: '#009688',
    }
  }
})

class TimelineNodeOrganizer extends React.Component {
    state = {
      open: false,
    };

    handleClick = () => {
      this.setState(state => ({
        open: !state.open,
      }));
    };

    handleOpen = () => {
      this.setState({
        open: true,
      });
    };

    handleClose = () => {
      this.setState({
        open: false,
      });
    };

    render() {
      const { classes } = this.props;
      const { open } = this.state;

      const speedDialClassName = classNames(
        classes.speedDial,
      );

      return (
        <div className={classes.timelineNodeOrganizer}>
          <SpeedDial
            classes={{
              fab: classes.speedDialButton
            }}
            ariaLabel="SpeedDial example"
            className={speedDialClassName}
            icon={<SpeedDialIcon />}
            onClick={this.handleClick}
            onClose={this.handleClose}
            open={open}
          >
            
          </SpeedDial>
        </div>
      )

    }
}

TimelineNodeOrganizer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimelineNodeOrganizer);
