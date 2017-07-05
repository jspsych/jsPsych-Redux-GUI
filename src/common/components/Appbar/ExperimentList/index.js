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
import CircularProgress from 'material-ui/CircularProgress';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Close from 'material-ui/svg-icons/navigation/close';
import Delete from 'material-ui/svg-icons/action/delete';
import Duplicate from 'material-ui/svg-icons/content/content-copy';
import ExperimentIcon from 'material-ui/svg-icons/action/assessment';

import {
	grey100 as dialogBodyColor,
	indigo500 as hoverColor,
	cyan500 as selectedColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor,
	pink500 as iconColor,
	indigo200 as avatarColor,
} from 'material-ui/styles/colors';

import ConfirmationDialog from '../../Notification/ConfirmationDialog';


const Actions = {
	browse: "BROWSE",
	delete: "DELETE",
	duplicate: "DUPLICATE"
}

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
		performing: null,
	    confirmOpen: false,
	    confirmMessage: "",
	    proceedWithOperation: () => {},
	    proceedWithOperationLabel: "",
	    proceed: () => {},
	    proceedLabel: "",
	}

	setSeletected = (id) => {
		this.setState({
			selected: (this.state.selected === id) ? null : id
		});
	}

	handleClose = () => {
		this.props.handleClose();
		this.setState({
			selected: null
		});
	}

	setPerforming = (p) => {
		this.setState({
			performing: p
		});
	}

	popUpConfirm = (message, proceedWithOperation, proceedWithOperationLabel, proceed, proceedLabel) => {
		this.setState({
			confirmOpen: true,
			confirmMessage: message,
			proceedWithOperation: proceedWithOperation,
			proceedWithOperationLabel: proceedWithOperationLabel,
			proceed: proceed,
			proceedLabel: proceedLabel,
		});
	}

	handleConfirmClose = () => {
		this.setState({
			confirmOpen: false
		});
	}

	renderIconMenu = (id) => {
		return (
			<IconMenu iconButtonElement={iconButtonElement}>
			    {(this.state.performing !== Actions.duplicate) ?
			    <MenuItem
			    	 leftIcon={<Duplicate hoverColor={hoverColor} color={iconColor}/>}
			    	 onTouchTap={() => { 
			    	 	this.props.duplicateExperiment(
			    	 		id,
			    	 		() => { this.setPerforming(Actions.duplicate); },
							() => { this.setPerforming(null); })
			    	 }}
			    >
			    	Duplicate
			    </MenuItem> :
			    <CircularProgress />
				}
				{(this.state.performing !== Actions.delete) ?
			    <MenuItem
			    	leftIcon={<Delete hoverColor={hoverColor} color={iconColor}/>}
			    	onTouchTap={() => { 
			    		this.props.deleteExperiment(
			    			id, 
			    			this.popUpConfirm,
			    	 		() => { this.setPerforming(Actions.delete); },
							() => { this.setPerforming(null); }); 
			    	}}
			    >
			    	Delete
			    </MenuItem> :
			    <CircularProgress />
			    }
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
					secondaryText={(id === this.props.currentId) ? "Currently open" : ""}
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
		let { handleClose, renderItem } = this;
		let { open, experiments } = this.props;
		const actions = [
		(this.state.performing !== Actions.browse) ?
			<FlatButton
				label="Open Experiment"
				primary={true}
				labelStyle={{textTransform: "none", }}
    			keyboardFocused={true}
				onTouchTap={() => { 
					this.props.pullExperiment(this.state.selected, 
											  this.popUpConfirm,
											  () => { this.setPerforming(Actions.browse); },
											  () => { this.setPerforming(null); }); 
					}
				}
			/> :
			<CircularProgress />
		]

		return (
		<div className="Experiment List">
			<Dialog
				open={open}
				titleStyle={{padding: 0,}}
				title={
					<div style={{display: 'flex'}}>
	          			<Subheader style={{fontSize: 24, color: hoverColor}}>Your experiments</Subheader>
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
					<List style={{minHeight: 400, maxHeight: 400, overflowY: 'auto'}}>
					{
						experiments.map((item) => (renderItem(item)))
					}
					</List>
				</Paper>
			</div>
			</Dialog>

			<ConfirmationDialog
                open={this.state.confirmOpen}
                message={this.state.confirmMessage}
                handleClose={this.handleConfirmClose}
                proceedWithOperation={this.state.proceedWithOperation}
                proceedWithOperationLabel={this.state.proceedWithOperationLabel}
                proceed={this.state.proceed}
                proceedLabel={this.state.proceedLabel}
                />
		</div>
		)
	}
}