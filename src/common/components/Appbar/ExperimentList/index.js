import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Close from 'material-ui/svg-icons/navigation/close';
import Delete from 'material-ui/svg-icons/action/delete';
import Duplicate from 'material-ui/svg-icons/content/content-copy';
import ExperimentIcon from 'material-ui/svg-icons/action/assignment';

import {
	grey100 as dialogBodyColor,
	indigo500 as hoverColor,
	cyan500 as selectedColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor,
	pink500 as iconColor,
	indigo200 as avatarColor,
} from 'material-ui/styles/colors';

const iconButtonElement = (
	<IconButton
	    touch={true}
	    tooltip="more"
	    tooltipPosition="bottom-left"
	  >
	  <MoreVertIcon hoverColor={hoverColor} />
	</IconButton>
) 

export default class ExperimentList extends React.Component {
	state = {
		selected: null,
	}

	setSeletected = (id) => {
		this.setState({
			selected: (this.state.selected === id) ? null : id
		});
	}

	renderIconMenu = (id) => {
		return (
			<IconMenu iconButtonElement={iconButtonElement}>
			    <MenuItem
			    	 rightIcon={<Duplicate hoverColor={hoverColor} color={iconColor}/>}
			    >
			    	Duplicate
			    </MenuItem>
			    <MenuItem
			    	rightIcon={<Delete hoverColor={hoverColor} color={iconColor}/>}
			    >
			    	Delete
			    </MenuItem>
			</IconMenu>
		)
	}

	renderItem = (item) => {
		let { name, id } = item;
		return (
			<div key={id+'-ExperimentItem-Container'}>
				<ListItem
					style={{backgroundColor: (id === this.state.selected) ? selectedColor : null}}
					key={id}
					id={id}
					primaryText={name}
					onTouchTap={()=>{this.setSeletected(id);}}
					rightIconButton={
						this.renderIconMenu(id)
					}
					leftAvatar={
						<Avatar backgroundColor={avatarColor} icon={<ExperimentIcon hoverColor={hoverColor}/>} />
					}
				/>
				<Divider inset={true} />
			</div>
		)
	}

	render() {
		// let { open } = this.state;
		let { renderItem } = this;
		let { open, handleClose, experiments } = this.props;
		const actions = [
			<FlatButton
					label="Open Experiment"
					primary={true}
        			keyboardFocused={true}
					onTouchTap={() => { this.props.pullExperiment(this.state.selected); }}
			/>
		]

		return (
		<div className="Experiment List">
			<Dialog
				open={open}
				titleStyle={{padding: 0,}}
				title={
					<div style={{display: 'flex'}}>
	          			<Subheader style={{fontSize: 24, color: hoverColor}}>Experiment Repository</Subheader>
	          			<IconButton 
	          				hoveredStyle={{
	          					backgroundColor: CloseBackHighlightColor,
	          				}}
	          				onTouchTap={handleClose}
							disableTouchRipple={true}
						>
						<Close hoverColor={CloseDrawerHoverColor} />
						</IconButton>
					</div>
				}
				onRequestClose={handleClose}
				bodyStyle={{backgroundColor: dialogBodyColor}}
				autoScrollBodyContent={true}
				modal={true}
				actions={actions}
			>
			<div style={{paddingTop: 10}}>
				<Paper style={{minHeight: 400, maxHeight: 400}}>
					<List style={{maxHeight: 400, overflowY: 'auto'}}>
					{
						experiments.map((item) => (renderItem(item)))
					}
					</List>
				</Paper>
			</div>
			</Dialog>
		</div>
		)
	}
}