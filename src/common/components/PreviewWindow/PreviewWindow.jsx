import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    previewWindowContainer: {
        width: '80%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewWindow: {
        width: '95%',
        height: '95%',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.14)',
        backgroundColor: '#fafafa',
    },
})

class PreviewWindow extends React.Component {
    render() {
      const { classes } = this.props;

      return (
        <div className={classes.previewWindowContainer}>
            <div className={classes.previewWindow} />
        </div>
      )

    }
}

PreviewWindow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PreviewWindow);
