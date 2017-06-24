import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import {Tabs, Tab} from 'material-ui/Tabs';

import SignInWindow from '../../containers/Login/SignInWindowContainer';
import RegisterWindow from '../../containers/Login/RegisterWindowContainer';
import VerificationWindow from '../../containers/Login/VerificationWindowContainer';
import {
	grey50 as dialogBodyColor,
	grey200 as tabColor,
	grey900 as tabTextColor,
} from 'material-ui/styles/colors';

export const LoginModes = {
	signIn: 0,
	register: 1,
	verification: 2,
}

const signInDialogStyle = {
	title: "Sign In",
	contentStyle: {
		width: '320px'
	},
	actions: (<div />),
}

const registerDialogStyle = {
	title:"Create a new account",
	contentStyle: {width: '320px'},
	actions: (onclick) => {
		return (<FlatButton
			        label="Not right now"
			        primary={true}
			        keyboardFocused={true}
			        onTouchTap={onclick}
			      />)
	},
}

const verificationDialogStyle = {
	title: "Email Verification",
	contentStyle: {
		width: '320px'
	},
	actions: (<div />)
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
	// init values
	static propTypes = {
		loginMode: PropTypes.number.isRequired,
		open: PropTypes.bool.isRequired,
		handleOpen: PropTypes.func.isRequired,
		handleClose: PropTypes.func.isRequired
	};

	state = {
		username: '',
      	password: '',
	}

	/*
	If need this function, pass it to reducer state
	*/ 
	popVerification = () => {
		this.props.handleOpen();
		this.props.setLoginMode(LoginModes.verification);
	}

	setUserName = (name) => {
		this.setState({username: name});
	}

	setPassword = (password) => {
		this.setState({password: password});
	}

	render() {
		let { open, handleOpen, handleClose, loginMode } = this.props;
		let { renderContent } = this;

		return (
			<Dialog
          		open={open}
          		onRequestClose={handleClose}
          		contentStyle={{width: 600, height: 600,}}
          		modal={false}
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
		let { loginMode, handleOpen, handleClose, setLoginMode } = this.props;
		let { username, password, } = this.state;

		let {
			popVerification,
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
				        onChange={setLoginMode}
				      >
				      <Tab label={signInDialogStyle.title} 
				      		value={LoginModes.signIn}
				      		buttonStyle={{
				      			backgroundColor: (LoginModes.signIn === loginMode) ? null : tabColor,
				      		}}
				      		style={{
				      		 	color: tabTextColor
				      		}}>
				      	<div style={{paddingTop: 10}} />
				      	<SignInWindow 
				      		handleClose={handleClose}
				      		popVerification={popVerification}
				      		username={username}
				      		password={password}
				      		setUserName={setUserName}
				      		setPassword={setPassword}
				      	/>
				      </Tab>
				      <Tab label={registerDialogStyle.title} 
				      		value={LoginModes.register}
				      		buttonStyle={{
				      			backgroundColor: (LoginModes.register === loginMode) ? null : tabColor, 
				      		}}
				      		style={{
				      			color: tabTextColor
				      		}}>
				      	<div style={{paddingTop: 10}} />
				      	<RegisterWindow
				      		handleOpen={handleOpen}
				      		handleClose={handleClose}
				      		setLoginMode={setLoginMode}
				      	/>
				      </Tab>
				   	</Tabs>

			)
			case LoginModes.verification:
				return (
					<VerificationWindow 
						username={username}
						handleClose={handleClose}
					/>
				)
			default:
				return null;
		}
	}
}

