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
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ConfirmIcon from 'material-ui/svg-icons/navigation/check';
import CancelIcon from 'material-ui/svg-icons/navigation/close';

import ConfirmationDialog from '../../Notification/ConfirmationDialog';
import { renderDialogTitle } from '../../gadgets';

import AppbarTheme from '../theme.js';

const colors = {
  ...AppbarTheme.colors,
  checkGreen: '#4CAF50',
  cancelRed: '#F44336',
  titleColor: '#3F51B5'
}

const cssStyle = {
	Dialog: {
		Title: utils.prefixer({
			padding: 0
		}),
		Body: utils.prefixer({

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
			deploying: false
		}

		this.handleOpen = () => {
			this.setState({
				open: true,
				osfParentNode: this.props.osfParentNode
			})
		}

		this.handleClose = () => {
			this.setState({
				open: false,
			});
			this.cancelParentNodeEdit();
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

		this.startDeploying = () => {
			this.setState({
				deploying: true
			});
		}

		this.finishDeploying = () => {
			this.setState({
				deploying: false
			});
		}
	}

	render() {


		let actions = [
			!this.state.deploying ? 
			<FlatButton
				label="Deploy"
				onClick={() => { this.props.cloudDeploy(this.startDeploying, this.finishDeploying) }}
			/>:
			<CircularProgress {...style.Actions.Wait}/>
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
						<Subheader style={{fontSize: 20, color: colors.titleColor}}>
							Cloud Deployment
						</Subheader>, 
						this.handleClose, 
						null
					)}
					actions={actions}
				>
					<Paper style={{minHeight: 400, maxHeight: 400, overflowY: 'auto'}}>
						<MenuItem
							href={`http://${this.props.experimentUrl}`}
							target="_blank"
							primaryText={`${this.props.experimentUrl}`}
				    	/>
						<Divider />
						<Card>
						    <CardHeader
						      title="Cloud Deployment Settings"
						      actAsExpander={true}
						      showExpandableButton={true}
						    />
						    <CardText expandable={true}>
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