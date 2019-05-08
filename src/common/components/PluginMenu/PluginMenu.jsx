import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

import Typography from '@material-ui/core/Typography';

import ImageIcon from '@material-ui/icons/ImageOutlined';

const jsPsych = window.jsPsych;
const PluginList = Object.keys(jsPsych.plugins || {}).filter((t) => (t !== 'parameterType' && t !== 'universalPluginParameters'));


const styles = theme => ({
  pluginMenu: {
    width: '25%',
    height: '100%',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 1.2px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  pluginItemWrapper: {
    width: "98%",
    margin: '0 auto',
    padding: 0,
  },
  pluginList: {
    overflowY: 'auto',
    width: '100%'
  }
})


const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const PluginItem = props => {
    const { value, isLast, classes } = props;

    let displayed = value.split("-").map(capitalize).join(" ");

    return (
        <div className={classes.pluginItemWrapper}>
            <ListItem 
                button 
                alignItems="flex-start"
            >
                <ListItemIcon>
                  <ImageIcon />
                </ListItemIcon>
                <ListItemText
                  primary={displayed}
                  secondary={
                    <React.Fragment>
                      {" Some descriptions of this plugin..."}
                    </React.Fragment>
                  }
                />
            </ListItem>
            {!isLast && <Divider variant="inset" className={classes.divider}/>}
        </div>
    )
}


class PluginMenu extends React.Component {
    render() {
      const { 
        classes,
      } = this.props;

      return (
        <div className={classes.pluginMenu}>
         <List component="nav" className={classes.pluginList}>
          {
            PluginList && PluginList.map((val, i) => {
                return (
                    <PluginItem 
                        value={val} 
                        key={`plugin-item-${i}`}
                        isLast={i >= PluginList.length - 1}
                        classes={classes}
                    />
                )
            })
          }
        </List>
        </div>
      )

    }
}

PluginMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PluginMenu);
