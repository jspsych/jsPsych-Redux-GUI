import React from 'react';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import CloseDrawer from 'material-ui/svg-icons/navigation/arrow-back';

const visibilityString = (flag) => ((flag) ? 'visible' : 'hidden');


class TimelineNodeOrganizerDrawer extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<MuiThemeProvider>
			<nav id="timelineOrganizerDrawer" 
				style={{width: this.props.width, 
						left: '0px',
						height: '100vh', 
						display: 'flex',
						}}>
				<div style={{height: '100vh', width: '100%', visibility: visibilityString(this.props.open)}}>
					<Subheader>Timeline Organizer</Subheader>
					<Divider />
					<MenuItem primaryText="Maps" />
				</div>
  				<div 	id="dragbar"
  						draggable={true}	
  						onDrag={this.props.onDrag}
  						onDragEnd={this.props.onDragEnd}
  						/>
  			</nav>
  			</MuiThemeProvider>
  			)
	}
}
// 
export default TimelineNodeOrganizerDrawer;