import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {
  grey800 as normalColor,
  cyan600 as iconHighlightColor,
  green500 as checkColor,
} from 'material-ui/styles/colors';
import InitSettingIcon from 'material-ui/svg-icons/action/settings';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';
// import CheckIcon from 'material-ui/svg-icons/toggle/check-box';
// import UnCheckIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';

import CodeEditor from '../CodeEditor';

import { settingType } from '../../reducers/jsPsychInit';

const textFieldRow = (self, key, type="number") => (
  <div style={{display: 'flex'}}>
    <div style={{padding: 15}}>{key}: </div>
    <TextField
      id="text-field-default_iti"
      value={self.props[key]}
      type={type}
      onChange={(e, value) => { self.props.setJsPsychInit(e, value, settingType[key]); }}
    />
  </div>
)

const toggleRow = (self, key) => (
  <div style={{display: 'flex', width: 370, position: 'relative'}}>
    <div style={{padding: 15}}>{key}</div>
      <IconButton 
        style={{position: 'absolute', right: 0}}
        onTouchTap={() => { self.props.setJsPsychInit(null, null, settingType[key]); }} 
        >
      {(self.props[key]) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
      </IconButton>
  </div>
)

const codeRow = (self, key) => (
  <div style={{display: 'flex', width: 370, position: 'relative'}}>
    <div style={{padding: 15}}>{key}</div>
    <div style={{position: 'absolute', right: 0}}>
      <CodeEditor code={self.props[key]} 
                  onUpdate={(newCode) => { self.props.setJsPsychInit(null, newCode, settingType[key]); }}
                  title={key+" = "}
      />
    </div>
  </div>
)

export default class jsPsychInitEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleOpen = () => {
      this.setState({
        open: true
      });
    };

    this.handleClose = () => {
      this.setState({
        open: false
      });
    };

  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <MuiThemeProvider>
        <div className="jsPsych.init-editor">
          <IconButton 
              tooltip="Launch Property Settings"
              onTouchTap={this.handleOpen}
          >
              <InitSettingIcon 
                color={(this.state.open) ? iconHighlightColor :normalColor}
                hoverColor={iconHighlightColor}
              />
          </IconButton>
          <Dialog
            contentStyle={{minHeight: 500}}
            title="jsPsych.init Properties"
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
          {textFieldRow(this, "default_iti")}
          {codeRow(this, "on_finish")}
          {codeRow(this, "on_trial_start")}
          {codeRow(this, "on_trial_finish")}
          {codeRow(this, "on_data_update")}
          {codeRow(this, "on_interaction_data_update")}
          {toggleRow(this, "show_progress_bar")}
          {toggleRow(this, "auto_update_progress_bar")}
          {toggleRow(this, "show_preload_progress_bar")}
          <div style={{padding: 15}}>preload_audio: </div>
          <div style={{padding: 15}}>preload_images: </div>
          {textFieldRow(this, "max_load_time")}
          <div style={{padding: 15}}>Exclusions: </div>
          <div style={{paddingLeft: 32}}>
            {textFieldRow(this, "min_width")}
            {textFieldRow(this, "min_height")}
            {toggleRow(this, "audio")}
          </div>
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}