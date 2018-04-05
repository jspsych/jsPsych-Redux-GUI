import React from 'react';
import Dialog from 'material-ui/Dialog';
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
import CreateIcon from 'material-ui/svg-icons/content/add';

import ConfirmationDialog from '../../Notification/ConfirmationDialog';
import { renderDialogTitle } from '../../gadgets';

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
  deleteColor: 'red',
  errorColor: 'red'
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
			usingOsfNode: '',
			usingToken: '',
		}

		this.update = () => {
			this.setState({
				tempOsfNode: this.props.osfNode,
				tempSaveAfter: this.props.saveAfter
			})
		}

		this.isSettingSaved = () => {
			return this.state.tempOsfNode === this.props.osfNode &&
				   this.state.tempSaveAfter === this.props.saveAfter;
		}

		this.syncExperimentStatus = () => {
			this.props.syncExperimentStatus((args) => {
				this.setState(args)
			});
		}

		this.handleOpen = () => {
			this.setState({
				open: true,
			})
			this.update();
			this.syncExperimentStatus();
		}

		this.handleClose = () => {
			this.setState({
				open: false,
			});
			this.setDeloyingStatus(false);
		}

		this.updateParentNode = (e, value) => {
			this.setState({
				tempOsfNode: value
			})
		}

		this.updateSaveAfter = (event, index, value) => {
			this.setState({
				tempSaveAfter: value
			})
		}

		this.setDeloyingStatus = (flag) => {
			this.setState({
				deploying: flag
			})
		}

		this.setDeletingStatus = (flag) => {
			this.setState({
				deleting: flag
			})
		}

		this.setSavingStatus = (flag) => {
			this.setState({
				saving: flag
			})
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

		this.setCreatingStatus = (flag) => {
			this.setState({
				creating: flag
			})
		}

		this.saveSetting = () => {
			this.props.saveSetting({
				saveAfter: this.state.tempSaveAfter,
				osfNode: this.state.tempOsfNode,
				setSavingStatus: this.setSavingStatus,
				syncExperimentStatus: this.syncExperimentStatus
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
			usingOsfNode,
			usingOsfToken
		} = this.state;
		let {
			osfTokenError,
			osfNodeError,
			osfNode,
			osfToken,
			saveAfter,
			saveAfterError,
			experimentUrl,
		} = this.props;

		let notReady = osfTokenError || osfNodeError || saveAfterError || !this.isSettingSaved();
		let actions = [
			!deleting ? 
			<FlatButton
				label={"Delete"}
				disabled={!isOnline}
				style={{color: isOnline ? colors.deleteColor : colors.offlineColor}}
				onClick={this.handleConfirmOpen}
			/>:
			<CircularProgress {...style.Actions.Wait}/>,
			!deploying ? 
			<FlatButton
				label={isOnline ? "Update" : "Deploy"}
				style={{color: notReady ? colors.offlineColor : colors.primaryDeep}}
				disabled={notReady}
				title={notReady ? "The experiment is not ready for deployment." : ""}
				onClick={() => { 
					this.props.cloudDeploy({
						setDeloyingStatus: this.setDeloyingStatus, 
						syncExperimentStatus: this.syncExperimentStatus
					})
				}}
			/>:
			<CircularProgress {...style.Actions.Wait}/>,
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
							href={`https://osf.io/${utils.toEmptyString(usingOsfNode)}`}
							target="_blank"
							style={{color: colors.defaultFontColor }}
							primaryText={`osf.io/${utils.toEmptyString(usingOsfNode) ? utils.toEmptyString(usingOsfNode) : 'null'}`}
				    	/>
			    	</div>
			    	<div style={{display: 'flex'}}>
						<MenuItem
							style={{width: 170}}
							disabled
							primaryText={`Using OSF Token:`}
				    	/>
				    	<TextField
							disabled
							id="Display_Using_Token"
							style={{paddingLeft: 16}}
							inputStyle={{
								color: colors.defaultFontColor,
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
							}}
							title={utils.toEmptyString(usingOsfToken)}
							value={utils.toEmptyString(usingOsfToken)}
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
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<div style={{width: '95%', display: 'flex', alignItems: 'baseline',}}>
							<TextField
								{...style.TextFieldFocusStyle(this.props.osfNodeError)}
								fullWidth
								id="OSF_Project_ID"
								value={this.state.tempOsfNode}
								onChange={this.updateParentNode}
								floatingLabelFixed
								floatingLabelText="OSF Project ID"
								errorText={osfNodeError ? "This field is required." : ""}
								hintText="Input the id of your project."
							/>
							{!creating ?
								<IconButton
									disabled={osfTokenError}
									tooltip={osfTokenError ? "An OSF Token is required." : "Create a project for me!"}
									onClick={() => { this.props.createProject(this.setCreatingStatus)} }
								>
									<CreateIcon color={colors.primaryDeep} hoverColor={colors.secondaryDeep}/>
								</IconButton>  :
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
				          {...style.SelectFieldStyle}
				          value={this.state.tempSaveAfter}
				        >
				          {
				          	this.props.indexedNodeNames.map((n, i) => (
				          		<MenuItem value={i} primaryText={n} key={n+"-"+i}/>)
				          	)
				          }
				        </SelectField>
			    	</div>
			    	<div style={{display: 'flex'}}>
						<MenuItem
							style={{width: 170}}
							disabled
							primaryText={`Current OSF Token:`}
				    	/>
				    	<TextField
							disabled
							id="Display_Current_Token"
							style={{paddingLeft: 16, width: 350}}
							inputStyle={{
								color: colors.defaultFontColor,
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
							}}
							title={utils.toEmptyString(osfToken)}
							value={utils.toEmptyString(osfToken)}
							errorText={osfTokenError ? 'This field is required' : ''}
							hintText="Please go to User Profile to set your OSF Token."
							hintStyle={{
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
							}}
				    	/>
			    	</div>
			    	<div style={{display: 'flex', width: '100%', flexDirection: 'row-reverse'}}>
			    		{!saving ?
			    			<FlatButton disabled={this.isSettingSaved()} label="Save" onClick={this.saveSetting}/> :
			    			<CircularProgress {...style.Actions.Wait}/>
			    		}
			    		<FlatButton disabled={!this.isSettingSaved()} label="Cancel" onClick={this.update}/>
			    	</div>
			    </CardText>
			</Card>
		)

		return(
			<div>
				<IconButton 
	              tooltip="Cloud Deploy"
	              onClick={() => { this.props.checkBeforeOpen(this.handleOpen); }}
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
						null
					)}
					actions={actions}
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
	                	this.props.cloudDelete(this.setDeletingStatus, this.syncExperimentStatus); 
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