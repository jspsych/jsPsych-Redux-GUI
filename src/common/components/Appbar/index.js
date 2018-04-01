import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import AppBar from 'material-ui/AppBar';

import { ListItem } from 'material-ui/List';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'; // , ToolbarSeparator, ToolbarTitle

import Save from 'material-ui/svg-icons/content/save';
import New from 'material-ui/svg-icons/action/note-add';
import SaveAs from 'material-ui/svg-icons/content/content-copy';
import DIYDeploy from 'material-ui/svg-icons/content/archive';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import InitEditor from '../../containers/Appbar/jsPsychInitEditor';
import UserMenu from '../../containers/Appbar/UserMenu';
import MediaManager from '../../containers/MediaManager';
import CloudDeploymentManager from '../../containers/Appbar/CloudDeploymentManager';

import ConfirmationDialog from '../Notification/ConfirmationDialog';
import { renderDialogTitle } from '../gadgets';

import AppbarTheme from './theme.js';
import { prefixer } from '../theme.js';

const colors = {
  ...AppbarTheme.colors,
  dialogBodyColor: '#F5F5F5'
}

const style = {
  Appbar: prefixer({
    width: '100%',
    height: '100%',
    margin: '0 auto',
    borderBottom: '1px solid #aaa',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.background,
  }),
  DrawerToggle: {
    iconColor: AppbarTheme.AppbarIcon,
  },
  Toolbar: prefixer({
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  }),
  ToolbarSeparator: prefixer({
    alignSelf: 'center',
    backgroundColor: 'white',
    marginLeft: '0px',
    width: '1.5px'
  }),
  NameField: {
    inputStyle: {
      color: colors.font
    },
    underlineFocusStyle: {
      borderColor: colors.primaryDeep
    }
  },
  text: {
    color: colors.font
  },
  icon: AppbarTheme.AppbarIcon,
  Actions: {
    Wait: {
      size: 30,
      color: colors.primaryDeep
    },
    SaveAs: {
      labelStyle: prefixer({
        textTransform: "none",
        color: colors.primary
      })
    },
    Cancel: {
      labelStyle: prefixer({
        textTransform: "none",
        color: colors.secondary
      })
    },
  },
  TextFieldFocusStyle: (error) => ({
    ...AppbarTheme.TextFieldFocusStyle(error)
  })
}


const Actions = {
  save: "SAVE",
  saveAs: "SAVEAS"
}

