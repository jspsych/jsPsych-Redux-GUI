import React from 'react';
import Draggable from 'react-draggable';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import CloseDrawer from 'material-ui/svg-icons/navigation/close';
import OpenDrawer from 'material-ui/svg-icons/navigation/chevron-right';
import {
	grey200,
	grey400 as DrawerHandleColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

const convertPercent = (number) => (number + '%'); 

class TimelineNodeOrganizerDrawer extends React.Component {
	render() {
		return (
			<MuiThemeProvider>
			<div className="TimelineNode-Organizer"
				 style={{width: convertPercent(this.props.width), 
						left: '0px',
						height: '100vh', 
						display: 'flex',
						'WebkitTransition': this.props.animation,
						'MozTransition': this.props.animation,
						transition: this.props.animation,
				}}>
				<div className="TimelineNode-Organizer-Container"
					style={{height: '100vh', width: '100%'}}>
					{(this.props.open) ? 
					<div className="TimelineNode-Organizer-Content">
						<div style={{display: 'flex'}}>
							<Subheader>Timeline/Trial Organizer</Subheader>
								<IconButton 
		  							hoveredStyle={{backgroundColor: CloseBackHighlightColor}}
									disableTouchRipple={true}
									onTouchTap={this.props.closeTimelineOrganizerDrawer}
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
			        handle=".TimelineNode-Organizer-Dragger"
			        zIndex={100}
			        position={this.props.width}
			        onStart={this.props.onDragStart}
			        onDrag={this.props.onDrag}
			        onStop={this.props.onDragEnd}
			        >
  				<div 	className="TimelineNode-Organizer-Dragger"
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
  						className="TimelineNode-Organizer-Handle"
  						tooltip="Open Timeline/Trial Organizer"
  						hoveredStyle={{
  							backgroundColor: DrawerHandleColor,
  							left: 0,
  						}}
  						onTouchTap={this.props.openTimelineOrganizerDrawer}
  						tooltipPosition="bottom-right"
  						style={{
	  					position: 'fixed',
	  					left: -8,
	  					top: '50%',
	  					width: 25,
	  					backgroundColor: grey200,
	  					padding: '12px 0',
	  					zIndex: 1,
  						}}
  					><OpenDrawer /></IconButton>}
  			</div>
  			</MuiThemeProvider>
  			)
	}
}

export default TimelineNodeOrganizerDrawer;