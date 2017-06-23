import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const switchDialog = (mode) => {
	switch(mode) {
		// sign in 
		case 0:
			return {
				title: "Sign In",
				contentStyle: {width: '320px'},
				actions: null,
			};
		// register
		case 1:
			return {
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
			};
		// verification
		case 2:
			return {
				
			}

	}
}

export default class Login extends React.Component {
	static propTypes = {
		loginMode: PropTypes.number,
		buttonLabel: PropTypes.string,
		buttonIcon: PropTypes.object,
	};

	static defaultProps = {
		buttonLabel: "",
		buttonIcon: null,
		loginMode: 1,
	}

	state = {
		buttonLabel: this.props.buttonLabel,
		buttonIcon: this.props.buttonIcon,
		loginMode: this.props.loginMode,
		open: false,
	}

	render() {
		let { buttonLabel, buttonIcon, loginMode, open } = this.props;
		return (
			
		)
	}
}

