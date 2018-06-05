import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import {Tabs, Tab} from 'material-ui/Tabs';

import SignInWindow from '../../containers/Login/SignInWindowContainer';
import RegisterWindow from '../../containers/Login/RegisterWindowContainer';
import VerificationWindow from '../../containers/Login/VerificationWindowContainer';
import ForgotPasswordWindow from '../../containers/Login/ForgotPasswordWindowContainer';

import { DialogTitle } from '../gadgets';

const AUTH_MODES = {
	signIn: 'signIn',
	register: 'register',
	verification: 'verification',
	forgetPassword: 'forgetPassword'
}

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
			backgroundColor: (AUTH_MODES.signIn === loginMode) ? colors.primary : colors.tabColor,
			textTransform: "none",
			fontSize: 15
		}),
		style: loginMode => ({
			color: (AUTH_MODES.signIn === loginMode) ? 'white' : colors.tabTextColor
		})
	},
	Tab_Register: {
		buttonStyle: loginMode => ({
			backgroundColor: (AUTH_MODES.register === loginMode) ? colors.primary : colors.tabColor,
			textTransform: "none",
			fontSize: 15
		}),
		style: loginMode => ({
			color: (AUTH_MODES.register === loginMode) ? 'white' : colors.tabTextColor
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
	      	open: false,
	      	loginMode: AUTH_MODES.signIn
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
			this.setState({
				open: false
			})
		}

		this.handleOpen = () => {
			this.setState({
				open: true
			})
		}

		this.setLoginMode = (m) => {
			this.setState({
				loginMode: m
			})
		}

		this.popVerification = () => {
			this.handleOpen();
			this.setLoginMode(AUTH_MODES.verification)
		}

		this.popSignIn = () => {
			this.handleOpen();
			this.setLoginMode(AUTH_MODES.signIn)
		}

		this.popRegister = () => {
			this.handleOpen();
			this.setLoginMode(AUTH_MODES.register)
		}

		this.popForgetPassword = () => {
			this.handleOpen();
			this.setLoginMode(AUTH_MODES.forgetPassword)
		}

		this.renderContent = () => {
			let {
				username,
				password,
				email,
				loginMode
			} = this.state;

			let {
				setUserName,
				setPassword,
				setEmail,
				setLoginMode,
				popVerification,
				clearField,
				handleClose
			} = this;


			switch(loginMode) {
				case AUTH_MODES.signIn:
				case AUTH_MODES.register:
					return (
						<Tabs
					        value={loginMode}
					        onChange={(mode) => { setLoginMode(mode); clearField(); }}
					        {...style.Tabs}
					      >
					      <Tab label={"Sign In"} 
					      		value={AUTH_MODES.signIn}
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
					      		signIn={this.props.signIn}
					      		setUserName={setUserName}
					      		setPassword={setPassword}
					      		username={username}
					      		password={password}
					      	/>
					      </Tab>
					      <Tab label={"Create a new account"} 
					      		value={AUTH_MODES.register}
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
				case AUTH_MODES.verification:
					return (
						<VerificationWindow 
							username={username}
							signIn={this.props.signIn}
							verify={this.props.verify}
						/>
					)
				case AUTH_MODES.forgetPassword:
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
          		open={this.state.open}
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
          		autoScrollBodyContent={true}
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