export default class Appbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveAsOpen: false,
      saveAsName: '',
      saveAsNameError: '',

      performing: null,
      confirmOpen: false,
      confirmMessage: "Null",
      proceedWithOperation: () => {},
      proceedWithOperationLabel: "Yes",
      proceed: () => {},
      proceedLabel: "No",
      showCloseButton: false,

      total: 0,
      loaded: [],
      percent: 0,
    }

    this.setPerforming = (p) => {
      this.setState({
        performing: p
      });
    }

    this.progresHook = (loadedInfo, total, onFinish=false) => {
      if (onFinish) {
        this.setState({
          loaded: [],
          total: 0,
        })
        return;
      }
      let loaded = this.state.loaded.slice();
      loaded[loadedInfo.index] = loadedInfo.value;

      let percent = loaded.reduce((sum, val) => (sum+val), 0) / total * 100;
      this.setState({
        loaded: loaded,
        total: total,
        percent: (percent > 100) ? 100 : parseInt(percent, 10)
      });
    }

    this.handleSaveAsOpen = () => {
      this.setState({
        saveAsOpen: true,
        saveAsName: this.props.experimentName
      })
    }

    this.handleSaveAsClose = () => {
      this.setState({
        saveAsOpen: false,
        saveAsName: '',
        saveAsNameError: '',
      })
    }

    this.setSaveAsName = (e, n) => {
      this.setState({
        saveAsName: n,
        saveAsNameError: (/\S/.test(n)) ? '' : "New experiment name can't be empty."
      })
    } 

    this.handleConfirmClose = () => {
      this.setState({
        confirmOpen: false
      })
    }

    this.popUpConfirm = (message, proceedWithOperation, proceedWithOperationLabel, proceed, proceedLabel, showCloseButton=true) => {
      this.setState({
        confirmOpen: true,
        confirmMessage: message,
        proceedWithOperation: proceedWithOperation,
        proceedWithOperationLabel: proceedWithOperationLabel,
        proceed: proceed,
        proceedLabel: proceedLabel,
        showCloseButton: showCloseButton
      })
    }
  }

	render() {
    const saveAsCallback = () => {
      if (this.state.saveAsNameError === '') {
        this.props.saveAs(
          this.state.saveAsName,
          () => {
            this.setPerforming(Actions.saveAs);
          }, () => {
            this.setPerforming(null);
          });
      }
      this.handleSaveAsClose();
    }

    let isBundling = this.state.total !== 0;

    const OrangizerToggle = (
      <IconButton 
        onClick={() => {
          if (this.props.drawerOpened) {
            this.props.drawerCloseCallback();
          } else {
            this.props.drawerOpenCallback();
          }
        }}
      >
        <MenuIcon {...style.DrawerToggle.iconColor}/>
      </IconButton>
    );

    const title = (
      <TextField
        {...style.NameField}
        id="Experiment-Name-Textfield"
        value={this.props.experimentName}
        errorText={(/\S/.test(this.props.experimentName)) ? '' : "Experiment name can't be empty."}
        onChange={this.props.changeExperimentName}
      />
    );

    const toolbar = (
      <div className="Appbar-tools" style={style.Toolbar}>
          <InitEditor />

          <MediaManager />

          <ToolbarSeparator style={{...style.ToolbarSeparator}}/>

          <IconButton 
            tooltip="New Experiment"
            onClick={() => { this.props.newExperiment(this.popUpConfirm); }}
            > 
            <New {...style.icon} />
          </IconButton>


          {(this.state.performing === Actions.save) ?
            <CircularProgress {...style.Actions.Wait}/> :
            <IconButton 
              tooltip="Save"
              onClick={() => { this.props.save(()=>{
                this.setPerforming(Actions.save);
              }, () => {
                this.setPerforming(null);
              });}}
            > 
              <Save {...style.icon} />
            </IconButton>
          }
          {(this.state.performing === Actions.saveAs) ?
            <CircularProgress {...style.Actions.Wait}/> :
            <IconButton 
              tooltip="Save As"
              onClick={() => { this.props.saveAsOpen(this.handleSaveAsOpen); }}
              > 
              <SaveAs {...style.icon} />
            </IconButton>
          }

          <ToolbarSeparator style={{...style.ToolbarSeparator}}/>

          {isBundling ?
            <div style={{display:'flex', paddingLeft: 10}}>
              <div style={{paddingTop: 10}}>
                <CircularProgress {...style.Actions.Wait} value={this.state.percent} mode="determinate"/>
              </div>
              <ListItem primaryText={this.state.percent+"%"} disabled={true}/>
            </div>:
          <IconButton
            tooltip="DIY Deploy"
            onClick={() => { 
              this.props.diyDeploy(this.progresHook);
            }}
            >
            <DIYDeploy {...style.icon} />
          </IconButton>
          }

          <CloudDeploymentManager />
      </div>
    )

		return (
      		<div className="Appbar" style={style.Appbar} >
            {OrangizerToggle}
            {title}
            {toolbar}
            <UserMenu />
            <ConfirmationDialog
              open={this.state.confirmOpen}
              message={this.state.confirmMessage}
              handleClose={this.handleConfirmClose}
              proceedWithOperation={this.state.proceedWithOperation}
              proceedWithOperationLabel={this.state.proceedWithOperationLabel}
              proceed={this.state.proceed}
              proceedLabel={this.state.proceedLabel}
              showCloseButton={this.state.showCloseButton}
            />

            <Dialog
              open={this.state.saveAsOpen}
              onRequestClose={this.handleSaveAsClose}
              titleStyle={{padding: 12}}
              title={renderDialogTitle(<Subheader></Subheader>, this.handleSaveAsClose, null, {}, false)}
              contentStyle={{width: 450, height: 300, padding: 0}}
              bodyStyle={{backgroundColor: colors.dialogBodyColor}}
              actions={[
                <FlatButton
                  {...style.Actions.SaveAs}
                  label="Save As"
                  onClick={saveAsCallback}
                />,
                <FlatButton
                  {...style.Actions.Cancel}
                  label="Cancel"
                  onClick={this.handleSaveAsClose}
                />
              ]}
            >
            <div style={{width: 400, margin: 'auto'}}
              onKeyPress={(e)=>{
                if (e.which === 13) {
                  saveAsCallback();
                }
               }}
            >
              <TextField
                {...style.TextFieldFocusStyle(this.state.saveAsNameError !== '')}
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
