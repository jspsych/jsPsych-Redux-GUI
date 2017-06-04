import React from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import CloseDrawer from 'material-ui/svg-icons/navigation/arrow-forward';
import OpenDrawer from 'material-ui/svg-icons/navigation/chevron-left';
import {
	grey200,
	grey400,
	cyan500,
} from 'material-ui/styles/colors';

const visibilityString = (flag) => ((flag) ? 'visible' : 'hidden');

class TimelineNodeOrganizerDrawer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<MuiThemeProvider>		
			<div style={{width: (this.props.open) ? '20%': '0%', 
						right: '0px',
						height: '100vh', 
						display: 'flex',
						'-webkit-transition': 'all 0.4s ease',
						'-moz-transition': 'all 0.4s ease',
						transition: 'all 0.4s ease',
						}}>
				<div style={{backgroundColor: 'black',
					   height:'100%',
					   float: 'left',
					   width: '3px',
						}}
					draggable={false}
				/>
				<div style={{height: '100vh', width: '100%', visibility: visibilityString(this.props.open)}}>
					<div style={{display: 'flex'}}>
						<IconButton 
						disableTouchRipple={true}
						onTouchTap={this.props.toggleTimelineEditorCallback}
						>{(this.props.open) ? <CloseDrawer hoverColor={cyan500}/> : null}</IconButton>
						<Subheader>Timeline/Trial Editor</Subheader>
					</div>
					<Divider />
					<MenuItem primaryText="Maps" />
				</div>
  				{(this.props.open) ? null :
  					<IconButton 
  						tooltip="Open Timeline/Trial Editor"
  						hoveredStyle={{
  							backgroundColor: grey400,
  						}}
  						onTouchTap={this.props.toggleTimelineEditorCallback}
  						tooltipPosition="bottom-left"
  						style={{
	  					position: 'fixed',
	  					right: 0,
	  					top: '50%',
	  					width: 25,
	  					backgroundColor: grey200,
	  					padding: '12px 0',
	  					zIndex: 1,
  				}}><OpenDrawer /></IconButton>}
  			</div>
  			</MuiThemeProvider>
  			)
	}
}
// 
export default TimelineNodeOrganizerDrawer;