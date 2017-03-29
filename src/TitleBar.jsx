import React from 'react';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import AppBar from 'material-ui/AppBar';

const titleBarFAB = {
    position: 'absolute'
};
const menuFAB = {
    marginTop: 12,
    position: 'absolute'
};
const TitleBar = ({
    toggleTimeline
}) => (
    <AppBar
      title="jsPsych GUI"
      titleStyle={{textAlign: 'center'}}
      style={titleBarFAB}
      iconElementLeft={
        <NavigationMenu
          style={menuFAB}
          onTouchTap={toggleTimeline}
        />
 }
    />
 );
export default TitleBar;
