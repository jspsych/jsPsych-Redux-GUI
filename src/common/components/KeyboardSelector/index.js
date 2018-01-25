import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import GeneralTheme from '../theme.js';

const colors = {
	...GeneralTheme.colors
}

const keyChoices = [
	..."1234567890-=`qwertyuiopasdfghjklzxcvbnm[]\\;',./".split(''),
	'enter',
	'space',
	'backspace',
	'tab',
	'home',
	'insert',
	'delete',
	'pgup',
	'pgdn',
	'home',
	'end',
	'up',
	'down',
	'left',
	'right'
]

export default KeyboardSelector extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		mulitSelect: false,
		value: '',
	}

	render() {

		return (

		)
	}
}