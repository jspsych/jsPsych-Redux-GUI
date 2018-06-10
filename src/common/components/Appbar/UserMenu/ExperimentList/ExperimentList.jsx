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

import { DialogTitle } from '../../../gadgets';

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

const ExperimentListItem = ({
		experiment,
		isCurrentlyOpen,
		isSelected,
		onClick,
		handleDeleteExperiment,
		handleDuplicateExperiment,
		isPerforming
	}) => {
	let { experimentName, experimentId, lastModifiedDate } = experiment;
	
	lastModifiedDate = new Date(lastModifiedDate);
	let today = new Date(),
		isSameDay = today.getYear() === lastModifiedDate.getYear() &&
					today.getMonth() === lastModifiedDate.getMonth() &&
					today.getDate() === lastModifiedDate.getDate();
	let displayedTime;
	if (isSameDay) {
		let diffH = today.getHours() - lastModifiedDate.getHours(),
			diffM = today.getMinutes() - lastModifiedDate.getMinutes();
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
		displayedTime = lastModifiedDate.toDateString();
	}

	const ExperimentListItemIconMenu = (
		<IconMenu iconButtonElement={iconButtonElement}>
		    <MenuItem
		    	 leftIcon={<Duplicate {...style.duplicateIcon}/>}
		    	 onClick={handleDuplicateExperiment}
		    >
		    	Duplicate
		    </MenuItem>
			<MenuItem
		    	leftIcon={<Delete {...style.deleteIcon}/>}
		    	onClick={handleDeleteExperiment}
		    >
		    	Delete
		    </MenuItem>
		</IconMenu>
	);

	return (
		<div>
			<ListItem
				style={{backgroundColor: isSelected ? style.ListItem.selected : null}}
				primaryText={experimentName}
				secondaryText={
					isCurrentlyOpen ? 
					"Currently open" : 
					"Last modified: " + displayedTime}
				onClick={onClick}
				rightIconButton={ isPerforming ? null : <ExperimentListItemIconMenu /> }
				rightIcon={isPerforming ? <CircularProgress {...style.progress}/> : null}
				leftAvatar={ <Avatar {...style.avatar} icon={<ExperimentIcon />} /> }
			/>
			<Divider inset={true} />
		</div>
	)
}

