import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import Success from 'material-ui/svg-icons/action/check-circle';
import Warning from 'material-ui/svg-icons/alert/warning';
import Fail from 'material-ui/svg-icons/alert/error';

import { DialogTitle } from '../gadgets';

const colors = {
	...theme.colors,
	dialogBodyColor: '#FAFAFA',
	successColor: '#4CAF50',
	warningColor: '#FFEB3B',
	errorColor: '#F44336'
}

export default class Notifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			extraCareInput: '',
			extraCareError: '',
		}

		this.renderSnackbarIcon = () => {
			switch(this.props.notifyType) {
				case enums.Notify_Type.success:
					return (<Success color={colors.successColor}/>);
				case enums.Notify_Type.warning:
					return (<Warning color={colors.warningColor}/>);
				case enums.Notify_Type.error:
					return (<Fail color={colors.errorColor}/>);
				default:
					return null;
			}
		}

		this.renderDialogTitleText = () => {
			switch(this.props.notifyType) {
				case enums.Notify_Type.success:
					return (<Subheader style={{fontSize: 24, color: colors.successColor}}>Done!</Subheader>);
				case enums.Notify_Type.confirm:
				case enums.Notify_Type.warning:
					return (<Subheader style={{fontSize: 24, color: colors.warningColor}}>Warning!</Subheader>);
				case enums.Notify_Type.error:
					return (<Subheader style={{fontSize: 24, color: colors.errorColor}}>Error!</Subheader>);
				default:
					return null;
			}
		}

		this.continueWithoutOperation = () => {
			this.props.continueWithoutOperation();
			this.props.handleDialogClose();
		}

		this.continueWithOperation = () => {
			let proceed = () => {
				this.props.continueWithOperation();
				this.props.handleDialogClose();
			}
			if (this.props.withExtraCare) {
				if (this.props.extraCareText === this.state.extraCareInput.trim()) {
					proceed();
				} else {
					this.setState({
						extraCareError: "Please input the prompt exactly."
					});
				}
			} else {
				proceed();
			}
		}
	}

	static defaultProps = {
		dialogOpen: false,
		snackbarOpen: false,
		notifyType: enums.Notify_Type.success,
		message: "",

		// confirm
		continueWithOperation: () => {},
		continueWithoutOperation: () => {},
		continueWithOperationLabel: "",
		continueWithoutOperationLabel: "",
		showCancelButton: true,
		withExtraCare: false,
		extraCareText: "",
		extraCareInput: "",
		extraCareError: ""
	}

	render() {
		let {
			notifyType,
			message,
			dialogOpen,
			snackbarOpen,
		} = this.props;
		
		let actions = [];
		if (notifyType === enums.Notify_Type.confirm) {
			actions = [
      			<FlatButton
      				label={this.props.continueWithOperationLabel}
      				labelStyle={{textTransform: "none", color: colors.primaryDeep}}
      				onClick={this.continueWithOperation}
      				keyboardFocused={true}
      			/>,
				<FlatButton
      				label={this.props.continueWithoutOperationLabel}
      				labelStyle={{textTransform: "none", color: colors.secondaryDeep}}
      				onClick={this.continueWithoutOperation}
      				keyboardFocused={true}
      			/>
			]
			if (this.props.showCancelButton) {
				action.push(
					<FlatButton
	      				label="Cancel"
	      				labelStyle={{textTransform: "none", }}
	      				onClick={this.props.handleDialogClose}
	      			/>
				)
			}
		} else {
			actions = [
      			<FlatButton
      				label="Okay"
      				labelStyle={{textTransform: "none", color: colors.primaryDeep}}
      				onClick={this.props.handleDialogClose}
      				keyboardFocused={true}
      			/>
      		]
		}

		return (
			<div>
				<Dialog
					open={dialogOpen}
					style={{zIndex: 9999999}}
					titleStyle={{padding: 0}}
	          		title={
	          			<DialogTitle
	          				node={this.renderDialogTitleText()}
	          				showCloseButton={false}
	          			/>
	          		}
	          		contentStyle={{minWidth: 450, minHeight: 400,}}
	          		bodyStyle={{backgroundColor: colors.dialogBodyColor, paddingTop: 0}}
	          		modal
	          		autoScrollBodyContent
	          		actions={actions}
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
	                onRequestClose={this.handleSnackbarClose}
	              />
			</div>
		)
	}
}