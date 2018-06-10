import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

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

const style = {
	progress: {
		color: colors.primary
	},
}

export default class Notifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			extraCareInput: '',
			extraCareError: '',
			processingWithOp: false,
			processingWithoutOp: false
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
			this.setState({
				processingWithOp: true
			});
			this.props.continueWithoutOperation().then(this.props.handleDialogClose).catch((err) => {
				console.log(err);
			}).finally(() => {
				this.setState({
					processingWithOp: false
				});
			});
		}

		this.continueWithOperation = () => {
			let proceed = () => {
				this.setState({
					processingWithoutOp: true
				});
				this.props.continueWithOperation().then(this.props.handleDialogClose).catch((err) => {
					console.log(err);
				}).finally(() => {
					this.setState({
						processingWithoutOp: false
					});
				});
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
		continueWithOperation: () => Promise.resolve(),
		continueWithoutOperation: () => Promise.resolve(),
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
		
		let dialogActions = [];
		if (notifyType === enums.Notify_Type.confirm) {
			dialogActions = [
				this.state.processingWithOp ?
				<CircularProgress {...style.progress}/> :
      			<FlatButton
      				label={this.props.continueWithOperationLabel}
      				labelStyle={{textTransform: "none", color: colors.primaryDeep}}
      				onClick={this.continueWithOperation}
      				keyboardFocused={true}
      			/>,
      			this.state.processingWithoutOp ?
      			<CircularProgress {...style.progress}/> :
				<FlatButton
      				label={this.props.continueWithoutOperationLabel}
      				labelStyle={{textTransform: "none", color: colors.secondaryDeep}}
      				onClick={this.continueWithoutOperation}
      				keyboardFocused={true}
      			/>
			]
			if (this.props.showCancelButton) {
				dialogActions.push(
					<FlatButton
	      				label="Cancel"
	      				labelStyle={{textTransform: "none", }}
	      				onClick={this.props.handleDialogClose}
	      			/>
				)
			}
		} else {
			dialogActions = [
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
	          		dialogActions={dialogActions}
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
	                onRequestClose={this.props.handleSnackbarClose}
	              />
			</div>
		)
	}
}