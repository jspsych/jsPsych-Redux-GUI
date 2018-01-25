import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import {
  grey800 as normalColor,
  cyan500 as iconHighlightColor,
  green500 as checkColor,
  blue500 as titleIconColor
} from 'material-ui/styles/colors';
import InitSettingIcon from 'material-ui/svg-icons/action/build';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import UnCheckIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import CodeEditor from '../../CodeEditor';
import { renderDialogTitle } from '../../gadgets';
import { settingType } from '../../../reducers/Experiment/jsPsychInit';

import AppbarTheme from '../theme.js';

const colors = {
  ...AppbarTheme.colors
}

const style = {
  icon: AppbarTheme.AppbarIcon,
  TitleIcon: {
    color: colors.primaryDeep
  },
  TextFieldFocusStyle: {
    ...AppbarTheme.TextFieldFocusStyle
  },
  Actions: {
    Close: {
      labelStyle: {
        color: colors.secondaryDeep
      }
    }
  }
}

export default class jsPsychInitEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }

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

    this.textFieldRow = (key, type="number", unit=null) => (
      <div style={{display: 'flex'}}>
        <div style={{padding: 15, color: 'black'}}>{key + ((unit) ? " (" + unit + ")" : "")}: </div>
        <TextField
          {...style.TextFieldFocusStyle}
          id={"text-field-"+key}
          value={this.props[key]}
          type={type}
          onChange={(e, value) => { this.props.setJsPsychInit(e, value, key); }}
        />
      </div>
    )

    this.toggleRow = (key) => (
      <div style={{display: 'flex', width: 370, position: 'relative'}}>
        <div style={{padding: 15, color: 'black'}}>{key}</div>
          <IconButton 
            style={{position: 'absolute', right: 0}}
            onClick={() => { this.props.setJsPsychInit(null, null, key); }} 
            >
          {(this.props[key]) ? <CheckIcon color={checkColor} /> : <UnCheckIcon />}/>
          </IconButton>
      </div>
    )

    this.codeRow = (key) => (
      <div style={{display: 'flex', width: 370, position: 'relative'}}>
        <div style={{padding: 15, color: 'black'}}>{key}</div>
        <div style={{position: 'absolute', right: 0}}>
          <CodeEditor 
            initCode={this.props[key].code} 
            submitCallback={(newCode) => { 
              this.props.setJsPsychInit(null, newCode, key);
            }}
            title={key+": "}
          />
        </div>
      </div>
    )

  }

  
  render() {
    const actions = [
      <FlatButton
        label="Close"
        {...style.Actions.Close}
        onClick={this.handleClose}
      />,
    ];

    return (
        <div className="jsPsych.init-editor">
          <IconButton 
              tooltip="Init Properties Setting"
              onClick={this.handleOpen}
          >
              <InitSettingIcon {...style.icon}/>
          </IconButton>
          <Dialog
            contentStyle={{minHeight: 500}}
            titleStyle={{padding: 0}}
            title={
                renderDialogTitle(
                  <Subheader style={{maxHeight: 48}}>
                    <div style={{display: 'flex'}}>
                    <div style={{paddingTop: 8, paddingRight: 15}}>
                      <InitSettingIcon {...style.TitleIcon}/>
                    </div>
                    <div style={{fontSize: 16,}}>
                        jsPsych.init properties
                    </div>
                    </div>
                  </Subheader>,
                  this.handleClose,
                  null)
            }
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
    )
  }
}