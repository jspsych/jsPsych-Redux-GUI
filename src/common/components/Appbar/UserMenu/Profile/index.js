import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ConfirmIcon from 'material-ui/svg-icons/navigation/check';
import CancelIcon from 'material-ui/svg-icons/navigation/close';

import { renderDialogTitle } from '../../../gadgets';
import AppbarTheme from '../../theme.js';

const colors = {
  ...AppbarTheme.colors,
  checkGreen: '#4CAF50',
  cancelRed: '#F44336',
  titleColor: '#3F51B5'
}

const style = {
	TextFieldFocusStyle: AppbarTheme.TextFieldFocusStyle
}

export default class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			osfToken: this.props.osfToken,
			editToken: false,
			open: false
		}

		this.handleClose = () => {
			this.setState({
				open: false
			})
		}

		this.handleOpen = () => {
			this.setState({
				open: true,
				osfToken: this.props.osfToken,
			})
		}

		this.updateToken = (e, value) => {
			this.setState({
				osfToken: value,
			})
		}

		this.startEditToken = () => {
			this.setState({
				editToken: true
			})
		}

		this.finishEditToken = () => {
			this.setState({
				editToken: false
			})
		}

		this.cancelTokenEdit = () => {
			this.setState({
				osfToken: this.props.osfToken,
			});
			this.finishEditToken();
		}

		this.confirmTokenEdit = () => {
			this.props.setOsfToken(this.state.osfToken.trim());
			this.finishEditToken();
		}
	}

	componentDidMount() {
	  this.props.onRef(this);
	}
	
	componentWillUnmount() {
	  this.props.onRef(undefined);
	}

	render() {
		let osfTokenString = this.props.osfToken ? this.props.osfToken : '';

		return (
		<div>
			<Dialog
				open={this.state.open}
				titleStyle={{padding: 0,}}
				title={renderDialogTitle(<Subheader style={{fontSize: 20, color: colors.titleColor}}>
					User Profile
					</Subheader>, 
					this.handleClose, 
					null)
				}
				modal
			>
				<Paper style={{minHeight: 400, maxHeight: 400, overflowY: 'auto'}}>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<div style={{width: '90%', display: 'flex', alignItems: 'baseline',}}>
							<TextField
								fullWidth
								{...style.TextFieldFocusStyle()}
								value={this.props.username}
								disabled
								floatingLabelFixed
								floatingLabelText="Username"
								inputStyle={{color: 'black'}}
							/>
						</div>
					</div>
					<Divider />
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<div style={{width: '90%', display: 'flex', alignItems: 'baseline',}}>
							<TextField
								{...style.TextFieldFocusStyle()}
								fullWidth
								value={this.state.osfToken}
								onChange={this.updateToken}
								disabled={!this.state.editToken}
								floatingLabelFixed
								floatingLabelText="OSF Auth Token"
								hintText="Your personal OSF access token with WRITE access."
							/>
							{this.state.editToken ? 
								<div style={{display: 'flex'}}>
									<IconButton
										disabled={this.state.osfToken.trim() === osfTokenString}
										onClick={this.confirmTokenEdit}
									>
										<ConfirmIcon color={colors.checkGreen}/>
									</IconButton>
									<IconButton
										onClick={this.cancelTokenEdit}
									>
										<CancelIcon color={colors.cancelRed}/>
									</IconButton>
								</div> :
								<IconButton
									onClick={this.startEditToken}
								>
									<EditIcon hoverColor={colors.secondary}/>
								</IconButton>
							}
						</div>
					</div>
					<Divider />
				</Paper>
			</Dialog>
		</div>
		)
	}
}