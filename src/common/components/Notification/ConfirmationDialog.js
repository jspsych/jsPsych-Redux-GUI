import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';

import Close from 'material-ui/svg-icons/navigation/close';
import Warning from 'material-ui/svg-icons/alert/warning';
import {
	grey50 as dialogBodyColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor,
  	yellow500 as warningColor,
} from 'material-ui/styles/colors';

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
	      		title={
	          		<div style={{display: 'flex'}}>
	          			<Subheader>
	          				<MenuItem leftIcon={<Warning color={warningColor}/>} primaryText="Warning !"/>
	          			</Subheader>
	          			<IconButton 
	          				hoveredStyle={{
	          					backgroundColor: CloseBackHighlightColor,
	          				}}
	          				onTouchTap={handleClose}
							disableTouchRipple={true}
						>
						<Close hoverColor={CloseDrawerHoverColor} />
						</IconButton>
					</div>
	      		}
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
	      				onTouchTap={() => { proceedWithOperation(); handleClose(); }}
	      				keyboardFocused={true}
	      			/>,
	      			<FlatButton
	      				label={proceedLabel}
	      				secondary={true}
	      				labelStyle={{textTransform: "none", }}
	      				onTouchTap={() => { proceed(); handleClose(); }}
	      			/>,
	      			<FlatButton
	      				label="Cancel"
	      				labelStyle={{textTransform: "none", }}
	      				onTouchTap={handleClose}
	      				keyboardFocused={true}
	      			/>
	      		]}
			>
				<p>{message}</p>
			</Dialog>
		)
	}
}