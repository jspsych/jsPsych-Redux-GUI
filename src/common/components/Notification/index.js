import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';

import Success from 'material-ui/svg-icons/action/check-circle';
import Warning from 'material-ui/svg-icons/alert/warning';
import Fail from 'material-ui/svg-icons/alert/error';
import {
	grey50 as dialogBodyColor,
  	green500 as successColor,
  	yellow500 as warningColor,
  	red500 as errorColor
} from 'material-ui/styles/colors';
import { renderDialogTitle } from '../gadgets';

import { Notify_Type } from '../../reducers/Notification';

export default class Notification extends React.Component {
	renderSnackbarIcon = () => {
		switch(this.props.notifyType) {
			case Notify_Type.success:
				return (<Success color={successColor}/>);
			case Notify_Type.warning:
				return (<Warning color={warningColor}/>);
			case Notify_Type.error:
				return (<Fail color={errorColor}/>);
			default:
				return null;
		}
	}

	renderDialogTitleText = () => {
		switch(this.props.notifyType) {
			case Notify_Type.success:
				return (<Subheader style={{fontSize: 24, color: successColor}}>Done!</Subheader>);
			case Notify_Type.warning:
				return (<Subheader style={{fontSize: 24, color: warningColor}}>Warning!</Subheader>);
			case Notify_Type.error:
				return (<Subheader style={{fontSize: 24, color: errorColor}}>Error!</Subheader>);
			default:
				return null;
		}
	}

	render() {
		let {
			dialogOpen,
			snackbarOpen,
			message,
			handleClose
		} = this.props;


		return (
			<div>
				<Dialog
					open={dialogOpen}
					titleStyle={{padding: 0}}
	          		title={renderDialogTitle(this.renderDialogTitleText(), handleClose, null)}
	          		onRequestClose={handleClose}
	          		contentStyle={{minWidth: 450, minHeight: 400,}}
	          		bodyStyle={{backgroundColor: dialogBodyColor, paddingTop: 0}}
	          		modal={true}
	          		autoScrollBodyContent={true}
	          		actions={[
	          			<FlatButton
	          				label="Okay"
	          				labelStyle={{textTransform: "none", }}
	          				onTouchTap={handleClose}
	          				keyboardFocused={true}
	          			/>
	          		]}
				>
					<p>{message}</p>
				</Dialog>
				<Snackbar
	                open={snackbarOpen}
	                message={ 
	                  <MenuItem 
	                    primaryText={message}
	                    style={{color: 'white'}}
	                    disabled={true}
	                    rightIcon={this.renderSnackbarIcon()}
	                  /> 
	                }
	                autoHideDuration={2500}
	                onRequestClose={handleClose}
	              />
			</div>
		)
	}
}