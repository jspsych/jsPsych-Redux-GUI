import React from 'react';
import Paper from 'material-ui/Paper';
import deepEqual from 'deep-equal';

import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

import Play from 'material-ui/svg-icons/av/play-arrow';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
// import Skip from 'material-ui/svg-icons/av/skip-next';
import FullScreen from 'material-ui/svg-icons/navigation/fullscreen';
import FullScreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';

import { jsPsych_Display_Element } from '../../reducers/Experiment/jsPsychInit';
import { Welcome } from '../../backend/deploy';

import {
  cyan600 as hoverColor,
  // grey600 as textColor
} from 'material-ui/styles/colors';


const runtime_script_ele_id = 'Runtime-Script-Tag';

export const getFullScreenState = () => (
  document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement
)

const load = (code) => {
  let ele = document.getElementById(runtime_script_ele_id);
  if (ele) {
    ele.remove();
  }
  let script = document.createElement('script');
  script.id = runtime_script_ele_id;
  script.type = 'text/javascript';
  script.async = false;
  script.innerHTML = code;
  document.body.appendChild(script);
}

const reload = () => {
  let ele = document.getElementById(runtime_script_ele_id);
  let code = ele.innerHTML;
  if (ele) {
    ele.remove();
  }
  let script = document.createElement('script');
  script.id = runtime_script_ele_id;
  script.type = 'text/javascript';
  script.async = false;
  script.innerHTML = code;
  document.body.appendChild(script);
}

export default class PreviewWindow extends React.Component {
  state = {
    fullScreen: false,
    showToolBar: false
  }

  componentWillMount() {
    document.addEventListener("webkitfullscreenchange",
      this.detectFullScreenChange, false);
    document.addEventListener("fullscreenchange",
      this.detectFullScreenChange, false);
    document.addEventListener("mozfullscreenchange",
      this.detectFullScreenChange, false);
  }

  componentWillUnmount() {
    document.removeEventListener("webkitfullscreenchange",
      this.detectFullScreenChange, false);
    document.removeEventListener("fullscreenchange",
      this.detectFullScreenChange, false);
    document.removeEventListener("mozfullscreenchange",
      this.detectFullScreenChange, false);
  }

  componentDidMount() {
    load(Welcome);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!deepEqual(this.props.state, prevProps.state)) {
      this.props.hotUpdate(load);
    }
  }

  detectFullScreenChange = () => {
    this.setState({fullScreen: getFullScreenState()});
  }

  toggleFullScreen = () => {
    if (!getFullScreenState()) {
      let ele = document.querySelector(`#${"jsPsych-Layer"}`);
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
    let tooltipPosition = (this.state.fullScreen) ? 'top-center' : 'bottom-center';
    let previewToolBar = (
      <div 
        style={{paddingTop: 5}}>
                <Toolbar style={{height: 40, maxWidth: 600, margin: '0 auto'}}>
                  <ToolbarGroup style={{margin: '0 auto'}}>
                      <IconButton 
                        tooltip="Play all"
                        tooltipPosition={tooltipPosition}
                        onTouchTap={()=>{ this.props.playAll(load); }}
                        >
                        <Play hoverColor={hoverColor} />
                      </IconButton>
                      <IconButton 
                        tooltip="Reload"
                        tooltipPosition={tooltipPosition}
                        onTouchTap={reload}
                        >
                        <Refresh hoverColor={hoverColor} />
                      </IconButton>

                      <IconButton 
                        tooltip={(!this.state.fullScreen) ? "Full screen" : "Exit full screen"}
                        onTouchTap={this.toggleFullScreen}
                        tooltipPosition={tooltipPosition}
                        >
                        {(!this.state.fullScreen) ? <FullScreen hoverColor={hoverColor} /> : <FullScreenExit hoverColor={hoverColor} />}
                      </IconButton>
                  </ToolbarGroup>
                </Toolbar>
          </div>
    )

                      //     <IconButton 
                      //   tooltip="Skip"
                      //   tooltipPosition={tooltipPosition}
                      //   onTouchTap={() => {}}
                      //   >
                      //   <Skip hoverColor={hoverColor} />
                      // </IconButton>
                      
    const {
      zoomScale,
      zoomWidth,
      zoomHeight,
    } = this.props;
		return (
        <div style={{
              paddingTop: 5, 
              margin: 'auto', 
              width: "90%",
              height: "100%"
            }}
            id="Preview_Window_Container"
        >
          <Paper  id="jsPsych-Layer"
                  style={{
                  width:  (!this.state.fullScreen) ? zoomWidth : "100%",
                  height: (!this.state.fullScreen) ? zoomHeight : "100%", 
                  margin: 'auto',
                  overflow: 'hidden',
                  }}
                  zDepth={1}
                  onClick={()=>{document.getElementById(jsPsych_Display_Element).focus();}}
          >
          <div
            id={jsPsych_Display_Element}
            style={{
              width: "100%", 
              height: "100%",
              overflowY: 'auto',
              transform: 'scale(' + zoomScale + ')',
            }}
            />
            {(this.state.fullScreen) ?
              <div 
                onMouseEnter={() => { this.setState({showToolBar: true}); }}
                onMouseLeave={() => { this.setState({showToolBar: false}); }}
                style={{
                  position: 'fixed', 
                  bottom: 0, 
                  margin: 'auto', 
                  width: "100%",
                }}
              >
                {(this.state.showToolBar) ? 
                  previewToolBar : 
                  <div style={{width: "100%", height: 30}}/>
                }
              </div> :
                null
              }
          </Paper>
          {previewToolBar}
        </div>
  		);
	}
}
       