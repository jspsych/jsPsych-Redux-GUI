import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import { Card, CardHeader, CardText} from 'material-ui/Card';

import CloudIcon from 'material-ui/svg-icons/file/cloud-queue';
import CloudTitleIcon from 'material-ui/svg-icons/file/cloud';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ConfirmIcon from 'material-ui/svg-icons/navigation/check';
import CancelIcon from 'material-ui/svg-icons/navigation/close';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import SettingIcon from 'material-ui/svg-icons/action/settings';
import AlertIcon from 'material-ui/svg-icons/alert/error';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import ShowDetailIcon from 'material-ui/svg-icons/navigation/expand-more';
import HideDetailIcon from 'material-ui/svg-icons/navigation/expand-less';

import deepEqual from 'deep-equal';

import ConfirmationDialog from '../../Notification/ConfirmationDialog';
import { renderDialogTitle, Text } from '../../gadgets';

import AppbarTheme from '../theme.js';

const colors = {
  ...AppbarTheme.colors,
  checkGreen: '#4CAF50',
  cancelRed: '#F44336',
  titleColor: '9B9B9B',
  titleIconColor: '#3F51B5',
  onlineColor: '#03A9F4',
  offlineColor: '#757575',
  defaultFontColor: '#424242',
  infoColor: '#03A9F4',
  settingIconColor: '#795548',
  deleteColor: '#E91E63',
  errorColor: 'red',
  white: '#FEFEFE',
}

const cssStyle = {
	Dialog: {
		Title: utils.prefixer({
			padding: 0
		}),
		Body: utils.prefixer({
			paddingTop: 20
		})
	}
}

const style = {
	Icon: AppbarTheme.AppbarIcon,
	TextFieldFocusStyle: AppbarTheme.TextFieldFocusStyle,
	Actions: {
		Wait: {
			size: 30,
			color: colors.primaryDeep
		}
	},
	SelectFieldStyle: {
		selectedMenuItemStyle: {
			color: colors.secondary
		},
		underlineFocusStyle: {
			borderColor: colors.secondary
		}
	},
}

