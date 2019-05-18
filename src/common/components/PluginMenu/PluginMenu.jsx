import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';

import Typography from '@material-ui/core/Typography';

import ImageIcon from '@material-ui/icons/ImageOutlined';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const jsPsych = window.jsPsych;
const PluginList = Object.keys(jsPsych.plugins || {}).filter((t) => (t !== 'parameterType' && t !== 'universalPluginParameters'));


const styles = theme => ({
  pluginMenu: {
    width: '30%',
    height: '100%',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 1.5px #CECECE',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  searchFieldBackIcon: {
    padding: 10,
    paddingLeft: 0,
    marginRight: 15,
  },
  pluginItemWrapper: {
    width: "98%",
    margin: '0 auto',
    padding: 0,
  },
  pluginList: {
    width: '100%'
  },
  pluginListContainer: {
    overflowY: 'auto',
  },
  searchFieldRoot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    margin: '0 auto',
    marginTop: '10px',
  },
  searchFieldContainer: {
    width: "75%",
  },
  searchFieldFocused: {
    color: "#388e3c",
  },
  searchFieldUnderline: {
    '&:after': {
      borderBottomColor: "#388e3c",
    },
  },
})


const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const toNormalName = str => str.split("-").map(capitalize).join(" ");

const PluginItem = props => {
    const { value, isLast, classes } = props;

    let displayed = toNormalName(value);

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

const isPrefix = (keyword, str) => {
  keyword = keyword.toLowerCase().trim();
  str = str.toLowerCase().trim();
  if (keyword.length > str.length) return false;
  for (let i = 0; i < keyword.length; i++) {
    let c1 = keyword.charAt(i), c2 = str.charAt(i);
    if (c1 !== c2) return false;
  }
  return true;
}

const isPrefixEitherWay = (keyword, txt) => {
  return isPrefix(keyword, txt) || isPrefix(keyword, toNormalName(txt));
}

class PluginMenu extends React.Component {
    state = {
      keyword: '',
    };

    handleKeywordChange = event => {
      this.setState({
        keyword: event.target.value,
      });
    };

    render() {
      const { 
        classes,
      } = this.props;

      const {
        keyword,
      } = this.state;

      let keywordTrimed = keyword.trim();

      let filteredList = [];
      let showFiltered = keywordTrimed.length > 0;
      if (showFiltered) {
        filteredList = PluginList.filter(txt => isPrefixEitherWay(keywordTrimed, txt));
      }

      // placeholder, name: freq
      // {"html-button-response": 1, "html-keyboard-response": 1}
      let usedInThisExperimentMap = {};
      let usedInThisExperimentList = Object.keys(usedInThisExperimentMap);

      let allPluginList = [];
      if (!showFiltered) {
        for (let p of PluginList) {
          if (!usedInThisExperimentMap[p]) {
            allPluginList.push(p);
          }
        }
      }


      return (
        <div className={classes.pluginMenu}>
        <div className={classes.searchFieldRoot}>
          <IconButton className={classes.searchFieldBackIcon} aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
          <div className={classes.searchFieldContainer}>
            <Input
                classes={{
                  focused: classes.searchFieldFocused,
                  underline: classes.searchFieldUnderline,
                }}
                id="input-with-icon-textfield"
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                onChange={this.handleKeywordChange}
            />
          </div>
        </div>
        <Divider className={classes.divider}/>
        <div className={classes.pluginListContainer}>
          {showFiltered &&
            <List 
              component="nav" 
              className={classes.pluginList}
              subheader={<ListSubheader disableSticky>Search Results</ListSubheader>}
            >
              {
                filteredList.map((val, i) => {
                    return (
                        <PluginItem 
                            value={val} 
                            key={`used-plugin-item-${i}`}
                            isLast={i >= PluginList.length - 1}
                            classes={classes}
                        />
                    )
                })
              }
            </List>
          }
          {!showFiltered && usedInThisExperimentList.length > 0 &&
            <List 
              component="nav" 
              className={classes.pluginList}
              subheader={<ListSubheader disableSticky>Most Frequently Used</ListSubheader>}
            >
              {
                usedInThisExperimentList.map((val, i) => {
                    return (
                        <PluginItem 
                            value={val} 
                            key={`used-plugin-item-${i}`}
                            isLast={i >= PluginList.length - 1}
                            classes={classes}
                        />
                    )
                })
              }
            </List>
          }
          {!showFiltered && usedInThisExperimentList.length > 0 && 
            <Divider className={classes.divider}/>}
          {!showFiltered && allPluginList.length > 0 &&
            <List 
              component="nav" 
              className={classes.pluginList}
              subheader={<ListSubheader disableSticky>All Trial Types</ListSubheader>}
            >
              {
                allPluginList.map((val, i) => {
                    return (
                        <PluginItem 
                            value={val} 
                            key={`all-plugin-item-${i}`}
                            isLast={i >= PluginList.length - 1}
                            classes={classes}
                        />
                    )
                })
              }
            </List>
          }
        </div>
        </div>
      )

    }
}

PluginMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PluginMenu);
