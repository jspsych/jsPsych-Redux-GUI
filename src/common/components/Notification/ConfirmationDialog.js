import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';

import Warning from 'material-ui/svg-icons/alert/warning';
import {
	grey50 as dialogBodyColor,
  	yellow600 as warningColor,
} from 'material-ui/styles/colors';
import { renderDialogTitle } from '../gadgets';

export default class ConfirmationDialog extends React.Component {
	render() {
		let {
			open,
			message,
			proceedWithOperation,
			proceedWithOperationLabel,
			proceed,
			proceedLabel,
			handleClose,
		} = this.props;

		return (
			<Dialog
				open={open}
				titleStyle={{padding: 0}}
	      		title={renderDialogTitle(
	      			(<Subheader>
	      				<FlatButton 
	      					icon={<Warning color={warningColor}/>} 
	      					label="Warning !"
	      					labelStyle={{textTransform: "none", fontSize: 20}}
	      				/>
	      			</Subheader>),
	      			handleClose,
	      			null
	      			)}
	      		onRequestClose={handleClose}
	      		contentStyle={{minWidth: 450, minHeight: 400,}}
	      		bodyStyle={{backgroundColor: dialogBodyColor, paddingTop: 0}}
	      		modal={true}
	      		autoScrollBodyContent={true}
	      		actions={[
	      			<FlatButton
	      				label={proceedWithOperationLabel}
	      				primary={true}
	      				labelStyle={{textTransform: "none", }}
	      				onClick={() => { proceedWithOperation(); handleClose(); }}
	      				keyboardFocused={true}
	      			/>,
	      			<FlatButton
	      				label={proceedLabel}
	      				secondary={true}
	      				labelStyle={{textTransform: "none", }}
	      				onClick={() => { proceed(); handleClose(); }}
	      			/>,
	      			<FlatButton
	      				label="Cancel"
	      				labelStyle={{textTransform: "none", }}
	      				onClick={handleClose}
	      				keyboardFocused={true}
	      			/>
	      		]}
			>
				<p>{message}</p>
			</Dialog>
		)
	}
}