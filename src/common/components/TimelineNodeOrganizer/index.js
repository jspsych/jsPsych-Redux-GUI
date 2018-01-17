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

import SortableTreeMenu from '../../containers/TimelineNodeOrganizer/SortableTreeMenu';

import GeneralTheme from '../theme.js';
import './TimelineNodeOrganizer.css';

export const TREE_MENU_INDENT = 20;


const colors = GeneralTheme.colors;

class TimelineNodeOrganizer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="TimelineNode-Organizer"
				 style={{
				 	width: (this.props.open) ? '285px' : "0px",
					'WebkitTransition': 'all 0.4s ease',
					'MozTransition': 'all 0.4s ease',
					transition: 'all 0.4s ease',
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
								<SpeedDial
								  style={{
								  	zIndex: 15,
									float: 'right',
									paddingRight: '10px',
								  }}
								  fabProps={{backgroundColor: colors.primary}}
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
							        fabContent={<NewTrialIcon />}
							        onTouchTap={this.props.insertTrial}
							      />
							      <SpeedDialItem
							        label="Delete"
							        fabContent={<Delete />}
							        onTouchTap={this.props.deleteSelected}
							      />
							      <SpeedDialItem
							        label="Duplicate"
							        fabContent={<Duplicate />}
							        onTouchTap={this.props.duplicateNode}
							      />
							    </SpeedDial>
					    </div>
					</div>: null}
				</div>
  			</div>
  			)
	}
}


export default TimelineNodeOrganizer;
