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

import GeneralTheme from '../theme.js';

const colors = GeneralTheme.colors;

export const PreviewWindowContainerWidth = 0.9;

const style = {
  Toolbar: {
    flexBasis: '40px',
    display: 'flex',
    justifyContent: 'center',
    flexShrink: 0
  },
  ToolbarIcon: {
    hoverColor: colors.secondary
  },
  PreviewWindow: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  PreviewWindowContainer: {
    width: `${PreviewWindowContainerWidth * 100}%`,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  jsPsychLayer: {
    overflow: 'hidden'
  },
  jsPsychDisplayElement: (zoomScale) => ({
    width: "100%",
    height: "100%",
    overflow: 'auto',
    transform: `scale(${zoomScale})`,
  }),
  FullScreenToolbarContainer: {
    position: 'fixed',
    bottom: 0,
    margin: '0 auto',
    width: "100%",
  },
  FullScreenGhostToolbar: {
    width: "100%",
    height: 30
  }
}

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
  constructor(props) {
    super(props);

    this.state = {
      fullScreen: false,
      showToolBar: false,
    }
  }

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
      <div style={style.Toolbar}>
          <IconButton 
            tooltip="Play all"
            tooltipPosition={tooltipPosition}
            onClick={()=>{ this.props.playAll(load); }}
            >
            <Play {...style.ToolbarIcon} />
          </IconButton>
          <IconButton 
            tooltip="Reload"
            tooltipPosition={tooltipPosition}
            onClick={reload}
            >
            <Refresh {...style.ToolbarIcon} />
          </IconButton>

          <IconButton 
            tooltip={(!this.state.fullScreen) ? "Full screen" : "Exit full screen"}
            onClick={this.toggleFullScreen}
            tooltipPosition={tooltipPosition}
            >
            {(!this.state.fullScreen) ? <FullScreen {...style.ToolbarIcon} /> : <FullScreenExit {...style.ToolbarIcon} />}
          </IconButton>
      </div>)

                      //     <IconButton 
                      //   tooltip="Skip"
                      //   tooltipPosition={tooltipPosition}
                      //   onClick={() => {}}
                      //   >
                      //   <Skip hoverColor={hoverColor} />
                      // </IconButton>
                      
    let {
      zoomScale,
      zoomWidth,
      zoomHeight,
      sizeRef
    } = this.props;

		return (
      <div style={style.PreviewWindow}>
          <div style={style.PreviewWindowContainer} ref={sizeRef}>
            <Paper  id="jsPsych-Layer"
                    style={{
                      ...style.jsPsychLayer,
                      width:  (!this.state.fullScreen) ? zoomWidth : "100%",
                      height: (!this.state.fullScreen) ? zoomHeight : "100%", 
                    }}
                    zDepth={1}
                    onClick={()=>{document.getElementById(jsPsych_Display_Element).focus();}}
            >
              <div id={jsPsych_Display_Element} style={style.jsPsychDisplayElement(zoomScale)} />
              {(this.state.fullScreen) ?
                  <div 
                    onMouseEnter={() => { this.setState({showToolBar: true}); }}
                    onMouseLeave={() => { this.setState({showToolBar: false}); }}
                    style={style.FullScreenToolbarContainer}
                  >
                    {(this.state.showToolBar) ? 
                      previewToolBar : 
                      <div style={style.FullScreenGhostToolbar}/>
                    }
                  </div> :
                  null
              }
            </Paper>
          </div>
          {previewToolBar}
      </div>
  		);
	}
}
       