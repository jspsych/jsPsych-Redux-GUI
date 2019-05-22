import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { jsPsych_Display_Element } from '../../reducers/Experiment/jsPsychInit';
import { Welcome } from '../../backend/deploy';

const styles = theme => ({
    previewWindowContainer: {
        width: '80%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewWindow: {
        width: '95%',
        height: '95%',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.14)',
        backgroundColor: '#fafafa',
    },
})

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

class PreviewWindow extends React.Component {
    
    componentDidMount() {
        load(Welcome);
    }

    render() {
      const { classes } = this.props;

      return (
        <div 
            id="jsPsych-Layer"
            className={classes.previewWindowContainer}
        >
            <div 
                id={jsPsych_Display_Element}
                className={classes.previewWindow} 
            />
        </div>
      )

    }
}

PreviewWindow.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PreviewWindow);
