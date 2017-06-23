import React from 'react';


import { jsPsych_Display_Element } from '../../reducers/Experiment/jsPsychInit';
import { Welcome } from '../../reducers/Experiment/preview';


const runtime_script_ele_id = 'Runtime-Script-Tag';

export const load = (code) => {
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

export const reload = () => {
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

export default class PreviewContent extends React.Component {
  state = {
    code: Welcome
  }

  shouldComponentUpdate(nextProps) {
    let { zoomScale: thisScale, code: thisCode } = this.props;
    let { zoomScale: nextScale, code: nextCode } = nextProps;

    return thisScale !== nextScale || thisCode !== nextCode;
  }

  componentDidMount() {
    load(Welcome);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.zoomScale !== this.props.zoomScale) {
      load(prevState.code);
    } else {
      this.setState({code: this.props.code});
      load(this.props.code);
    }
  }

	render() {
    const {
      zoomScale,
    } = this.props;
    
		return (
        <div 
            className={jsPsych_Display_Element}
            id={jsPsych_Display_Element}
            style={{
              width: '100%',
              height: '100%',
              overflowY: 'hidden',
              transform: 'scale(' + zoomScale + ')'
            }}
            ref={(el) => (this.display_element = el)}
            >
        </div>
  		);
	}
}
       