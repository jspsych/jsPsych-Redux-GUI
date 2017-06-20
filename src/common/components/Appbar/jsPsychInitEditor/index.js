import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {
  grey800 as normalColor,
  cyan600 as iconHighlightColor,
  green500 as checkColor,
} from 'material-ui/styles/colors';
import InitSettingIcon from 'material-ui/svg-icons/action/settings';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import CodeEditorTrigger from '../../CodeEditorTrigger';

import { settingType } from '../../../reducers/TimelineNode/jsPsychInit';

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

  textFieldRow = (key, type="number", unit=null) => (
  <div style={{display: 'flex'}}>
    <div style={{padding: 15}}>{key + ((unit) ? " (" + unit + ")" : "")}: </div>
    <TextField
      id={"text-field-"+key}
      value={this.props[key]}
      type={type}
      onChange={(e, value) => { this.props.setJsPsychInit(e, value, key); }}
    />
  </div>
  )

  toggleRow = (key) => (
    <div style={{display: 'flex', width: 370, position: 'relative'}}>
      <div style={{padding: 15}}>{key}</div>
        <IconButton 
          style={{position: 'absolute', right: 0}}
          onTouchTap={() => { this.props.setJsPsychInit(null, null, key); }} 
          >
        {(this.props[key]) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
        </IconButton>
    </div>
  )

  codeRow = (key) => (
    <div style={{display: 'flex', width: 370, position: 'relative'}}>
      <div style={{padding: 15}}>{key}</div>
      <div style={{position: 'absolute', right: 0}}>
        <CodeEditorTrigger code={this.props[key].code} 
                    onUpdate={(newCode) => { this.props.setJsPsychInit(null, newCode, key); }}
                    openCallback={this.props.turnOffLiveEditting}
                    closeCallback={this.props.turnOnLiveEditting}
                    title={key+" = "}
        />
      </div>
    </div>
  )

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
              tooltip="Init Properties Setting"
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
          {this.textFieldRow(settingType.default_iti)}
          {this.codeRow(settingType.on_finish)}
          {this.codeRow(settingType.on_trial_start)}
          {this.codeRow(settingType.on_trial_finish)}
          {this.codeRow(settingType.on_data_update)}
          {this.codeRow(settingType.on_interaction_data_update)}
          {this.toggleRow(settingType.show_progress_bar)}
          {this.toggleRow(settingType.auto_update_progress_bar)}
          {this.toggleRow(settingType.show_preload_progress_bar)}
          <div style={{padding: 15}}>preload_audio: </div>
          <div style={{padding: 15}}>preload_images: </div>
          {this.textFieldRow(settingType.max_load_time, "number", "ms")}
          <div style={{padding: 15}}>Exclusions: </div>
          <div style={{paddingLeft: 32}}>
            {this.textFieldRow(settingType.min_width)}
            {this.textFieldRow(settingType.min_height)}
            {this.toggleRow(settingType.audio)}
          </div>
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}