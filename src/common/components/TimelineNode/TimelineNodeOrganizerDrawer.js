import React from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import CloseDrawer from 'material-ui/svg-icons/navigation/close';
import OpenDrawer from 'material-ui/svg-icons/navigation/chevron-right';
import {
	grey200,
	grey400,
	pink500,
} from 'material-ui/styles/colors';

const visibilityString = (flag) => ((flag) ? 'visible' : 'hidden');

const convertPercent = (number) => (number + '%'); 

class TimelineNodeOrganizerDrawer extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<MuiThemeProvider>
			<div id="timelineOrganizerDrawer" 
				style={{width: convertPercent(this.props.width), 
						left: '0px',
						height: '100vh', 
						display: 'flex',
						}}>
				<div style={{height: '100vh', width: '100%', visibility: visibilityString(this.props.open)}}>
					<div style={{display: 'flex'}}>
						<Subheader>Timeline Organizer</Subheader>
						<IconButton 
						disableTouchRipple={true}
						onTouchTap={this.props.toggleTimelineOrganizerDrawer}
						>{(this.props.open) ? <CloseDrawer hoverColor={pink500}/> : null}</IconButton>
					</div>
					<Divider />
					<MenuItem primaryText="Maps" />
				</div>
  				<div 	style={{backgroundColor: 'black',
							   height:'100%',
							   float: 'right',
							   width: '3px',
							   cursor: 'col-resize',
  							}}
  						draggable={true}	
  						onDrag={this.props.onDrag}
  						onDragEnd={this.props.onDragEnd}
  						/>
  				{(this.props.width > 0) ? null :
  					<IconButton 
  						tooltip="Open Timeline Organizer"
  						hoveredStyle={{
  							backgroundColor: grey400,
  						}}
  						onTouchTap={this.props.toggleTimelineOrganizerDrawer}
  						tooltipPosition="bottom-right"
  						style={{
	  					position: 'fixed',
	  					left: 0,
	  					top: '50%',
	  					width: 25,
	  					backgroundColor: grey200,
	  					padding: '12px 0',
	  					zIndex: 1,
  				}}><OpenDrawer /></IconButton>
  			}
  			</div>

  			
  			</MuiThemeProvider>
  			)
	}
}
// 
export default TimelineNodeOrganizerDrawer;