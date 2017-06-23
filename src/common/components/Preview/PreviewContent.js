import React from 'react';


import { jsPsych_Display_Element } from '../../reducers/TimelineNode/jsPsychInit';
import { Welcome } from '../../reducers/TimelineNode/preview';


const runtime_script_ele_id = 'Runtime-Script-Tag';

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
    this.load(Welcome);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.zoomScale !== this.props.zoomScale) {
      this.load(prevState.code);
    } else {
      this.setState({code: this.props.code});
      this.load(this.props.code);
    }
  }

  load = (code) => {
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
       