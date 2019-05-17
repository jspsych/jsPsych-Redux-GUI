import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import TrialIcon from '@material-ui/icons/code';
import TimelineIcon from '@material-ui/icons/FolderOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';


const styles = theme => ({
  editorContainer: {
    width: '40%',
    height: '100%',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 2px 0 #AAAAAA',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflow: 'hidden'
  },
  indicator: {
    backgroundColor: "#388e3c",
  },
  tabLabel: {
    color: "#1b5e20",
  },
  tabContainer: {
    minWidth: "133px"
  },
  appbarRoot: {
    zIndex: 1,
  },
  appbarColor: {
    backgroundColor: '#ffffff',
  },
  nodeTitleRoot: {
    minHeight: "65px",
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
  nodeTitle: {
    display: 'flex',
    width: "80%",
  },
  titleText: {
    width: "80%",
    fontSize: 20
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  }
})

const TabContainer = ({ children, dir }) => {
  return (
    <Typography component="span" dir={dir} style={{ padding: 8 }}>
      {children}
    </Typography>
  );
}

class TimelineNodeEditor extends React.Component {
    state = {
      value: 0,
    };

    handleChange = (event, value) => {
      this.setState({ value });
    };

    handleChangeIndex = index => {
      this.setState({ value: index });
    };

    render() {
      const { 
        classes,
        theme,
      } = this.props;

      return (
        <div className={classes.editorContainer}>
          <AppBar 
            position="static" 
            color="default" 
            classes={{
              colorDefault: classes.appbarColor,
              root: classes.appbarRoot,
            }}
          >
          <div className={classes.nodeTitleRoot}>
            <div className={classes.nodeTitle}>
              <div className={classes.iconContainer}>
                <TrialIcon />
              </div>
              <span className={classes.titleText}>
                Trial Name
              </span>
            </div>
            <div className={classes.iconContainer}>
              <MoreVertIcon />
            </div>
          </div>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            classes={{
              indicator: classes.indicator
            }}
            centered
          >
            <Tab 
              label="Content" 
              classes={{
                selected: classes.tabLabel,
                root: classes.tabContainer,
              }}
            />
            <Tab 
              label="Style" 
              classes={{
                selected: classes.tabLabel,
                root: classes.tabContainer,
              }}
            />
            <Tab 
              label="Advanced" 
              classes={{
                selected: classes.tabLabel,
                root: classes.tabContainer,
              }}
            />
          </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabContainer dir={theme.direction}>Item One</TabContainer>
            <TabContainer dir={theme.direction}>Item Two</TabContainer>
            <TabContainer dir={theme.direction}>Item Three</TabContainer>
          </SwipeableViews>
        </div>
      )

    }
}

TimelineNodeEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TimelineNodeEditor);
