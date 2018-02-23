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

import GeneralTheme, { prefixer } from '../theme.js';

export const TREE_MENU_INDENT = 20;

export const WIDTH = 285;

const colors = GeneralTheme.colors;

const duration = 400;

const style = {
	TimelineNodeOrganizer: (open) => (prefixer({
		width: (open) ? `${WIDTH}px` : "0px",
		flexBasis: 'auto',
		flexShrink: 0,
		'WebkitTransition': `all ${duration}ms ease`,
		'MozTransition': `all ${duration}ms ease`,
		transition: `all ${duration}ms ease`,
		height: '100%',
		display: 'flex',
		overflow: 'hidden',
		flexDirection: 'row',
		backgroundColor: colors.background
	})),
	TimelineNodeOrganizerContainer: prefixer({
		height: '100%',
		width: '100%',
		position: 'relative',
		flexGrow: '1',
	}),
	TimelineNodeOrganizerContent: prefixer({
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'column-reverse'
	}),
	TimelineNodeSheet: prefixer({
		overflow: 'auto',
		flexGrow: 1,
		maxWidth: '100%',
		paddingLeft: '0px',
		width: '100%',
		position: 'relative'
	}),
	SpeedDial: {
		FloatingActionButton: {
			backgroundColor: colors.primary,
		},
		AvatarStyle: {
			backgroundColor: colors.primaryDeep
		}
	},
}


class TimelineNodeOrganizer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isSpeedDialOpen: false
		}

		this.handleToogleSpeedDialOpen = () => {
			this.setState({
				isSpeedDialOpen: !this.state.isSpeedDialOpen,
			});
		}

		this.handleChangeSpeedDial = ({ isOpen }) => {
			this.setState({
				isSpeedDialOpen: isOpen,
			});
		}
	}

	render() {
		return (
		<div className="TimelineNode-Organizer" style={style.TimelineNodeOrganizer(this.props.open)}>
				<div className="TimelineNode-Organizer-Container" style={style.TimelineNodeOrganizerContainer}>
					{(this.props.open) ?
					<div className="TimelineNode-Organizer-Content" style={style.TimelineNodeOrganizerContent}>
					<div className="TimelineNode-Sheet" style={style.TimelineNodeSheet}>
						<SortableTreeMenu
							openTimelineEditorCallback={this.props.openTimelineEditorCallback}
							closeTimelineEditorCallback={this.props.closeTimelineEditorCallback}
						/>
					</div>
					<SpeedDial
						  isOpen={this.state.isSpeedDialOpen} 
						  onChange={this.handleChangeSpeedDial}
						  hasBackdrop={false}
						  style={{
						  	zIndex: 15,
						  	position: 'absolute',
						  }}
						  floatingActionButtonProps={{
						  	...style.SpeedDial.FloatingActionButton
						  }}
					    >
						   <BubbleList>
							     <BubbleListItem
							        primaryText="New Timeline"
							        rightAvatar={
							        	<Avatar
								          icon={<NewTimelineIcon />}
								          {...style.SpeedDial.AvatarStyle}
								          size={30}
								        />
							        }
							        onClick={() => { this.handleToogleSpeedDialOpen(); this.props.insertTimeline(); }}
							      />
							      <BubbleListItem
							        primaryText="New Trial"
							        rightAvatar={
							        	<Avatar
								          icon={<NewTrialIcon />}
								          {...style.SpeedDial.AvatarStyle}
								          size={30}
								        />
							        }
							        onClick={() => { this.handleToogleSpeedDialOpen(); this.props.insertTrial(); }}
							      />
							      <BubbleListItem
							        primaryText="Delete"
							        rightAvatar={
							        	<Avatar
								          icon={<Delete />}
								          {...style.SpeedDial.AvatarStyle}
								          size={30}
								        />
							        }
							        onClick={() => { this.handleToogleSpeedDialOpen(); this.props.deleteSelected(); }}
							      />
							      <BubbleListItem
							        primaryText="Duplicate"
							        rightAvatar={
							        	<Avatar
								          icon={<Duplicate />}
								          {...style.SpeedDial.AvatarStyle}
								          size={30}
								        />
							        }
							        onClick={() => { this.handleToogleSpeedDialOpen(); this.props.duplicateNode(); }}
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
