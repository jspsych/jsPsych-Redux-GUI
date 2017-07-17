import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import {
  green500 as checkColor,
  blue500 as titleIconColor
} from 'material-ui/styles/colors';
import AddTimelineVarIcon from 'material-ui/svg-icons/action/swap-horiz';
import CheckIcon from 'material-ui/svg-icons/toggle/radio-button-checked';

import { renderDialogTitle } from '../../gadgets';

export default class TimelineVariableSelector extends React.Component {
	static propTypes = {
		submitCallback: PropTypes.func,
		openCallback: PropTypes.func,
		closeCallback: PropTypes.func,
		setParamMode: PropTypes.func,
		title: PropTypes.string
	};

	static defaultProps = {
		title: "Code Editor",
		openCallback: function() {
			return;
		},
		closeCallback: function() {
			return;
		},
		submitCallback: function(newCode) {
			return;
		},
	}

	state = {
		open: false
	}

	handleOpen = () => {
		this.setState({
			open: true
		});
		this.props.openCallback();
	}

	handleClose = () => {
		this.setState({
			open: false
		});
		this.props.closeCallback();
	}


	render() {
		return (
			<div>
				<IconButton onTouchTap={this.handleOpen}>
					<AddTimelineVarIcon />
				</IconButton>
				<Dialog
					open={this.state.open}
					contentStyle={{minHeight: 500}}
					modal={true}
					titleStyle={{padding: 0}}
					title={renderDialogTitle(<Subheader style={{fontSize: 18}}>{this.props.title}</Subheader>, this.handleClose, null)}
				>
					<List>
						{this.props.timelineVariables.map((v) => (
							<ListItem primaryText={v} />
						))}
					</List>
				</Dialog>
			</div>
		)
	}
}