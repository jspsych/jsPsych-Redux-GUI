import React from 'react';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { GridTile } from 'material-ui/GridList';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import {
	grey50,
	grey900 as deepGrey,
	cyan500 as iconHighlightColor
} from 'material-ui/styles/colors';
import InitSettingIcon from 'material-ui/svg-icons/action/settings';

var experimentTitleStyle = {
	color: deepGrey,
	fontSize: 18,
	fontFamily: 'Roboto',
}


export default class Appbar extends React.Component {
	constructor(props) {
		super(props);

    this.state = {
      initEditPaneOpen: false,
    }

    this.toggleInitEditPane = (flag=null) => {
      if (flag !== null) {
        this.setState({
          initEditPaneOpen: flag,
        });
      } else {
        this.setState({
          initEditPaneOpen: !this.state.initEditPaneOpen,
        });
      }
    }
	}

	render() {
		return (
			<MuiThemeProvider>
        			<div className="Appbar" 
        				style={{
        					width: "100%",
        					margin: '0 auto',
        					display: 'flex',
        					height: "100%",
        					paddingBottom: 0
        				}}
        				draggable={false}
        				>
  						<div style={{
                minWidth:"6vw", 
                width: "7%",
              }}>
    						<GridTile style={{ height: 88 }}>
    							<img draggable={false} src='./jsPsych/jspsych-logo-readme.jpg'/>
    						</GridTile>
  						</div>
        			<div className="Appbar-main" style={{
                display: 'inline-block', width:"93%"
              }}>
        			<div style={{
                    backgroundColor: 'white', 
                    marginLeft: 5
                  }}>
								<TextField 
								id="ExperimentNameTextfield"
                value={this.props.experimentName}
								onChange={this.props.changeExperimentName}/>
							</div>
  							<Toolbar style={{height: 40}}>
                  <ToolbarGroup firstChild={true}>
                    <IconButton 
                        tooltip="Click to set jsPsych.init properties"
                        onTouchTap={() => { this.toggleInitEditPane(); }}
                    >
                        <InitSettingIcon 
                          color={(this.state.initEditPaneOpen) ? iconHighlightColor : deepGrey}
                          hoverColor={iconHighlightColor}
                        />
                    </IconButton>
                  </ToolbarGroup>
  							</Toolbar>
  						</div>
  					</div>
		   </MuiThemeProvider>
		   )
	}

}


