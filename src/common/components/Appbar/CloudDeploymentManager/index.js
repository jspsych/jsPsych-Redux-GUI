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
import { Card, CardHeader, CardText} from 'material-ui/Card';

import CloudIcon from 'material-ui/svg-icons/file/cloud-queue';
import CloudTitleIcon from 'material-ui/svg-icons/file/cloud';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ConfirmIcon from 'material-ui/svg-icons/navigation/check';
import CancelIcon from 'material-ui/svg-icons/navigation/close';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import SettingIcon from 'material-ui/svg-icons/action/settings';

import ConfirmationDialog from '../../Notification/ConfirmationDialog';
import { renderDialogTitle } from '../../gadgets';

import AppbarTheme from '../theme.js';

const colors = {
  ...AppbarTheme.colors,
  checkGreen: '#4CAF50',
  cancelRed: '#F44336',
  titleColor: '9B9B9B',
  titleIconColor: '#3F51B5',
  onlineBlue: '#03A9F4',
  offlineGrey: '#757575',
  defaultFontColor: '#424242',
  infoBlue: '#03A9F4',
  settingGrey: '#9E9E9E'
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
}

export default class CloudDeploymentManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			editParentNode: false,
			deploying: false,
			isOnline: false
		}

		this.handleOpen = () => {
			this.setState({
				open: true,
				osfParentNode: this.props.osfParentNode
			})
			this.props.checkIfOnline((hasContent) => {
				this.setState({
					isOnline: hasContent
				})
			})
		}

		this.handleClose = () => {
			this.setState({
				open: false,
			});
			this.cancelParentNodeEdit();
			this.setDeloyingStatus(false);
		}

		this.updateParentNode = (e, value) => {
			this.setState({
				osfParentNode: value,
			})
		}

		this.startEditParentNode = () => {
			this.setState({
				editParentNode: true
			})
		}

		this.cancelParentNodeEdit = () => {
			this.setState({
				osfParentNode: this.props.osfParentNode,
				editParentNode: false
			});
		}

		this.confirmParentNodeEdit = () => {
			this.props.setOsfParentNode(this.state.osfParentNode.trim());
			this.setState({
				editParentNode: false
			});
		}

		this.setDeloyingStatus = (flag) => {
			this.setState({
				deploying: flag
			})
		}
	}

	render() {
		let actions = [
			!this.state.deploying ? 
			<FlatButton
				label={this.state.isOnline ? "Update" : "Deploy"}
				style={{color: colors.primaryDeep}}
				onClick={() => { this.props.cloudDeploy(this.setDeloyingStatus) }}
			/>:
			<CircularProgress {...style.Actions.Wait}/>,

		]

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
						null
					)}
					actions={actions}
				>
					<Paper style={{minHeight: 400, maxHeight: 400, overflowY: 'auto'}}>
						<Card initiallyExpanded>
						    <CardHeader
						      title="Details"
						      actAsExpander={true}
						      avatar={
						      	<InfoIcon color={colors.infoBlue}/>
						      }
						      showExpandableButton={true}
						    />
						    <CardText expandable={true} style={{paddingTop: 0}}>
								<div style={{display: 'flex'}}>
									<MenuItem
										disabled
										primaryText={`Experiment Status:`}
							    	/>
									<MenuItem
										disabled
										style={{color: this.state.isOnline ? colors.onlineBlue : colors.offlineGrey }}
										primaryText={`${this.state.isOnline ? 'Online' : 'Offline'}`}
							    	/>
						    	</div>
						    	<div style={{display: 'flex'}}>
									<MenuItem
										disabled
										primaryText={`Experiment URL:`}
							    	/>
									<MenuItem
										disabled={!this.state.isOnline}
										href={`http://${this.props.experimentUrl}`}
										target="_blank"
										primaryText={`${this.state.isOnline ? this.props.experimentUrl : 'The experiment is currently offline.'}`}
							    	/>
						    	</div>
						    </CardText>
						</Card>						
						<Card>
						    <CardHeader
						      title="Settings"
						      actAsExpander={true}
						      avatar={
						      	<SettingIcon color={colors.settingGrey}/>
						      }
						      showExpandableButton={true}
						    />
						    <CardText expandable={true} style={{paddingTop: 0}}>
								<div style={{display: 'flex', justifyContent: 'center'}}>
									<div style={{width: '90%', display: 'flex', alignItems: 'baseline',}}>
										<TextField
											{...style.TextFieldFocusStyle()}
											fullWidth
											value={this.state.osfParentNode}
											onChange={this.updateParentNode}
											disabled={!this.state.editParentNode}
											floatingLabelFixed
											floatingLabelText="OSF Project ID"
											hintText="Input the id of your project."
										/>
										{this.state.editParentNode ? 
											<div style={{display: 'flex'}}>
												<IconButton
													onClick={this.confirmParentNodeEdit}
												>
													<ConfirmIcon color={colors.checkGreen}/>
												</IconButton>
												<IconButton
													onClick={this.cancelParentNodeEdit}
												>
													<CancelIcon color={colors.cancelRed}/>
												</IconButton>
											</div> :
											<IconButton
												onClick={this.startEditParentNode}
											>
												<EditIcon hoverColor={colors.secondary}/>
											</IconButton>
										}
									</div>
								</div>
						    </CardText>
						</Card>
						
					</Paper>
				</Dialog>
			</div>
		);
	}
}