import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import {Tabs, Tab} from 'material-ui/Tabs';

import SignInWindow from '../../containers/Login/SignInWindowContainer';
import RegisterWindow from '../../containers/Login/RegisterWindowContainer';
import VerificationWindow from '../../containers/Login/VerificationWindowContainer';

import Close from 'material-ui/svg-icons/navigation/close';
import {
	grey50 as dialogBodyColor,
	grey200 as tabColor,
	grey900 as tabTextColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

import { LoginModes } from '../../reducers/User';
import { login } from '../../backend/cognito';


const signInDialogStyle = {
	title: "Sign In",
}

const registerDialogStyle = {
	title:"Create a new account",
}


export default class Login extends React.Component {
	state = {
		username: 'test',
      	password: '1234567890',
      	email: '',
	}

	setUserName = (name) => {
		this.setState({username: name});
	}

	setPassword = (password) => {
		this.setState({password: password});
	}

	setEmail = (email) => {
		this.setState({email: email});
	}

	clearField = () => {
		this.setState({
			username: '',
			password: '',
			email: '',
		});
	}

	handleClose = () => {
		this.clearField();
		this.props.handleClose();
	}

	handleSignIn = (onFailure, isFirstTime=false) => {

		var authenticationData = {
			Username: this.state.username,
			Password: this.state.password
		}


		login(this.state.username,
			authenticationData,
			() => {
				if (isFirstTime) {
					this.props.signUp();
				} else {
					this.props.signIn();
				}
				this.clearField();
			},
			onFailure);
		
	}


	render() {
		let { open } = this.props;
		let { renderContent, handleClose } = this;

		return (
			<Dialog
          		open={open}
          		titleStyle={{padding: 0}}
          		title={
          			<div style={{display: 'flex', backgroundColor: dialogBodyColor}}>
          			<Subheader style={{fontSize: 24}}></Subheader>
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
				      >
				      <Tab label={signInDialogStyle.title} 
				      		value={LoginModes.signIn}
				      		buttonStyle={{
				      			backgroundColor: (LoginModes.signIn === loginMode) ? null : tabColor,
				      			textTransform: "none",
				      			fontSize: 15
				      		}}
				      		style={{
				      		 	color: (LoginModes.signIn === loginMode) ? 'white' : tabTextColor
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

				      	/>
				      </Tab>
				      <Tab label={registerDialogStyle.title} 
				      		value={LoginModes.register}
				      		buttonStyle={{
				      			backgroundColor: (LoginModes.register === loginMode) ? null : tabColor, 
				      			textTransform: "none",
				      			fontSize: 15
				      		}}
				      		style={{
				      			color: (LoginModes.register === loginMode) ? 'white' : tabTextColor
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
				      	/>
				      </Tab>
				   	</Tabs>

			)
			case LoginModes.verification:
				return (
					<VerificationWindow 
						username={username}
						signIn={handleSignIn}
					/>
				)
			default:
				return null;
		}
	}
}

