import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import {Tabs, Tab} from 'material-ui/Tabs';

import SignInWindow from './SignInWindow.js';
import RegisterWindow from './RegisterWindow.js';
import VerificationWindow from './VerificationWindow.js';
import ForgotPasswordWindow from './ForgotPasswordWindow.js';

import { DialogTitle } from '../gadgets';


const colors = {
	...theme.colors,
	tabTextColor: '#212121',
	tabColor: '#EEEEEE',
	dialogBodyColor: '#FAFAFA'
}

const style = {
	Tabs: {
		inkBarStyle: {
			backgroundColor: colors.secondary
		}
	},
	Tab_SignIn: {
		buttonStyle: loginMode => ({
			backgroundColor: (enums.AUTH_MODES.signIn === loginMode) ? colors.primary : colors.tabColor,
			textTransform: "none",
			fontSize: 15
		}),
		style: loginMode => ({
			color: (enums.AUTH_MODES.signIn === loginMode) ? 'white' : colors.tabTextColor
		})
	},
	Tab_Register: {
		buttonStyle: loginMode => ({
			backgroundColor: (enums.AUTH_MODES.register === loginMode) ? colors.primary : colors.tabColor,
			textTransform: "none",
			fontSize: 15
		}),
		style: loginMode => ({
			color: (enums.AUTH_MODES.register === loginMode) ? 'white' : colors.tabTextColor
		})
	},
}


export default class Authentications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
	      	password: '',
	      	email: '',
	      	loginMode: enums.AUTH_MODES.signIn
		}

		this.setUserName = (name) => {
			this.setState({username: name});
		}

		this.setPassword = (password) => {
			this.setState({password: password});
		}

		this.setEmail = (email) => {
			this.setState({email: email});
		}

		this.clearField = () => {
			this.setState({
				username: '',
				password: '',
				email: '',
			});
		}

		this.handleClose = () => {
			this.clearField();
			this.props.handleWindowClose();
		}

		this.renderContent = () => {
			let {
				username,
				password,
				email,
			} = this.state;

			let {
				setUserName,
				setPassword,
				setEmail,
				clearField,
				handleClose
			} = this;

			let {
				loginMode,
				setLoginMode,
				popForgetPassword,
				popVerification
			} = this.props;
			
			switch(loginMode) {
				case enums.AUTH_MODES.signIn:
				case enums.AUTH_MODES.register:
					return (
						<Tabs
					        value={loginMode}
					        onChange={(mode) => { setLoginMode(mode); clearField(); }}
					        {...style.Tabs}
					      >
					      <Tab label={"Sign In"} 
					      		value={enums.AUTH_MODES.signIn}
					      		buttonStyle={{
					      			...style.Tab_SignIn.buttonStyle(loginMode),
					      		}}
					      		style={{
					      			...style.Tab_SignIn.style(loginMode),
					      		}}>
					      	<div style={{paddingTop: 10}} />
					      	<SignInWindow 
					      		handleClose={handleClose}
					      		popVerification={popVerification}
					      		popForgetPassword={popForgetPassword}
					      		signIn={this.props.signIn}
					      		setUserName={setUserName}
					      		setPassword={setPassword}
					      		username={username}
					      		password={password}
					      	/>
					      </Tab>
					      <Tab label={"Create a new account"} 
					      		value={enums.AUTH_MODES.register}
					      		buttonStyle={{
					      			...style.Tab_Register.buttonStyle(loginMode),
					      		}}
					      		style={{
					      			...style.Tab_Register.style(loginMode),
					      		}}>
					      	<div style={{paddingTop: 10}} />
					      	<RegisterWindow
					      		handleClose={handleClose}
					      		popVerification={popVerification}
					      		username={username}
					      		password={password}
					      		email={email}
					      		setUserName={setUserName}
					      		setPassword={setPassword}
					      		setEmail={setEmail}
					      		signUp={this.props.signUp}
					      	/>
					      </Tab>
					   	</Tabs>

				)
				case enums.AUTH_MODES.verification:
					return (
						<VerificationWindow 
							username={username}
							handleClose={handleClose}
						/>
					)
				case enums.AUTH_MODES.forgotPassword:
					return (
						<ForgotPasswordWindow 
							handleClose={handleClose}
							username={username}
							password={password}
							setUserName={setUserName}
							setPassword={setPassword}
							signIn={this.props.signIn}
						/>

					)
				default:
					return null;
			}
		}
	}

	render() {

		return (
			<Dialog
          		open={this.props.open}
          		titleStyle={{padding: 0}}
          		title={
          			<DialogTitle
          				node={<Subheader></Subheader>}
          				showCloseButton={true}
          				closeCallback={this.handleClose}
          			/>
          		}
          		onRequestClose={this.handleClose}
          		contentStyle={{width: 450, height: 600,}}
          		bodyStyle={{backgroundColor: colors.dialogBodyColor, paddingTop: 0}}
          		modal={false}
          		autoScrollBodyContent
			>
				<div>
				{
					this.renderContent()
				}
				</div>
			</Dialog>
		)
	}
}

