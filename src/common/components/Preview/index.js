import React from 'react';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { jsPsych_Display_Element } from '../../reducers/TimelineNode/jsPsychInit';
import { Welcome } from '../../reducers/TimelineNode/preview';

const runtime_script_ele_id = 'RunTime-Script';

export default class Preview extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.liveEditting && this.props.code !== nextProps.code;
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
        </div>
      </MuiThemeProvider>
  		);
	}
}
       
        