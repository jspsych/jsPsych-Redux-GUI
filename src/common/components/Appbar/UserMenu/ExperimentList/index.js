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

import ConfirmationDialog from '../../../Notification/ConfirmationDialog';
import { renderDialogTitle } from '../../../gadgets';

import AppbarTheme from '../../theme.js';

const colors = {
  ...AppbarTheme.colors,
}

const style = {
	moreIcon: {
		color: 'black',
		hoverColor: 'F0F0F0'
	},
	duplicateIcon: {
		color: '#673AB7'
	},
	deleteIcon: {
		color: '#E82062'
	},
	avatar: {
		backgroundColor: colors.primaryDeep
	},
	progress: {
		color: colors.primary
	},
	ListItem: {
		selected: '#E2E2E2'
	},
	dialogTitleIcon: {
		color: colors.primaryDeep
	},
	dialogBody: {
		backgroundColor: '#F4F4F4'
	},
	actionButton: {
		color: colors.primaryDeep
	},
}

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
	  <MoreVertIcon {...style.moreIcon} />
	</IconButton>
) 

export default class ExperimentList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: null,
			performing: null,
		    confirmOpen: false,
		    confirmMessage: "Null",
		    proceedWithOperation: () => {},
		    proceedWithOperationLabel: "Yes",
		    proceed: () => {},
		    proceedLabel: "No",
		    showCloseButton: false
		}

		this.setSeletected = (id) => {
			this.setState({
				selected: (this.state.selected === id) ? null : id
			});
		}

		this.handleClose = () => {
			this.props.handleClose();
			this.setState({
				selected: null
			});
		}

		this.setPerforming = (p) => {
			this.setState({
				performing: p
			});
		}

		this.popUpConfirm = (message, proceedWithOperation, proceedWithOperationLabel, proceed, proceedLabel, showCloseButton=true) => {
			this.setState({
				confirmOpen: true,
				confirmMessage: message,
				proceedWithOperation: proceedWithOperation,
				proceedWithOperationLabel: proceedWithOperationLabel,
				proceed: proceed,
				proceedLabel: proceedLabel,
				showCloseButton: showCloseButton
			});
		}

		this.handleConfirmClose = () => {
			this.setState({
				confirmOpen: false
			});
		}

		this.renderIconMenu = (id) => {
			return (
				<IconMenu iconButtonElement={iconButtonElement}>
				    <MenuItem
				    	 leftIcon={<Duplicate {...style.duplicateIcon}/>}
				    	 onClick={() => { 
				    	 	this.props.duplicateExperiment(
				    	 		id,
				    	 		() => { this.setPerforming(id); },
								() => { this.setPerforming(null); })
				    	 }}
				    >
				    	Duplicate
				    </MenuItem>
					<MenuItem
				    	leftIcon={<Delete {...style.deleteIcon}/>}
				    	onClick={() => { 
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

		this.renderItem = (item) => {
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
						style={{backgroundColor: (id === this.state.selected) ? style.ListItem.selected : null}}
						key={id}
						id={id}
						primaryText={name}
						secondaryText={
							(id === this.props.currentId) ? 
							"Currently open" : 
							"Last modified: " + displayedTime}
						onClick={()=>{this.setSeletected(id);}}
						rightIconButton={
							(this.state.performing === id) ? null : this.renderIconMenu(id)
						}
						rightIcon={(this.state.performing === id) ? <CircularProgress {...style.progress}/> : null}
						leftAvatar={
							<Avatar {...style.avatar} icon={<ExperimentIcon />} />
						}
					/>
					<Divider inset={true} />
				</div>
			)
		}
	}

	render() {
		// let { open } = this.state;
		let { handleClose, renderItem } = this;
		let { open, experiments } = this.props;
		const actions = [
		(this.state.performing !== Actions.browse) ?
			<FlatButton
				label="Open Experiment"
				style={style.actionButton}
				labelStyle={{textTransform: "none", }}
    			keyboardFocused={true}
				onClick={() => { 
					this.props.pullExperiment(this.state.selected, 
											  this.popUpConfirm,
											  () => { this.setPerforming(Actions.browse); },
											  () => { this.setPerforming(null); }); 
					}
				}
			/> :
			<CircularProgress {...style.progress}/>
		]

		return (
		<div>
			<Dialog
				open={open}
				titleStyle={{padding: 0,}}
				title={
					renderDialogTitle(
						<Subheader style={{maxHeight: 48}}>
		      				<div style={{display: 'flex'}}>
							<div style={{paddingTop: 8, paddingRight: 10}}>
								<Repository {...style.dialogTitleIcon}/>
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
				bodyStyle={style.dialogBody}
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
                showCloseButton={this.state.showCloseButton}
                />
		</div>
		)
	}
}