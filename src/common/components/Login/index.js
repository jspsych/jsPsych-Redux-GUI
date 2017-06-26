import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
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


const signInDialogStyle = {
	title: "Sign In",
	contentStyle: {
		width: '320px'
	},
}

const registerDialogStyle = {
	title:"Create a new account",
	contentStyle: {width: '320px'},
}

const verificationDialogStyle = {
	title: "Email Verification",
	contentStyle: {
		width: '320px'
	},
}

const switchDialog = (mode) => {
	switch(mode) {
		// sign in 
		case LoginModes.signIn:
			return signInDialogStyle;
		// register
		case LoginModes.register:
			return registerDialogStyle;
		// verification
		case LoginModes.verification:
			return verificationDialogStyle;
		default:
			return signInDialogStyle;
	}
}

export default class Login extends React.Component {
	state = {
		username: '',
      	password: '',
	}

	setUserName = (name) => {
		this.setState({username: name});
	}

	setPassword = (password) => {
		this.setState({password: password});
	}

	handleClose = () => {
		this.setState({
			username: '',
			password: '',
		});
		this.props.handleClose();
	}

	render() {
		let { open, handleOpen, loginMode } = this.props;
		let { renderContent, handleClose, } = this;

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
			signIn
		} = this.props;
		let { username, password, } = this.state;

		let {
			setUserName,
			setPassword,
			renderContent,
		} = this;

		switch(loginMode) {
			case LoginModes.signIn:
			case LoginModes.register:
				return (
					<Tabs
				        value={loginMode}
				        onChange={(mode) => { setLoginMode(mode); }}
				      >
				      <Tab label={signInDialogStyle.title} 
				      		value={LoginModes.signIn}
				      		buttonStyle={{
				      			backgroundColor: (LoginModes.signIn === loginMode) ? null : tabColor,
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
				      		signIn={signIn}
				      	/>
				      </Tab>
				      <Tab label={registerDialogStyle.title} 
				      		value={LoginModes.register}
				      		buttonStyle={{
				      			backgroundColor: (LoginModes.register === loginMode) ? null : tabColor, 
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
				      		setUserName={setUserName}
				      		setPassword={setPassword}
				      	/>
				      </Tab>
				   	</Tabs>

			)
			case LoginModes.verification:
				return (
					<VerificationWindow 
						username={username}
						signIn={signIn}
					/>
				)
			default:
				return null;
		}
	}
}