export default class CloudDeploymentManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			confirmOpen: false,

			deploying: false,
			deleting: false,
			creating: false,
			saving: false,

			isOnline: false,

			showOsfAccessDetails: true,

			tempAvaliableProjects: [],
			listing: false,
			canReadFromOSF: false
		}

		this.update = () => {
			this.setState({
				tempOsfNode: this.props.osfNode,
				tempSaveAfter: this.props.saveAfter,
				tempChosenOsfAccess: this.props.chosenOsfAccess
			})
		}

		this.syncExperimentStatus = () => {
			this.update();
			this.props.syncExperimentStatus().then((isOnline) => {
				this.setState({
					isOnline: isOnline
				})
			});
		}

		this.syncAvaliableProjects = () => {
			this.setState({
				listing: true
			});
			this.props.listNodesAtOSF({
				...this.state.tempChosenOsfAccess
			}).then((data) => {
				let projects = [];
				for (let item of data) {
					projects.push({
						id: item.id,
						title: item.attributes.title
					})
				}
				this.setState({
					tempAvaliableProjects: projects,
					canReadFromOSF: true
				})
			}).catch((e) => {
				this.setState({
					canReadFromOSF: false,
					tempOsfNode: '',
					tempAvaliableProjects: [],
				})
			}).finally(() => {
				this.setState({
					listing: false
				})
			})
		}

		this.handleOpenHepler = () => {
			this.setState({
				open: true,
			})
			this.syncExperimentStatus();
			this.syncAvaliableProjects();
		}

		this.handleOpen = () => {
			this.props.checkBeforeOpen().then((shouldOpen) => {
				if (shouldOpen) {
					this.handleOpenHepler();
				}
			});
		}

		this.handleClose = () => {
			this.setState({
				open: false,
			});
		}

		this.handleCancel = () => {
			this.handleClose();
			this.update();
		}

		this.updateOsfNode = (event, index, value) => {
			this.setState({
				tempOsfNode: value
			})
		}

		this.updateSaveAfter = (event, index, value) => {
			this.setState({
				tempSaveAfter: value
			})
		}

		this.updateOsfAccess = (event, index, value) => {
			this.setState({
				tempChosenOsfAccess: value
			}, this.syncAvaliableProjects
			)
		}

		this.handleConfirmClose = () => {
			this.setState({
				confirmOpen: false
			})
		}

		this.handleConfirmOpen = () => {
			this.setState({
				confirmOpen: true
			})
		}

		this.cloudDeploy = () => {
			this.setState({
				deploying: true
			});
			this.props.cloudDeploy({
				osfAccess: this.state.tempChosenOsfAccess,
				osfNode: utils.toNull(this.state.tempOsfNode.trim()),
				saveAfter: this.state.tempSaveAfter
			}).finally(() => {
				this.setState({
					deploying: false
				});
				this.syncExperimentStatus();
			})
		}

		this.cloudDelete = () => {
			this.setState({
				deleting: true
			});
			this.props.cloudDelete().finally(() => {
				this.setState({
					deleting: false
				});
				this.syncExperimentStatus();
			})
		}

		this.createProject = () => {
			let osfAccess = this.state.tempChosenOsfAccess,
				token = osfAccess ? osfAccess.token : '';
			if (!token) {
				this.props.notifyErrorByDialog("An OSF token with full-write access is required !")
				return;
			}

			this.setState({
				creating: true
			});
			this.props.createProject(token).then((data) => {
				this.updateOsfNode(null, null, data);
			}).then(() => {
				this.syncAvaliableProjects();
			}).finally(() => {
				this.setState({
					creating: false
				});
			});
		}

		this.toggleOsfAccessDetails = () => {
			this.setState({
				showOsfAccessDetails: !this.state.showOsfAccessDetails
			})
		}
	}

	render() {
		let {
			isOnline,
			deploying,
			creating,
			deleting,
			saving,
			tempChosenOsfAccess,
			tempOsfNode,
			tempSaveAfter,
			showOsfAccessDetails
		} = this.state;
		let {
			osfNode,
			osfToken,
			saveAfter,
			experimentUrl,
			chosenOsfAccess,
			osfAccess,
			indexedNodeNames
		} = this.props;

		let osfTokenError = !tempChosenOsfAccess || !tempChosenOsfAccess.token,
			osfNodeError = !tempOsfNode,
			saveAfterError = tempSaveAfter >= indexedNodeNames.length,
			notReady = osfTokenError || osfNodeError || saveAfterError;
		let actions = [
			!deploying ? 
			<FlatButton
				label={isOnline ? "Update" : "Deploy"}
				style={{color: notReady ? colors.offlineColor : colors.primaryDeep}}
				disabled={notReady}
				title={notReady ? "The experiment is not ready for deployment." : ""}
				onClick={this.cloudDeploy}
			/>:
			<CircularProgress {...style.Actions.Wait} style={{marginLeft: 16, marginRight: 10}}/>,
			<FlatButton
				label={"Cancel"}
				style={{color: colors.defaultFontColor}}
				onClick={this.handleCancel}
			/>,
		];

		let Experiment_Detail_Card = (
			<Card initiallyExpanded>
			    <CardHeader
			      title="Details"
			      actAsExpander={true}
			      avatar={
			      	<InfoIcon color={colors.infoColor}/>
			      }
			      showExpandableButton={true}
			    />
			    <CardText expandable={true} style={{paddingTop: 0}}>
					<div style={{display: 'flex'}}>
						<MenuItem
							style={{width: 170}}
							disabled
							primaryText={`Status:`}
				    	/>
						<MenuItem
							disabled
							style={{color: isOnline ? colors.onlineColor : colors.offlineColor }}
							primaryText={`${isOnline ? 'Online' : 'Offline'}`}
				    	/>
				    	<div style={{display: 'flex', }}>
				    	{
							!deleting ?
								<IconButton
									tooltip="Pull Experiment Offline"
									disabled={!isOnline}
									onClick={this.handleConfirmOpen}
								>
									<DeleteIcon color={colors.deleteColor}/>
								</IconButton> :
						    	<CircularProgress {...style.Actions.Wait}/>
				    	}
				    	</div>
				    	
			    	</div>
			    	<div style={{display: 'flex'}}>
						<MenuItem
							style={{width: 170}}
							disabled
							primaryText={`Experiment URL:`}
				    	/>
						<MenuItem
							disabled={!isOnline}
							href={`http://${experimentUrl}`}
							target="_blank"
							title={isOnline ? "Go to your experiment" : ""}
							style={{color: isOnline ? colors.defaultFontColor : colors.offlineColor }}
							primaryText={`${isOnline ? experimentUrl : 'The experiment is currently offline.'}`}
				    	/>
			    	</div>
			    	<div style={{display: 'flex'}}>
						<MenuItem
							style={{width: 170}}
							disabled
							primaryText={`Data Storage:`}
				    	/>
						<MenuItem
							href={`https://osf.io/${utils.toEmptyString(osfNode)}`}
							target="_blank"
							style={{color: colors.defaultFontColor }}
							primaryText={`osf.io/${utils.toEmptyString(osfNode) ? utils.toEmptyString(osfNode) : 'null'}`}
				    	/>
			    	</div>
			    </CardText>
			</Card>		
		)

		let Setting_Card = (
			<Card>
			    <CardHeader
			      title="Settings"
			      actAsExpander={true}
			      avatar={
			      	notReady ? 
			      	<AlertIcon color={colors.errorColor}/> :
			      	<SettingIcon color={colors.settingIconColor}/>
			      }
			      showExpandableButton={true}
			    />
			    <CardText expandable={true} style={{paddingTop: 0}}>
			    	<div style={{display: 'flex'}}>
						<MenuItem
							style={{width: 170}}
							disabled
							primaryText={`OSF Access Information:`}
				    	/>
				    	<SelectField
							id="Choose_OSF_Token"
							{...style.SelectFieldStyle}
							style={{maxWidth: 200, marginLeft: 36}}
							labelStyle={{
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
							}}
							onChange={this.updateOsfAccess}
							title={utils.toEmptyString(tempChosenOsfAccess ? tempChosenOsfAccess.token : null)}
							value={tempChosenOsfAccess}
							errorText={osfTokenError ? 'A token is required' : ''}
				    	>
					    	{
					    		osfAccess.map((item, i) => {
					    			if (deepEqual(item, tempChosenOsfAccess)) {
					    				item = tempChosenOsfAccess;
					    			}
					    			return (
					    				<MenuItem
					    					key={`Registered-Osf-Access-${i}`}
					    					primaryText={utils.toEmptyString(item.alias)}
					    					title={utils.toEmptyString(item.token)}
					    					value={item}
					    				/>
					    			)
					    		})
					    	}
				    	</SelectField>
				    	<div
				    		style={{display: 'flex', flexGrow: '1', flexDirection: 'row-reverse'}}
				    	>
					    	<IconButton
					    		onClick={this.toggleOsfAccessDetails}
					    	>
					    		{
					    			showOsfAccessDetails ?
					    			<HideDetailIcon /> :
					    			<ShowDetailIcon />
					    		}
					    	</IconButton>
				    	</div>
			    	</div>
			    	{
			    		showOsfAccessDetails ?
			    		<div>
			    			<div style={{display: 'flex', alignItems: 'baseline', marginLeft: 74}}>
					    		<MenuItem
									style={{width: 100,}}
									disabled
									primaryText={`User Id`}
						    	/>
						    	<MenuItem primaryText=":" disabled/>
								<Text 
									style={{maxWidth: '300px', paddingLeft: '0px'}}
									text={utils.toEmptyString(
										tempChosenOsfAccess && tempChosenOsfAccess.userId ? 
										tempChosenOsfAccess.userId : 
										'""'
									)} 
								/>
							</div>
							<div style={{display: 'flex', alignItems: 'baseline', marginLeft: 74}}>
								<MenuItem
									style={{width: 100,}}
									disabled
									primaryText={`Token Value`}
						    	/>
						    	<MenuItem primaryText=":" disabled/>
								<Text 	
									style={{maxWidth: '300px', paddingLeft: '0px'}}
									text={utils.toEmptyString(
										tempChosenOsfAccess && tempChosenOsfAccess.token ? 
										tempChosenOsfAccess.token : 
										'""'
									)} 
								/>
							</div>
			    		</div> :
			    		null
			    	}
					<div style={{display: 'flex'}}>
						<MenuItem
							disabled
							style={{width: 170}}
							primaryText={`OSF Project Id:`}
				    	/>
						<div style={{display: 'flex', alignItems: 'center'}}>
							{
								this.state.canReadFromOSF ?
								(
									this.state.listing ?
									<CircularProgress {...style.Actions.Wait}/> :
									<SelectField
							          onChange={this.updateOsfNode}
							          id="Choose_OSF_Node"
							          {...style.SelectFieldStyle}
							          value={tempOsfNode}
							          errorText={osfNodeError ? 'A node id is required' : ''}
							        >
							          {
							          	this.state.tempAvaliableProjects.map((item, i) => (
							          		<MenuItem 
							          			value={item.id} 
							          			title={item.title}
							          			primaryText={item.id} 
							          			key={item.id+"-"+i}
							          		/>)
							          	)
							          }
							        </SelectField>
								) :
								<TextField
									disabled
									id="Choose_OSF_Node"
									value={tempOsfNode}
									errorText={osfNodeError ? 'A node id is required' : ''}
								/>
							}
					        
							{!creating ?
								<RaisedButton
									backgroundColor={colors.primary}
									labelColor={colors.white}
									style={{marginLeft: '10px'}}
									labelStyle={{textTransform: "none",}}
									label={"Create One For Me!"}
									title={"Create One For Me!"}
									onClick={this.createProject}
								/> :
								<CircularProgress {...style.Actions.Wait} />
							}
						</div>
					</div>
					<div style={{display: 'flex'}}>
						<MenuItem
							disabled
							primaryText={`Save Data After:`}
				    	/>
				    	<SelectField
				          onChange={this.updateSaveAfter}
				          id="Choose_Save_After"
				          {...style.SelectFieldStyle}
				          value={tempSaveAfter}
				        >
				          {
				          	indexedNodeNames.map((n, i) => (
				          		<MenuItem value={i} primaryText={n} key={n+"-"+i}/>)
				          	)
				          }
				        </SelectField>
			    	</div>
			    </CardText>
			</Card>
		)

		return(
			<div>
				<IconButton 
	              tooltip="Cloud Deploy"
	              onClick={this.handleOpen}
	          	>
	              <CloudIcon {...style.Icon}/>
	          	</IconButton>
				<Dialog
					modal
					autoScrollBodyContent
					open={this.state.open}
					titleStyle={{...cssStyle.Dialog.Title}}
					bodyStyle={{...cssStyle.Dialog.Body}}
					title={renderDialogTitle(
						<Subheader>
							<div style={{display: 'flex', maxHeight: 48}}>
								<div style={{paddingTop: 8, paddingRight: 10, maxHeight: 48}}>
									<CloudTitleIcon color={colors.titleIconColor}/>
								</div>
								<div style={{fontSize: 20, maxHeight: 48}}>
			      					{"Cloud Deployment"}
			      				</div>
		      				</div>
						</Subheader>, 
						this.handleClose, 
						null,
						null,
						false
					)}
					actions={actions}
					actionsContainerStyle={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row-reverse'
					}}
				>
					<Paper style={{minHeight: 388, maxHeight: 388, overflowY: 'auto', overflowX: 'hidden'}}>
						{Experiment_Detail_Card}				
						{Setting_Card}
					</Paper>
				</Dialog>

				<ConfirmationDialog
	                open={this.state.confirmOpen}
	                message={"Are you sure that you want this experiment offline?"}
	                handleClose={this.handleConfirmClose}
	                proceedWithOperation={() => { 
	                	this.cloudDelete(); 
	                	this.handleConfirmClose(); 
	                }}
	                proceedWithOperationLabel={"Yes, I want it offline."}
	                proceed={this.handleConfirmClose}
	                proceedLabel={"No, hold on..."}
	                showCloseButton={false}
	            />
			</div>
		);
	}
}