export default class ExperimentList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			selected: null,
			fetchingAll: false,
			experiments: [],
			performing: null
		}

		this.setSeletected = (id) => {
			this.setState({
				selected: (this.state.selected === id) ? null : id
			});
		}

		this.setPerforming = (id) => {
			this.setState({
				performing: id
			});
		}

		this.handleClose = () => {
			this.setState({
				open: false,
				selected: null
			});
		}

		this.handleOpen = () => {
			this.setState({
				selected: null,
				open: true
			});
			this.fetchAllExperiment();
		}

		this.fetchAllExperiment = () => {
			this.setState({
				fetchingAll: true
			});
			myaws.DynamoDB.getExperimentsOf(this.props.userId).then((experiments) => {
				this.setState({
					experiments: experiments
				});
			}).catch((err) => {
				console.log(err);
				utils.notifications.notifyErrorByDialog({
					dispatch: this.props.dispatch,
					message: err.message
				});
			}).finally(() => {
				this.setState({
					fetchingAll: false
				});
			});
		}

		this.handleDuplicateExperiment = (sourceExperimentState) => {
			return utils.commonFlows.duplicateExperiment({ 
				sourceExperimentState 
			}).then(this.fetchAllExperiment);
		}

		this.handleDeleteExperiment = (targetExperimentState) => {
			utils.notifications.popUpConfirmation({
				dispatch: this.props.dispatch,
				message: "Do you want to save the changes before creating a new experiment?",
				continueWithOperation: () => {
					return this.props.deleteExperiment({ targetExperimentState });
				},
				continueWithoutOperation: () => Promise.resolve(),
				continueWithOperationLabel: "Yes, I want to delete it.",
				continueWithoutOperationLabel: "No, hold on.",
				showCancelButton: false,
				withExtraCare: true,
				extraCareText: id
			});
		}

		this.handlePullExperiment = () => {
			let targetExperimentId = this.state.selected;
			if (!targetExperimentId) { 
				return;
			}

			// nothing has changed
			if (!utils.commonFlows.anyExperimentChange(this.props.currentExperimentState)) {
				this.setState({
					fetching: true
				});
				this.props.pullExperiment({ targetExperimentId });
			} else {
				// ask if save changes
				utils.notifications.popUpConfirmation({
					dispatch: this.props.dispatch,
					message: "Do you want to save the changes before creating new experiment?",
					continueWithOperation: () => {
						return this.props.pullExperiment({
							targetExperimentId,
							saveFirst: true
						});
					},
					continueWithoutOperation: () => {
						return this.props.pullExperiment({ targetExperimentId });
					},
					continueWithOperationLabel: "Yes (Continue with saving)",
					continueWithoutOperationLabel: "No (Continue without saving)",
					showCancelButton: false,
					withExtraCare: true,
					extraCareText: this.state.selected
				});
			}
		}

		this.getSortedExperiments = () => {
			let experiments = this.state.experiments.slice();
			// sort by last modified date (new --> old)
			experiments.sort((a, b) => {
				let at = a.lastModifiedDate,
					bt = b.lastModifiedDate;
				if (at > bt) {
					return -1;
				} else if (at < bt) {
					return 1;
				} else {
					return 0;
				}
			})

			// put currently open first
			for (let i = 0; i < experiments.length; i++) {
				let experiment = experiments[i];
				if (experiment.experimentId === this.props.currentExperimentId) {
					experiments.move(i, 0);
					break;
				}
			}

			return experiments;
		}
	}

	render() {
		let {
			fetchingAll,
			open,
			fetching,
			performing
		} = this.state;

		let { currentExperimentId } = this.props;

		let experiments = this.getSortedExperiments();

		const actions = [
			fetching ?
			<CircularProgress {...style.progress}/> :
			<FlatButton
				label="Open Experiment"
				style={style.actionButton}
				labelStyle={{textTransform: "none", }}
				onClick={this.handlePullExperiment}
			/>
		];

		const Experiment_List = (
			<List style={{minHeight: 400, maxHeight: 400, overflowY: 'auto'}}>
				{
					experiments.map((experiment) => {
						let { experimentId } = experiment;

						return (
							<ExperimentListItem 
								key={`Experiment_List_Item-${experimentId}`}
								experiment={experiment}
								isCurrentlyOpen={currentExperimentId === experimentId}
								isSelected={selected === experimentId}
								onClick={() => this.setSeletected(experimentId)}
								handleDeleteExperiment={() => this.handleDeleteExperiment({
									targetExperimentState: experiment
								})}
								handleDuplicateExperiment={() => this.handleDuplicateExperiment({
									sourceExperimentState: experiment
								})}
								isPerforming={performing === experimentId}
							/>
						)
					})
				}
			</List>
		)

		return (
			<Dialog
				open={open}
				titleStyle={{padding: 0,}}
				title={
					<DialogTitle
						node={
							<Subheader style={{maxHeight: 48}}>
			      				<div style={utils.prefixer({display: 'flex'})}>
									<div style={{paddingTop: 8, paddingRight: 10}}>
										<Repository {...style.dialogTitleIcon}/>
									</div>
									<div style={{fontSize: 20,}}>
				      					Your experiments
				      				</div>
			      				</div>
		      				</Subheader>
			      		}
						closeCallback={this.handleClose}
					/>
				}
				bodyStyle={style.dialogBody}
				autoScrollBodyContent={true}
				modal={true}
				actions={actions}
			>
				<div style={{paddingTop: 10}}>
					<Paper style={{minHeight: 400, maxHeight: 400}}>
						{fetchingAll ?
							<CircularProgress {...style.progress}/> :
							Experiment_List
						}
					</Paper>
				</div>
			</Dialog>
		)
	}
}