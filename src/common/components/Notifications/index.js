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
import {
	grey50 as dialogBodyColor,
  	green500 as successColor,
  	yellow500 as warningColor,
  	red500 as errorColor
} from 'material-ui/styles/colors';
import { DialogTitle } from '../gadgets';

const colors = {
	...theme.colors,
	dialogBodyColor: '#FAFAFA'
}

const Notify_Type = {
	success: "success",
	warning: "warning",
	error: "error",
	confirm: "confirm"
}

export default class Notification extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dialogOpen: false,
			snackbarOpen: false,
			notifyType: Notify_Type.success,
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

		this.renderSnackbarIcon = () => {
			switch(this.state.notifyType) {
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

		this.renderDialogTitleText = () => {
			switch(this.state.notifyType) {
				case Notify_Type.success:
					return (<Subheader style={{fontSize: 24, color: successColor}}>Done!</Subheader>);
				case Notify_Type.confirm:
				case Notify_Type.warning:
					return (<Subheader style={{fontSize: 24, color: warningColor}}>Warning!</Subheader>);
				case Notify_Type.error:
					return (<Subheader style={{fontSize: 24, color: errorColor}}>Error!</Subheader>);
				default:
					return null;
			}
		}

		this.handleDialogClose = () => {
			this.setState({
				dialogOpen: false
			})
		}

		this.handleSnackbarClose = () => {
			this.setState({
				snackbarOpen: false
			})
		}

		this.notifySuccessByDialog = (message) => {
			this.setState({
				message: message,
				dialogOpen: true,
				notifyType: Notify_Type.success
			})
		}

		this.notifyWarningByDialog = (message) => {
			this.setState({
				message: message,
				dialogOpen: true,
				notifyType: Notify_Type.warning
			})
		}

		this.notifyErrorByDialog = (message) => {
			this.setState({
				message: message,
				dialogOpen: true,
				notifyType: Notify_Type.error
			})
		}

		this.notifySuccessBySnackbar = (message) => {
			this.setState({
				message: message,
				snackbarOpen: true,
				notifyType: Notify_Type.success
			})
		}

		this.notifyWarningBySnackbar = (message) => {
			this.setState({
				message: message,
				snackbarOpen: true,
				notifyType: Notify_Type.warning
			})
		}

		this.notifyErrorBySnackbar = (message) => {
			this.setState({
				message: message,
				snackbarOpen: true,
				notifyType: Notify_Type.error
			})
		}

		this.continueWithOperation = () => {
			let proceed = () => {
				this.state.continueWithOperation();
				this.handleDialogClose();
			}
			if (this.state.withExtraCare) {
				if (this.state.extraCareText === this.state.extraCareInput.trim()) {
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

		this.continueWithoutOperation = () => {
			this.state.continueWithoutOperation();
			this.handleDialogClose();
		}

		this.popUpConfirmation = (args={
			message:"",
			continueWithOperation: ()=>{},
			continueWithoutOperation: ()=>{},
			continueWithOperationLabel: "Yes",
			continueWithoutOperationLabel: "No",
			showCancelButton: true,
			withExtraCare: false,
			extraCareText: "Yes, I know what I am doing."
		}) => {
			this.setState({
				dialogOpen: true,
				...args
			});
		}
	}

	static defaultProps = {
		onRef: (el) => {}
	}

	componentDidMount() {
    	this.props.onRef(this);
  	}
  
  	componentWillUnmount() {
    	this.props.onRef(null);
  	}

	render() {
		let {
			notifyType,
			message,
			dialogOpen,
			snackbarOpen,
		} = this.state;


		let actions = [];
		if (notifyType === Notify_Type.confirm) {
			actions = [
      			<FlatButton
      				label={this.state.continueWithOperationLabel}
      				labelStyle={{textTransform: "none", color: colors.primaryDeep}}
      				onClick={this.continueWithOperation}
      				keyboardFocused={true}
      			/>,
				<FlatButton
      				label={this.state.continueWithoutOperationLabel}
      				labelStyle={{textTransform: "none", color: colors.secondaryDeep}}
      				onClick={this.continueWithoutOperation}
      				keyboardFocused={true}
      			/>
			]
			if (this.state.showCancelButton) {
				action.push(
					<FlatButton
	      				label="Cancel"
	      				labelStyle={{textTransform: "none", }}
	      				onClick={this.handleDialogClose}
	      			/>
				)
			}
		} else {
			actions = [
      			<FlatButton
      				label="Okay"
      				labelStyle={{textTransform: "none", color: colors.primaryDeep}}
      				onClick={this.handleDialogClose}
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