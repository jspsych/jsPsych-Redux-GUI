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
import GeneralTheme from '../theme.js';

const colors = {
	...GeneralTheme.colors
}

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
			showCloseButton
		} = this.props;

		let actions = [
			<FlatButton
  				label={proceedWithOperationLabel}
  				labelStyle={{textTransform: "none", color: colors.primary }}
  				onClick={() => { proceedWithOperation(); handleClose(); }}
  			/>,
  			<FlatButton
  				label={proceedLabel}
  				labelStyle={{textTransform: "none", color: colors.secondary }}
  				onClick={() => { proceed(); handleClose(); }}
  				keyboardFocused={true}
  			/>
		]
		if (showCloseButton) {
			actions.push(
				<FlatButton
      				label="Cancel"
      				labelStyle={{textTransform: "none", }}
      				onClick={handleClose}
      			/>
			)
		}

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
	      			null,
	      			{},
	      			false
	      			)}
	      		onRequestClose={handleClose}
	      		contentStyle={{minWidth: 450, minHeight: 400,}}
	      		bodyStyle={{backgroundColor: dialogBodyColor, paddingTop: 0}}
	      		modal={true}
	      		autoScrollBodyContent={true}
	      		actions={actions}
			>
				<p>{message}</p>
			</Dialog>
		)
	}
}