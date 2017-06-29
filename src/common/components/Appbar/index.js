import React from 'react';
// import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { GridTile } from 'material-ui/GridList';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'; // , ToolbarSeparator, ToolbarTitle

import {
	// grey900 as deepGrey,
} from 'material-ui/styles/colors';

import InitEditor from '../../containers/Appbar/jsPsychInitEditor';
import UserMenu from '../../containers/Appbar/UserMenu';
import MediaManager from '../../containers/Appbar/MediaManager';

import Save from 'material-ui/svg-icons/content/save';

import { save as saveToDynamoDB } from '../../backend/dynamoDB'

export default class Appbar extends React.Component {

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
                    <IconButton onTouchTap={() => { saveToDynamoDB(this.props.state); }}>
                      <Save />
                    </IconButton>
										<MediaManager />
                  </ToolbarGroup>
  							</Toolbar>
  						</div>
  					</div>
		   )
	}

}
