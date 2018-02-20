import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import {Tabs, Tab} from 'material-ui/Tabs';

import SignInWindow from '../../containers/Login/SignInWindowContainer';
import RegisterWindow from '../../containers/Login/RegisterWindowContainer';
import VerificationWindow from '../../containers/Login/VerificationWindowContainer';
import ForgotPasswordWindow from '../../containers/Login/ForgotPasswordWindowContainer';

import {
	grey50 as dialogBodyColor,
} from 'material-ui/styles/colors';

import { LoginModes } from '../../reducers/User';
import { login } from '../../backend/cognito';
import { renderDialogTitle } from '../gadgets';

import GeneralTheme from '../theme.js';

const colors = {
	...GeneralTheme.colors,
	tabTextColor: '#212121',
	tabColor: '#EEEEEE'
}

const style = {
	Tabs: {
		inkBarStyle: {
			backgroundColor: colors.secondary
		}
	},
	Tab_SignIn: {
		buttonStyle: loginMode => ({
			backgroundColor: (LoginModes.signIn === loginMode) ? colors.primary : colors.tabColor,
			textTransform: "none",
			fontSize: 15
		}),
		style: loginMode => ({
			color: (LoginModes.signIn === loginMode) ? 'white' : colors.tabTextColor
		})
	},
	Tab_Register: {
		buttonStyle: loginMode => ({
			backgroundColor: (LoginModes.register === loginMode) ? colors.primary : colors.tabColor,
			textTransform: "none",
			fontSize: 15
		}),
		style: loginMode => ({
			color: (LoginModes.register === loginMode) ? 'white' : colors.tabTextColor
		})
	},
}

const signInDialogStyle = {
	title: "Sign In",
}

const registerDialogStyle = {
	title:"Create a new account",
}


export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
	      	password: '',
	      	email: '',
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
			this.props.handleClose();
		}

		// isFirstTime denotes if it is first signIn after signing up
		this.handleSignIn = (onFailure, isFirstTime=false) => {
			var authenticationData = {
				Username: this.state.username,
				Password: this.state.password
			}
			
			login(this.state.username,
				authenticationData,
				() => {
					if (isFirstTime) {
						// signUpPush flow, see container
						this.props.signUp();
					} else {
						// signIn pull, see container
						this.props.signIn();
					}
					this.clearField();
				},
				onFailure);
		}
	}


	render() {
		let { open } = this.props;
		let { renderContent, handleClose } = this;

		return (
			<Dialog
          		open={open}
          		titleStyle={{padding: 0}}
          		title={renderDialogTitle(<Subheader></Subheader>, handleClose)}
          		onRequestClose={handleClose}
          		contentStyle={{width: 450, height: 600,}}
          		bodyStyle={{backgroundColor: dialogBodyColor, paddingTop: 0}}
          		modal={false}
          		autoScrollBodyContent={true}
			>
				<div>
				{
					renderContent()
				}
				</div>
			</Dialog>
		)
	}


	renderContent = () => {
		let {
			loginMode,
			handleClose,
			popVerification,
			setLoginMode,
			notifyError
		} = this.props;
		let { username, password, email } = this.state;

		let {
			setUserName,
			setPassword,
			setEmail,
			handleSignIn,
			clearField
		} = this;

		switch(loginMode) {
			case LoginModes.signIn:
			case LoginModes.register:
				return (
					<Tabs
				        value={loginMode}
				        onChange={(mode) => { setLoginMode(mode); clearField(); }}
				        {...style.Tabs}
				      >
				      <Tab label={signInDialogStyle.title} 
				      		value={LoginModes.signIn}
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
				      		username={username}
				      		password={password}
				      		setUserName={setUserName}
				      		setPassword={setPassword}
				      		signIn={handleSignIn}
				      		notifyError={notifyError}
				      	/>
				      </Tab>
				      <Tab label={registerDialogStyle.title} 
				      		value={LoginModes.register}
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
				      		notifyError={notifyError}
				      	/>
				      </Tab>
				   	</Tabs>

			)
			case LoginModes.verification:
				return (
					<VerificationWindow 
						username={username}
						signIn={handleSignIn}
				      	notifyError={notifyError}
					/>
				)
			case LoginModes.forgotPassword:
				return (
					<ForgotPasswordWindow 
						handleClose={handleClose}
						username={username}
						password={password}
						setUserName={setUserName}
						setPassword={setPassword}
						signIn={handleSignIn}
				      	notifyError={notifyError}
					/>

				)
			default:
				return null;
		}
	}
}

