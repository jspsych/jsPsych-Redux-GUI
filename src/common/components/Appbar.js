import React from 'react';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { GridTile } from 'material-ui/GridList';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import {
	grey50,
	grey900,
	cyan500
} from 'material-ui/styles/colors';
import OpenDrawer from 'material-ui/svg-icons/hardware/device-hub';


var experimentTitleStyle = {
	color: grey900,
	fontSize: 18,
	fontFamily: 'Roboto',
}


class Appbar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<MuiThemeProvider>
        			<div className="Appbar" style={{width: "100%", margin: '0 auto', display: 'flex', height: "20%", paddingBottom: 0}}>
  						<div style={{display: 'inline-block', minWidth:"6vw", width: "7%"}}>
  						<GridTile style={{height: 90, backgroundColor: cyan500}}>
  							<img draggable={false} src='./jsPsych/jspsych-logo-readme.jpg'/>
  							</GridTile>
  						</div>
        				<div className="Appbar-main" style={{display: 'inline-block', width:"93%"}}>
        					<div style={{backgroundColor: 'white', marginLeft: 5}}>
								<TextField value="Untitled Experiment" />
							</div>
  							<Toolbar style={{height: 40}}>
  							</Toolbar>
  						</div>
  					</div>
		   </MuiThemeProvider>
		   )
	}

}

export default Appbar;

