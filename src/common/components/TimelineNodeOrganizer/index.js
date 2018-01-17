import React from 'react';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial';

import ContentAdd from 'material-ui/svg-icons/content/add';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NewTimelineIcon from 'material-ui/svg-icons/av/playlist-add';
import NewTrialIcon from 'material-ui/svg-icons/action/note-add';
import Delete from 'material-ui/svg-icons/action/delete';
import Duplicate from 'material-ui/svg-icons/content/content-copy';

import CloseDrawerHandle from 'material-ui/svg-icons/navigation/chevron-left';
import OpenDrawer from 'material-ui/svg-icons/navigation/chevron-right';

import SortableTreeMenu from '../../containers/TimelineNodeOrganizer/SortableTreeMenu';

import GeneralTheme from '../theme.js';
import './TimelineNodeOrganizer.css';

export const TREE_MENU_INDENT = 20;

export const WIDTH = 285;

const colors = GeneralTheme.colors;

const avatarStyle = {
	backgroundColor: colors.secondaryDeep
}

class TimelineNodeOrganizer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div className="TimelineNode-Organizer"
			 style={{
			 	width: (this.props.open) ? `${WIDTH}px` : "0px",
			 	flexBasis: 'auto',
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
					<SpeedDial
						  hasBackdrop={false}
						  style={{
						  	zIndex: 15,
						  	position: 'absolute',
						  }}
						  floatingActionButtonProps={{
						  	backgroundColor: colors.secondary,
						  }}
					      icon={<ContentAdd />}
					      iconOpen={<NavigationClose />}
					    >
						   <BubbleList>
							     <BubbleListItem
							        primaryText="New Timeline"
							        rightAvatar={
							        	<Avatar
								          icon={<NewTimelineIcon />}
								          {...avatarStyle}
								          size={30}
								        />
							        }
							        onClick={this.props.insertTimeline}
							      />
							      <BubbleListItem
							        primaryText="New Trial"
							        rightAvatar={
							        	<Avatar
								          icon={<NewTrialIcon />}
								          {...avatarStyle}
								          size={30}
								        />
							        }
							        onClick={this.props.insertTrial}
							      />
							      <BubbleListItem
							        primaryText="Delete"
							        rightAvatar={
							        	<Avatar
								          icon={<Delete />}
								          {...avatarStyle}
								          size={30}
								        />
							        }
							        onClick={this.props.deleteSelected}
							      />
							      <BubbleListItem
							        primaryText="Duplicate"
							        rightAvatar={
							        	<Avatar
								          icon={<Duplicate />}
								          {...avatarStyle}
								          size={30}
								        />
							        }
							        onClick={this.props.duplicateNode}
							      />
						      </BubbleList>
					</SpeedDial>
				</div>: null}
			</div>
  		</div>
  			)
	}
}


export default TimelineNodeOrganizer;
