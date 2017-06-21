import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Play from 'material-ui/svg-icons/av/play-arrow';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Skip from 'material-ui/svg-icons/av/skip-next';
import FullScreen from 'material-ui/svg-icons/navigation/fullscreen';
import FullScreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';

import { jsPsych_Display_Element } from '../../reducers/TimelineNode/jsPsychInit';
import { Welcome } from '../../reducers/TimelineNode/preview';

import {
  cyan600 as hoverColor,
} from 'material-ui/styles/colors';

const runtime_script_ele_id = 'Runtime-Script-Tag';

var fullScreen = false;

//document.querySelector('#q').offsetWidth

export default class Preview extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillMount() {
    document.addEventListener("webkitfullscreenchange", 
                              this.detectFullScreenChange, false);
    document.addEventListener("fullscreenchange", 
                              this.detectFullScreenChange, false);
    document.addEventListener("mozfullscreenchange", 
                              this.detectFullScreenChange, false);
  }

  componentDidMount() {
    this.load(Welcome);
  }
  

  componentDidUpdate() {
    this.load(this.props.code);
  }

  state = {
    fullScreen: false
  }

  detectFullScreenChange = () => {
    fullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    this.setState({fullScreen: fullScreen})
  }

  toggleFullScreen = () => {
    let next = !this.state.fullScreen;
    this.setState({fullScreen: next});
    if (next) {
       let ele = document.querySelector('#Preview_Window_Container');
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

  load(code) {
    let ele = document.getElementById(runtime_script_ele_id);
    if (ele) ele.remove();
    let script = document.createElement('script');
    script.id = runtime_script_ele_id;
    script.type = 'text/javascript';
    script.async = false;
    script.innerHTML = code;
    document.body.appendChild(script);
  }

	render() {
		return (
      <MuiThemeProvider>
        <div id="Preview_Window_Container" style={{
          paddingTop: 10, 
          width: "90%", 
          height: "80%",
          margin: 'auto', 
        }}
        onKeyUp={(e) => { if (e.which === 27 && this.state.fullScreen) {
                              this.setState({fullScreen: false})
                        }}}
        tabIndex={-2}
        >
            <Paper 
                style={{
                  height: "100%", 
                  width: "100%", 
                }}
                zDepth={1}>
              <div 
                  className={jsPsych_Display_Element}
                  id={jsPsych_Display_Element}
                  style={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'hidden',
                  }}
                  ref={(el) => (this.display_element = el)}
                  >
              </div>
            </Paper>

            <div style={{paddingTop: 10, }}>
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
                      tooltip={(!this.state.fullScreen) ? "Full screen" : "Exit full screen"}
                      onTouchTap={this.toggleFullScreen}
                      >
                      {(!this.state.fullScreen) ? <FullScreen hoverColor={hoverColor} /> : <FullScreenExit hoverColor={hoverColor} />}
                    </IconButton>
                </ToolbarGroup>
              </Toolbar>
            </div>
        </div>
      </MuiThemeProvider>
  		);
	}
}
       
        