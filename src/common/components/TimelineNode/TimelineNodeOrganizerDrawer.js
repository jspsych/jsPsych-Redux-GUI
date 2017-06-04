import React from 'react';
import Draggable from 'react-draggable';
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
	pink500 as CloseDrawerHoverColor
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
			<div className="Timeline-Organizer"
				 style={{width: convertPercent(this.props.width), 
						left: '0px',
						height: '100vh', 
						display: 'flex',
				}}>
				<div className="Timeline-Organizer-Container"
					style={{height: '100vh', width: '100%'}}>
					{(this.props.open) ? 
					<div className="Timeline-Organizer-Content">
						<div style={{display: 'flex'}}>
							<Subheader>Timeline Organizer</Subheader>
								<IconButton 
		  							hoveredStyle={{backgroundColor: grey400}}
									disableTouchRipple={true}
									onTouchTap={this.props.toggleTimelineOrganizerDrawer}
									>
									<CloseDrawer hoverColor={CloseDrawerHoverColor}/>
								</IconButton> 
						</div>
						<Divider />
						<MenuItem primaryText="Maps" leftIcon={<OpenDrawer />} onTouchTap={this.props.openTimelineEditorCallback}/>
						<MenuItem primaryText="Maps" onTouchTap={this.props.openTimelineEditorCallback}/>
						<MenuItem primaryText="Maps" onTouchTap={this.props.openTimelineEditorCallback}/>
						<MenuItem primaryText="Maps" onTouchTap={this.props.openTimelineEditorCallback}/>
					</div>: null}
				</div>
				<Draggable
			        axis="x"
			        handle=".Timeline-Organizer-Dragger"
			        grid={[2, 0]}
			        zIndex={100}
			        position={this.props.width}
			        onStart={this.props.onDragStart}
			        onDrag={this.props.onDrag}
			        onStop={this.props.onDragEnd}
			        >
  				<div 	className="Timeline-Organizer-Dragger"
  						style={{backgroundColor: 'black',
							   height:'100%',
							   float: 'right',
							   width: '3px',
							   cursor: 'col-resize',
  							}}
  						/>
  				</Draggable>
  				{(this.props.width > 0) ? null :
  					<IconButton 
  						className="Timeline-Organizer-Handle"
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
  				}}><OpenDrawer /></IconButton>}
  			</div>
  			</MuiThemeProvider>
  			)
	}
}

export default TimelineNodeOrganizerDrawer;