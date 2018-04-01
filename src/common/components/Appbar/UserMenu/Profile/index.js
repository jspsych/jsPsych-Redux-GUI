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
			this.props.setOsfToken(this.state.osfToken);
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
		return (
		<div>
			<Dialog
				open={this.state.open}
				titleStyle={{padding: 0,}}
				title={renderDialogTitle(<Subheader></Subheader>, this.handleClose, null)}
				modal={true}
			>
				<Paper>
					<div style={{display: 'flex', alignItems: 'baseline' }}>
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
									onClick={this.confirmTokenEdit}
								>
									<ConfirmIcon />
								</IconButton>
								<IconButton
									onClick={this.cancelTokenEdit}
								>
									<CancelIcon />
								</IconButton>
							</div> :
							<IconButton
								onClick={this.startEditToken}
							>
								<EditIcon />
							</IconButton>
						}
					</div>
				</Paper>
			</Dialog>
		</div>
		)
	}
}