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
	TextFieldFocusStyle: (error = false) => ({
		...theme.TextFieldFocusStyle(error)
	}),
	progress: {
		color: colors.primary,
	},
}

export default class Notifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			extraCareInput: '',
			extraCareErrorText: '',
			processingWithOp: false,
			processingWithoutOp: false
		}

		this.setExtraCareInput = (evt, v) => {
			this.setState({
				extraCareInput: v,
				extraCareErrorText: v === this.props.extraCareText ? '' : 'Please input the above text exactly.'
			});
		}

		this.handleDialogClose = () => {
			this.props.handleDialogClose();
			this.setState({
				extraCareInput: '',
				extraCareErrorText: '',
				processingWithOp: false,
				processingWithoutOp: false
			});
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
				processingWithOutOp: true
			});
			this.props.continueWithoutOperation().then(this.handleDialogClose).catch((err) => {
				console.log(err);
			}).finally(() => {
				this.setState({
					processingWithOutOp: false
				});
			});
		}

		this.continueWithOperation = () => {
			let proceed = () => {
				this.setState({
					processingWithOp: true
				});
				this.props.continueWithOperation().then(this.handleDialogClose).catch((err) => {
					console.log(err);
				}).finally(() => {
					this.setState({
						processingWithOp: false
					});
				});
			}
			if (this.props.withExtraCare) {
				if (this.props.extraCareText === this.state.extraCareInput.trim()) {
					proceed();
				} else {
					this.setState({
						extraCareErrorText: "Please input the prompt exactly."
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
	}

	render() {
		let {
			notifyType,
			message,
			dialogOpen,
			snackbarOpen,
			withExtraCare,
			extraCareText
		} = this.props;

		let { extraCareInput, extraCareErrorText } = this.state;
		
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
	      				onClick={this.handleDialogClose}
	      			/>
				);
			}
		} else {
			dialogActions = [
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
	          		actions={dialogActions}
				>
					<p>{message}</p>
					{
						notifyType === enums.Notify_Type.confirm && withExtraCare ?
						<React.Fragment>
						  <p>
						  	Please input:
						  	<span 
						  		style={{
						  			color: colors.primaryDeep,
						  			fontWeight: 'bold'
						  		}}
						  	>
						  		{` ${extraCareText} `}
						  	</span> 
						  	to confirm your operation.
						  </p>
						  <div  style={{ width: '50%' }}>
				              <TextField 
				                {...style.TextFieldFocusStyle(!!extraCareErrorText)}
				                id="extra-care-input" 
				                fullWidth 
				                errorText={extraCareErrorText} 
				                value={extraCareInput} 
				                onChange={this.setExtraCareInput}
				                />
				           </div>
				        </React.Fragment>:
						null
					}
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