import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Play from 'material-ui/svg-icons/av/play-arrow';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Skip from 'material-ui/svg-icons/av/skip-next';
import FullScreen from 'material-ui/svg-icons/navigation/fullscreen';
import FullScreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';

import PreviewContent from '../../containers/Preview/PreviewContentContainer';
import { jsPsych_Display_Element } from '../../reducers/TimelineNode/jsPsychInit';
import { Welcome } from '../../reducers/TimelineNode/preview';

import {
  cyan600 as hoverColor,
  grey600 as textColor
} from 'material-ui/styles/colors';


export const getFullScreenState = () => (
  document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement
)

export default class Preview extends React.Component {
  componentWillMount() {
    document.addEventListener("webkitfullscreenchange",
      this.detectFullScreenChange, false);
    document.addEventListener("fullscreenchange",
      this.detectFullScreenChange, false);
    document.addEventListener("mozfullscreenchange",
      this.detectFullScreenChange, false);
  }

  toggleFullScreen = () => {
    if (!getFullScreenState()) {
      let ele = document.querySelector('#main-body');
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        ele.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen(ele.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

	render() {
    const {
      zoomScale,
      zoomWidth,
      zoomHeight,
    } = this.props;
		return (
      <MuiThemeProvider>
        <div style={{
              paddingTop: 5, 
              margin: 'auto', 
              width: "90%",
              height: "80%"
            }}
            id="Preview_Window_Container"
            className="Preview_Window_Container"
        >
          <Paper style={{
                  width:  zoomWidth,
                  height: zoomHeight,
                  margin: 'auto',
                  }}
                  zDepth={1}
          >
            <PreviewContent zoomScale={zoomScale} />
          </Paper>
          <div style={{paddingTop: 5}}>
                <Toolbar style={{height: 40, maxWidth: 600, margin: '0 auto'}}>
                  <ToolbarGroup style={{margin: '0 auto'}}>
                      <IconButton 
                        tooltip="Play"
                        onTouchTap={()=>{ this.props.playAll(); this.load(this.props.code); }}
                        >
                        <Play hoverColor={hoverColor} />
                      </IconButton>
                      <IconButton 
                        tooltip="Reload"
                        onTouchTap={()=>{ this.load(this.props.code); }}
                        >
                        <Refresh hoverColor={hoverColor} />
                      </IconButton>
                      <IconButton 
                        tooltip="Skip"
                        onTouchTap={() => {}}
                        >
                        <Skip hoverColor={hoverColor} />
                      </IconButton>
                      <IconButton 
                        tooltip={(!getFullScreenState()) ? "Full screen" : "Exit full screen"}
                        onTouchTap={this.toggleFullScreen}
                        >
                        {(!getFullScreenState()) ? <FullScreen hoverColor={hoverColor} /> : <FullScreenExit hoverColor={hoverColor} />}
                      </IconButton>
                  </ToolbarGroup>
                </Toolbar>
          </div>
        </div>
      </MuiThemeProvider>
  		);
	}
}
       