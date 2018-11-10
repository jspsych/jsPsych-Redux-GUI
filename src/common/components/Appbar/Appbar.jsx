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
import DIYDeploymentManager from '../../containers/Appbar/DIYDeploymentManager';

import { DialogTitle, EditorTextField } from '../gadgets';

import AppbarTheme from './theme.js';

const colors = {
  ...AppbarTheme.colors,
  dialogBodyColor: '#F5F5F5'
}

const style = {
  Appbar: utils.prefixer({
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
  Toolbar: utils.prefixer({
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  }),
  ToolbarSeparator: utils.prefixer({
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
      labelStyle: utils.prefixer({
        textTransform: "none",
        color: colors.primary
      })
    },
    Cancel: {
      labelStyle: utils.prefixer({
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
      saveAsWindowOpen: false,
      newExperimentName: '',
      newExperimentNameErrorText: '',

      experimentName: this.props.experimentName,

      saving: false,
      isSignedIn: false
    }

    this.handleSave = () => {
      this.setState({
        saving: true
      });
      this.props.clickSave().finally(() => {
        this.setState({
          saving: false
        })
      })
    }

    this.handleSaveAsWindowOpen = () => {
      utils.commonFlows.isUserSignedIn().then((signedIn) => {
        if (signedIn) {
          this.setState({
            saveAsWindowOpen: true,
            newExperimentName: this.props.experimentName,
            newExperimentNameErrorText: '',
          })
        } else {
          utils.notifications.notifyWarningBySnackbar({
            dispatch: this.props.dispatch,
            message: 'You need to sign in before saving your work !'
          });
        }
      });
    }

    this.handleSaveAsWindowClose = () => {
      this.setState({
        saveAsWindowOpen: false,
        newExperimentName: '',
        newExperimentNameErrorText: '',
      })
    }

    this.handleSaveAs = () => {
      this.setState({
        savingAs: true
      });
      this.props.clickSaveAs({
        newName: this.state.newExperimentName
      }).then(() => {
        this.handleSaveAsWindowClose();
      }).finally(() => {
        this.setState({
          savingAs: false
        });
      });
    }

    this.setSaveAsName = (e, n) => {
      this.setState({
        newExperimentName: n,
        newExperimentNameErrorText: (/\S/.test(n)) ? '' : "New experiment name can't be empty."
      })
    } 
  }

  render() {
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

    const Experiment_Title = (
      <EditorTextField
        value={this.props.experimentName}
        onCommit={this.props.changeExperimentName}
        {...style.NameField}
        errorText={(/\S/.test(this.props.experimentName)) ? '' : "Experiment name can't be empty."}
      />
    );

    const Experiment_Toolbar = (
      <div className="Appbar-tools" style={style.Toolbar}>
          <InitEditor />

          <MediaManager />

          <ToolbarSeparator style={{...style.ToolbarSeparator}}/>

          <IconButton 
            tooltip="New Experiment"
            onClick={this.props.clickNewExperiment}
            > 
            <New {...style.icon} />
          </IconButton>


          {this.state.saving ?
            <CircularProgress {...style.Actions.Wait}/> :
            <IconButton 
              tooltip="Save"
              onClick={this.handleSave}
            > 
              <Save {...style.icon} />
            </IconButton>
          }

          <IconButton 
            tooltip="Save As"
            onClick={this.handleSaveAsWindowOpen}
            > 
            <SaveAs {...style.icon} />
          </IconButton>

          <ToolbarSeparator style={{...style.ToolbarSeparator}}/>

          <DIYDeploymentManager />

          <CloudDeploymentManager openProfilePage={this.openProfilePage} />
      </div>
    )

    const SaveAs_Window = (
        <Dialog
            open={this.state.saveAsWindowOpen}
            modal
            titleStyle={{padding: 12}}
            title={
              <DialogTitle
                node={<Subheader></Subheader>}
                closeCallback={this.handleSaveAsWindowClose}
                showCloseButton={false}
              />
            }
            contentStyle={{width: 450, height: 300, padding: 0}}
            bodyStyle={{backgroundColor: colors.dialogBodyColor}}
            actions={[
              this.state.savingAs ?
              <CircularProgress {...style.Actions.Wait}/> :
              <FlatButton
                {...style.Actions.SaveAs}
                label="Save As"
                onClick={this.handleSaveAs}
              />,
              <FlatButton
                {...style.Actions.Cancel}
                label="Cancel"
                disabled={this.state.savingAs}
                onClick={this.handleSaveAsWindowClose}
              />
            ]}
          >
          <div style={{width: 400, margin: 'auto'}}
            onKeyPress={(e)=>{
              if (e.which === 13) {
                this.handleSaveAs();
              }
             }}
          >
            <TextField
              {...style.TextFieldFocusStyle(!!this.state.newExperimentNameErrorText)}
              id="Save-as-new-experiment-name"
              floatingLabelFixed
              floatingLabelText="New experiment name"
              value={this.state.newExperimentName}
              errorText={this.state.newExperimentNameErrorText}
              onChange={this.setSaveAsName}
              fullWidth
            />
          </div>
      </Dialog>
    )

    return (
          <div className="Appbar" style={style.Appbar} >
            {OrangizerToggle}
            {Experiment_Title}
            {Experiment_Toolbar}
            <UserMenu openProfilePage={el => this.openProfilePage = el}/>
            {SaveAs_Window}
        </div>
       )
  }

}
