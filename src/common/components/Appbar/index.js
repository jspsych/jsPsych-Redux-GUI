import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { GridTile } from 'material-ui/GridList';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'; // , ToolbarSeparator, ToolbarTitle

import Save from 'material-ui/svg-icons/content/save';
import New from 'material-ui/svg-icons/action/note-add';
import SaveAs from 'material-ui/svg-icons/content/content-copy';
import {
  cyan500 as hoverColor,
} from 'material-ui/styles/colors';

import InitEditor from '../../containers/Appbar/jsPsychInitEditor';
import UserMenu from '../../containers/Appbar/UserMenu';
import MediaManager from '../../containers/Appbar/MediaManager';

import ConfirmationDialog from '../Notification/ConfirmationDialog';
import * as actionTypes from '../../constants/ActionTypes';


export default class Appbar extends React.Component {
  state = {
    saveAsOpen: false,
    saveAsName: '',
    saveAsNameError: '',
    performing: null,
    confirmOpen: false,
    confirmMessage: "",
    proceedWithOperation: () => {},
    proceedWithOperationLabel: "",
    proceed: () => {},
    proceedLabel: "",
  }

  setPerforming = (p) => {
    this.setState({
      performing: p
    });
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

  handleConfirmClose = () => {
    this.setState({
      confirmOpen: false
    })
  }

  popUpConfirm = (message, proceedWithOperation, proceedWithOperationLabel, proceed, proceedLabel) => {
    this.setState({
      confirmOpen: true,
      confirmMessage: message,
      proceedWithOperation: proceedWithOperation,
      proceedWithOperationLabel: proceedWithOperationLabel,
      proceed: proceed,
      proceedLabel: proceedLabel,
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
                      onTouchTap={() => { this.props.newExperiment(this.popUpConfirm); }}
                      > 
                      <New hoverColor={hoverColor} />
                    </IconButton>
                    {(this.state.performing === actionTypes.CLICK_SAVE_PUSH) ?
                      <CircularProgress /> :
                      <IconButton 
                        tooltip="Save"
                        onTouchTap={() => { this.props.save(()=>{
                          this.setPerforming(actionTypes.CLICK_SAVE_PUSH);
                        }, () => {
                          this.setPerforming(null);
                        });}}
                      > 
                        <Save hoverColor={hoverColor} />
                      </IconButton>
                    }
                    <IconButton 
                      tooltip="Save As"
                      onTouchTap={() => { this.props.saveAsOpen(this.handleSaveAsOpen); }}
                      > 
                      <SaveAs hoverColor={hoverColor} />
                    </IconButton>
                    <ToolbarSeparator />
										<MediaManager />
                  </ToolbarGroup>
  							</Toolbar>
  						</div>

              <ConfirmationDialog
                open={this.state.confirmOpen}
                message={this.state.confirmMessage}
                handleClose={this.handleConfirmClose}
                proceedWithOperation={this.state.proceedWithOperation}
                proceedWithOperationLabel={this.state.proceedWithOperationLabel}
                proceed={this.state.proceed}
                proceedLabel={this.state.proceedLabel}
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
