import React from 'react';
import Draggable from 'react-draggable';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import { SpeedDial, SpeedDialItem } from 'react-mui-speeddial';

import ContentAdd from 'material-ui/svg-icons/content/add';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NewTimelineIcon from 'material-ui/svg-icons/av/playlist-add';
import NewTrialIcon from 'material-ui/svg-icons/action/note-add';
import Delete from 'material-ui/svg-icons/action/delete';
import Duplicate from 'material-ui/svg-icons/content/content-copy';

import CloseDrawerHandle from 'material-ui/svg-icons/navigation/chevron-left';
import OpenDrawer from 'material-ui/svg-icons/navigation/chevron-right';
import {
	grey300 as popDrawerColor,
	grey400 as DrawerHandleColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

import { convertPercent } from '../App';
import SortableTreeMenu from '../../containers/TimelineNodeOrganizer/SortableTreeMenu';

import './TimelineNodeOrganizer.css';

export const TREE_MENU_INDENT = 20;

const MIN_WIDTH = 20;
const MAX_WIDTH = 40;

const enableAnimation = (flag) => ((flag) ? 'none' : 'all 0.4s ease');

const getWidthFromDragging = (e) => {
	let percent = (e.pageX / window.innerWidth) * 100;
	if (percent < MIN_WIDTH) percent = MIN_WIDTH;
	if (percent > MAX_WIDTH) percent = MAX_WIDTH;
	return percent;
}

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

class TimelineNodeOrganizer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dragging: false,
		}

		this.onDragStart = (e) => {
			this.setState({
				dragging: true,
			});
		}

		this.onDragEnd = (e) => {
			this.setState({
				dragging: false,
			});
		}

		this.onDrag = (e) => {
			this.props.setWidthCallback(getWidthFromDragging(e));
			pauseEvent(e)
		}

	}


	render() {
		return (
			<div className="TimelineNode-Organizer"
				 style={{width: (this.props.open) ? convertPercent(this.props.width) : "0%",
						'WebkitTransition': enableAnimation(this.state.dragging),
						'MozTransition': enableAnimation(this.state.dragging),
						transition: enableAnimation(this.state.dragging),
				}}>
				<div className="TimelineNode-Organizer-Container" >
					{(this.props.open) ?
					<div className="TimelineNode-Organizer-Content">
						<div className="TimelineNode-Sheet">
							<SortableTreeMenu
								openTimelineEditorCallback={this.props.openTimelineEditorCallback}
								closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
							/>
						</div>
						<div className="TimelineNode-Button-Container">
							<div className="TimelineNode-Button">
								<SpeedDial
							      fabContentOpen={<ContentAdd />}
							      fabContentClose={<NavigationClose />}
							    >
							      <SpeedDialItem
							        label="New Timeline"
							        fabContent={<NewTimelineIcon />}
							        onTouchTap={this.props.insertTimeline}
							      />
							      <SpeedDialItem
							        label="New Trial"
							        fabContent={<NewTrialIcon/>}
							        onTouchTap={this.props.insertTrial}
							      />
							      <SpeedDialItem
							        label="Delete"
							        fabContent={<Delete/>}
							        onTouchTap={this.props.deleteSelected}
							      />
							      <SpeedDialItem
							        label="Duplicate"
							        fabContent={<Duplicate/>}
							        onTouchTap={this.props.duplicateNode}
							      />
							    </SpeedDial>
							</div>
					    </div>
					</div>: null}
				</div>

				<Draggable
			        axis="x"
			        handle=".TimelineNode-Organizer-Dragger"
			        zIndex={10}
			        position={{x: this.props.width}}
			        onStart={this.onDragStart}
			        onDrag={this.onDrag}
			        onStop={this.onDragEnd}
			        >
	  				<div className="TimelineNode-Organizer-Dragger"
	  					style={{left: convertPercent(this.props.width-0.3),}}>
	  						<div className="TimelineNode-Organizer-Close-Handle-Container">
		  						<IconButton
		  							className="TimelineNode-Organizer-Close-Handle"
		  							tooltip="Close"
		  							tooltipPosition="bottom-right"
		  							hoveredStyle={{
		  								left: -28,
			  							width: 26.5,
		  								backgroundColor: CloseBackHighlightColor
		  							}}
		  							style={{
			  							left: -22,
			  							width: 25,
		  							}}
		  							iconStyle={{
					  					margin:"0px 0px 0px -8px"
		  							}}
		  							disableTouchRipple={true}
									onTouchTap={this.props.closeCallback}
		  							>
		  							<CloseDrawerHandle />
		  						</IconButton>
		  					</div>
  					</div>
  				</Draggable>
  				{(this.props.open) ? 
  					null :
  					<IconButton
  						className="TimelineNode-Organizer-Handle"
  						tooltip="Open Timeline/Trial Organizer"
  						hoveredStyle={{
  							backgroundColor: DrawerHandleColor,
  							left: 0,
  						}}
  						onTouchTap={this.props.openCallback}
  						tooltipPosition="bottom-right"
  						style={{
		  					position: 'fixed',
		  					left: -8,
		  					top: '50%',
		  					width: '25px',
		  					backgroundColor: popDrawerColor,
		  					padding: '12px 0',
		  					zIndex: 1,
  						}}
  					>
  						<OpenDrawer />
  					</IconButton>}
  			</div>
  			)
	}
}


export default TimelineNodeOrganizer;
