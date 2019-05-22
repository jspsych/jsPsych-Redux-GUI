import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import { connect } from 'react-redux';

import TimelineNodeOrganizer from '../containers/TimelineNodeOrganizer';
import PreviewWindow from './PreviewWindow/PreviewWindow.jsx';
import PluginMenu from './PluginMenu';
import TimelineNodeEditor from './TimelineNodeEditor';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  builderBody: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    height: '100%',
  },
  appbarIcon: {
    color: 'white'
  },
  appbar: {
    backgroundColor: '#004D40',
  },
  appTitle: {
    fontSize: '20px',
    fontWeight: 500,
    color: '#ffffff',
  },
  toolbar: {
    paddingBottom: '20px',
  }
});

const SHOW_TIMELINE_NODE_ORGANIZER = 1;
const SHOW_PLUGIN_MENU = 2;

class App extends React.Component {
  state = {
    leftDrawer: SHOW_PLUGIN_MENU,
  };

  changeLeftDrawerTo = (showWhich) => {
    this.setState({
      leftDrawer: showWhich,
    });
  };

  changeLeftDrawerToOrganizer = () => {
    this.changeLeftDrawerTo(SHOW_TIMELINE_NODE_ORGANIZER);
  };

  changeLeftDrawerToPluginMenu = () => {
    this.changeLeftDrawerTo(SHOW_PLUGIN_MENU);
  };

  render() {
    const { classes } = this.props;
    const { leftDrawer } = this.state;
    
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appbar}>
            <Toolbar className={classes.toolbar}>
              <IconButton disabled disableRipple aria-label="Menu">
                <MenuIcon className={classes.appbarIcon} />
              </IconButton>
              <Typography color="inherit" className={classes.appTitle}>
                Flanker Test
              </Typography>
            </Toolbar>
        </AppBar>
        <div className={classes.builderBody}>
          {
            leftDrawer === SHOW_TIMELINE_NODE_ORGANIZER &&
            <TimelineNodeOrganizer 
              changeLeftDrawerToOrganizer={this.changeLeftDrawerToOrganizer}
            />
          }
          {
            leftDrawer === SHOW_PLUGIN_MENU &&
            <PluginMenu 
              changeLeftDrawerToOrganizer={this.changeLeftDrawerToOrganizer}
            />
          }
          
          <PreviewWindow />
          <TimelineNodeEditor />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect()(withRoot(withStyles(styles)(App)));
