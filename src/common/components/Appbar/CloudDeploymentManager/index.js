import React from 'react';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import CloudIcon from 'material-ui/svg-icons/file/cloud-upload';

import ConfirmationDialog from '../../Notification/ConfirmationDialog';
import { renderDialogTitle } from '../../gadgets';

import AppbarTheme from '../theme.js';

const colors = {
  ...AppbarTheme.colors,
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
	Icon: AppbarTheme.AppbarIcon
}

export default class CloudDeploymentManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		}

		this.handleOpen = () => {
			this.setState({
				open: true
			})
		}

		this.handleClose = () => {
			this.setState({
				open: false
			})
		}
	}

	render() {
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
					title={renderDialogTitle(<Subheader></Subheader>, this.handleClose, null)}
				>

				</Dialog>
			</div>
		);
	}
}