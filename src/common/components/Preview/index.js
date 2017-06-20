import React from 'react';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { jsPsych_Display_Element } from '../../reducers/TimelineNode/jsPsychInit';


export default class Preview extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.liveEditting && this.props.code !== nextProps.code;
  }

  componentDidUpdate() {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = this.props.code;
    this.display_element.appendChild(script);
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
                  id="Preview-Window"
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
       
        