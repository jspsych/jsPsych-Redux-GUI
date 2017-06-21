import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Play from 'material-ui/svg-icons/av/play-arrow';
import Refresh from 'material-ui/svg-icons/navigation/refresh';

import { jsPsych_Display_Element } from '../../reducers/TimelineNode/jsPsychInit';
import { Welcome } from '../../reducers/TimelineNode/preview';

const runtime_script_ele_id = 'Runtime-Script-Tag';

export default class Preview extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.code !== nextProps.code;
  }

  componentDidMount() {
    this.load(Welcome);
  }

  componentDidUpdate() {
    this.load(this.props.code);
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
        <div style={{
          paddingTop: 10, 
          width: "90%", 
          height: "80%",
          margin: 'auto', 
        }}>
            <Paper style={{
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
                <ToolbarGroup firstChild={true}>
                    <IconButton 
                      tooltip="Play Experiment"
                      onTouchTap={()=>{ this.props.playAll(); this.load(this.props.code); }}
                      >
                      <Play />
                    </IconButton>
                    <IconButton 
                      tooltip="Reload Experiment"
                      onTouchTap={()=>{ this.load(this.props.code); }}
                      >
                      <Refresh />
                    </IconButton>
                </ToolbarGroup>
              </Toolbar>
            </div>
        </div>
      </MuiThemeProvider>
  		);
	}
}
       
        