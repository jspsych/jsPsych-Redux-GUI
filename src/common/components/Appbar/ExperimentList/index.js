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
import Delete from 'material-ui/svg-icons/action/delete-forever';
import Duplicate from 'material-ui/svg-icons/content/content-copy';
import ExperimentIcon from 'material-ui/svg-icons/action/assessment';
import Repository from 'material-ui/svg-icons/device/storage';
import {
	grey100 as dialogBodyColor,
	indigo500 as hoverColor,
	cyan500 as selectedColor,
	pink500 as deleteColor,
	orange500 as duplicateColor,
	blue400 as avatarColor,
	indigo400 as progressColor,
	blue800 as titleIconColor
} from 'material-ui/styles/colors';

import ConfirmationDialog from '../../Notification/ConfirmationDialog';
import { renderDialogTitle } from '../../gadgets';

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
	    confirmMessage: "Null",
	    proceedWithOperation: () => {},
	    proceedWithOperationLabel: "Yes",
	    proceed: () => {},
	    proceedLabel: "No",
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
			    <MenuItem
			    	 leftIcon={<Duplicate hoverColor={hoverColor} color={duplicateColor}/>}
			    	 onTouchTap={() => { 
			    	 	this.props.duplicateExperiment(
			    	 		id,
			    	 		() => { this.setPerforming(id); },
							() => { this.setPerforming(null); })
			    	 }}
			    >
			    	Duplicate
			    </MenuItem>
				<MenuItem
			    	leftIcon={<Delete hoverColor={hoverColor} color={deleteColor}/>}
			    	onTouchTap={() => { 
			    		this.props.deleteExperiment(
			    			id, 
			    			this.popUpConfirm,
			    	 		() => { this.setPerforming(id); },
							() => { this.setPerforming(null); }); 
			    	}}
			    >
			    	Delete
			    </MenuItem>
			</IconMenu>
		)
	}

	renderItem = (item) => {
		let { name, id, details } = item;
		
		let today = new Date();
		let lastEditDate = new Date(details.lastEditDate);

		let isSameDay = today.getYear() === lastEditDate.getYear() &&
						today.getMonth() === lastEditDate.getMonth() &&
						today.getDate() === lastEditDate.getDate();
		let displayedTime;
		if (isSameDay) {
			let diffH = today.getHours() - lastEditDate.getHours(),
				diffM = today.getMinutes() - lastEditDate.getMinutes();
			let tail;
			if (diffH) {
				if (diffH > 1) tail = " hours ago";
				else tail = " hour ago"
				displayedTime = diffH + tail;
			} else if (diffM) {
				if (diffM > 1) tail = " minutes ago";
				else tail = " minute ago"
				displayedTime = diffM + tail;
			} else {
				displayedTime = "less than 1 minute ago";
			}
			
		} else {
			displayedTime = lastEditDate.toDateString();
		}

		return (
			<div key={id+'-ExperimentItem-Container'}>
				<ListItem
					style={{backgroundColor: (id === this.state.selected) ? selectedColor : null}}
					key={id}
					id={id}
					primaryText={name}
					secondaryText={
						(id === this.props.currentId) ? 
						"Currently open" : 
						"Last modified: " + displayedTime}
					onTouchTap={()=>{this.setSeletected(id);}}
					rightIconButton={
						(this.state.performing === id) ? null : this.renderIconMenu(id)
					}
					rightIcon={(this.state.performing === id) ? <CircularProgress color={progressColor}/> : null}
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
					renderDialogTitle(
						<Subheader style={{maxHeight: 48}}>
		      				<div style={{display: 'flex'}}>
							<div style={{paddingTop: 8, paddingRight: 10}}>
								<Repository color={titleIconColor}/>
							</div>
							<div style={{fontSize: 20,}}>
		      					Your experiments
		      				</div>
		      				</div>
	      				</Subheader>,
						handleClose,
						null
					)
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