import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';

import AddTimelineVarIcon from 'material-ui/svg-icons/action/swap-horiz';
import CheckNoIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckYesIcon from 'material-ui/svg-icons/toggle/check-box';

import { DialogTitle } from '../../gadgets';

const colors = {
	...theme.colors,
	checkColor: theme.colors.primary,
}

const style = {
	TriggerIcon: theme.Icon,
	Window: {
		contentStyle: {
			minHeight: 500
		},
		titleStyle: {
			padding: 0
		}
	},
	Content: {
		root: utils.prefixer({
			minHeight: 400, 
			maxHeight: 400,
			heigth: '100%'
		}),
		List: utils.prefixer({
			minHeight: 400,
			maxHeight: 400,
			overflowY: 'auto',
			width: '98%',
			margin: 'auto'
		}),
		Empty: utils.prefixer({
			textAlign: 'center',
			minHeight: 400, 
			maxHeight: 400,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			fontSize: '25px',
			lineHeight: '25px',
			fontWeight: 'bold',
			color: 'grey'
		})
	}
}


class TimelineVariableSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		}

		this.handleOpen = () => {
			this.setState({
				open: true
			});
		}

		this.handleClose = () => {
			this.setState({
				open: false
			});
		}
	}

	static defaultProps = {
		title: "Timeline Variables",
		onCommit: () => {},
		Trigger: ({onClick}) => (
			<IconButton onClick={onClick} tooltip="Insert timeline variable">
				<AddTimelineVarIcon {...style.TriggerIcon}/>
			</IconButton>
		),
		value: ''
	}

	render() {
		let { timelineVariables } = this.props;
		let isEmpty = Array.isArray(timelineVariables) && timelineVariables.length === 0;

		let list = (
			<List style={{...style.Content.List}}>
				{
					Array.isArray(timelineVariables) && timelineVariables.map((v) => (
						<ListItem 
							primaryText={!v ? "null" : v} 
							key={"TimelineVariableSelector-"+v}
							onClick={() => { this.props.onCommit(v); }}
							rightIcon={
								v === this.props.value ? <CheckYesIcon color={colors.checkColor}/> : <CheckNoIcon color={colors.checkColor}/>
							}
						/>
					))
				}
			</List>
		)

		return (
			<React.Fragment>
				<this.props.Trigger onClick={this.handleOpen}/>
				<Dialog
					open={this.state.open}
					modal={true}
					title={
						<DialogTitle 
							node={
								<Subheader style={{fontSize: 20, maxHeight: 48}}>
									{this.props.title}
								</Subheader>
							}
							closeCallback={this.handleClose}
						/>
					}
					actions={[]}
					{...style.Window}
				>	
					<Paper style={{...style.Content.root}}>
						{isEmpty ? 
							<div style={{...style.Content.Empty}}>
								There is no available timeline variable for this trial.
							</div> :
							list
						}
					</Paper>
				</Dialog>
			</React.Fragment>
		)
	}
}

export default TimelineVariableSelector;