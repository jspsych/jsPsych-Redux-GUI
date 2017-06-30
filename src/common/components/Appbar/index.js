import React from 'react';
// import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { GridTile } from 'material-ui/GridList';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'; // , ToolbarSeparator, ToolbarTitle
import Snackbar from 'material-ui/Snackbar';

import {
  cyan500 as hoverColor,
  green500 as successColor,
  pink500 as failColor
} from 'material-ui/styles/colors';

import InitEditor from '../../containers/Appbar/jsPsychInitEditor';
import UserMenu from '../../containers/Appbar/UserMenu';
import Save from 'material-ui/svg-icons/content/save';
import Done from 'material-ui/svg-icons/action/check-circle';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

export default class Appbar extends React.Component {
  state = {
    snackBarOpen: false,
    snackBarSuccess: false,
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
  								onChange={this.props.changeExperimentName}
                  />
							</div>
  							<Toolbar style={{height: 40, backgroundColor: 'white'}}>
                  <ToolbarGroup firstChild={true}>
                    <InitEditor />
                    <IconButton onTouchTap={() => { this.props.save(this.handleOpenSnackBar); }}> 
                      <Save hoverColor={hoverColor} />
                    </IconButton>
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
  					</div>
		   )
	}

}
