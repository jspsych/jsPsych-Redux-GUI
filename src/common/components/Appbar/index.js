import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { GridTile } from 'material-ui/GridList';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'; // , ToolbarSeparator, ToolbarTitle
import Snackbar from 'material-ui/Snackbar';

import {
  cyan500 as hoverColor,
  green500 as successColor,
  yellow500 as failColor
} from 'material-ui/styles/colors';

import InitEditor from '../../containers/Appbar/jsPsychInitEditor';
import UserMenu from '../../containers/Appbar/UserMenu';
import MediaManager from '../../containers/Appbar/MediaManager';
import Save from 'material-ui/svg-icons/content/save';
import Done from 'material-ui/svg-icons/action/check-circle';
import ErrorIcon from 'material-ui/svg-icons/alert/warning';
import New from 'material-ui/svg-icons/action/note-add';
import SaveAs from 'material-ui/svg-icons/content/content-copy';


export default class Appbar extends React.Component {
  state = {
    snackBarOpen: false,
    snackBarSuccess: false,
    saveAsOpen: false,
    saveAsName: '',
    saveAsNameError: '',
  }

  handleOpenSnackBar = (m, f) => {
    this.setState({
      snackBarOpen: true,
      snackBarMessage: m,
      snackBarSuccess: f
    })
  }

  handleCloseSnackBar = () => {
    this.setState({
      snackBarOpen: false,
      snackBarMessage: '',
      snackBarSuccess: false
    })
  }

  handleSaveAsOpen = () => {
    this.setState({
      saveAsOpen: true,
      saveAsName: this.props.experimentName
    })
  }

  handleSaveAsClose = () => {
    this.setState({
      saveAsOpen: false,
      saveAsName: '',
      saveAsNameError: '',
    })
  }

  setSaveAsName = (e, n) => {
    this.setState({
      saveAsName: n,
      saveAsNameError: (/\S/.test(n)) ? '' : "New experiment name can't be empty."
    })
  } 

	render() {
		return (
      		<div className="Appbar"
      				style={{
      					width: "100%",
      					margin: '0 auto',
      					display: 'flex',
      					height: "100%",
      					paddingBottom: 0,
								borderBottom: '1px solid #aaa'
      				}}
      				draggable={false}
      				>
  						<div style={{
                minWidth:"6vw",
                width: "7%",
              }}>
    						<GridTile style={{ height: 88 }}>
    							<img draggable={false} src='./jsPsych/jspsych-logo-readme.jpg' role="presentation"/>
    						</GridTile>
  						</div>
        			<div className="Appbar-main" style={{
                display: 'inline-block', width:"93%"
              }}>
        			<div style={{
                    backgroundColor: 'white',
                    marginLeft: 5
                  }}>
								<UserMenu />
								<TextField
  								id="Experiment-Name-Textfield"
                  value={this.props.experimentName}
                  errorText={(/\S/.test(this.props.experimentName)) ? '' : "Experiment name can't be empty."}
  								onChange={this.props.changeExperimentName}
                  />
							</div>
  							<Toolbar style={{height: 40, backgroundColor: 'white'}}>
                  <ToolbarGroup firstChild={true}>
                    <InitEditor />
                    <ToolbarSeparator />
                    <IconButton 
                      tooltip="New Experiment"
                      onTouchTap={this.props.newExperiment}
                      > 
                      <New hoverColor={hoverColor} />
                    </IconButton>
                    <IconButton 
                      tooltip="Save"
                      onTouchTap={() => { this.props.save(this.handleOpenSnackBar); }}
                      > 
                      <Save hoverColor={hoverColor} />
                    </IconButton>
                    <IconButton 
                      tooltip="Save As"
                      onTouchTap={this.handleSaveAsOpen}
                      > 
                      <SaveAs hoverColor={hoverColor} />
                    </IconButton>
                    <ToolbarSeparator />
										<MediaManager />
                  </ToolbarGroup>
  							</Toolbar>
  						</div>

              <Snackbar
                open={this.state.snackBarOpen}
                message={ 
                  <MenuItem 
                    primaryText={this.state.snackBarMessage}
                    style={{color: 'white'}}
                    disabled={true}
                    rightIcon={(this.state.snackBarSuccess) ? <Done color={successColor} /> : <ErrorIcon color={failColor} />} 
                  /> 
                }
                autoHideDuration={2500}
                onRequestClose={this.handleCloseSnackBar}
              />

              <Dialog
                open={this.state.saveAsOpen}
                onRequestClose={this.handleSaveAsClose}
                contentStyle={{width: 450, height: 300, padding: 0}}
                actions={[
                  <FlatButton
                    label="Save As"
                    labelStyle={{
                      textTransform: "none",
                    }}
                    primary={true}
                    keyboardFocused={true}
                    onTouchTap={() => { 
                        if (this.state.saveAsNameError === '') {
                          this.props.saveAs(this.state.saveAsName);
                        }
                        this.handleSaveAsClose();
                      }
                    }
                  />,
                  <FlatButton
                    label="Cancel"
                    labelStyle={{
                      textTransform: "none",
                    }}
                    secondary={true}
                    onTouchTap={this.handleSaveAsClose}
                  />
                ]}
              >
              <div style={{width: 400, margin: 'auto'}}>
                <TextField
                  id="Save-as-new-experiment-name"
                  floatingLabelFixed={true}
                  floatingLabelText="New experiment name"
                  value={this.state.saveAsName}
                  errorText={this.state.saveAsNameError}
                  onChange={this.setSaveAsName}
                  fullWidth={true}
                />
              </div>
              </Dialog>
  					</div>
		   )
	}

}
