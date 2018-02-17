import React from 'react';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';

import AddTimelineVarIcon from 'material-ui/svg-icons/action/swap-horiz';
// import DialogIcon from 'material-ui/svg-icons/action/shopping-basket';
import UncheckStar from 'material-ui/svg-icons/toggle/star-border';
import CheckStar from 'material-ui/svg-icons/toggle/star';
import CheckNoIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckYesIcon from 'material-ui/svg-icons/toggle/check-box';
import {
	cyan500 as checkColor,
	// blue500 as titleIconColor,
	yellow500 as checkStarColor,
} from 'material-ui/styles/colors';

import GeneralTheme from '../../theme.js';

const hoverColor = GeneralTheme.colors.secondary;

const style = {
	TriggerIcon: GeneralTheme.Icon
}

import { renderDialogTitle } from '../../gadgets';

export default class TimelineVariableSelector extends React.Component {
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
		submitCallback: function(newCode) {
			return;
		},
		setParamMode: function() {
			return;
		},
		Trigger: ({onClick}) => (
			<IconButton onClick={onClick} tooltip="Insert timeline variable">
				<AddTimelineVarIcon {...style.TriggerIcon}/>
			</IconButton>
		)
	}

	render() {
		return (
			<div>
				<this.props.Trigger onClick={this.handleOpen}/>
				<Dialog
					open={this.state.open}
					contentStyle={{minHeight: 500}}
					modal={true}
					titleStyle={{padding: 0}}
					title={
						renderDialogTitle(
							<Subheader style={{fontSize: 20, maxHeight: 48}}>
							{this.props.title}
							</Subheader>, 
							this.handleClose, 
							null)
					}
					actions={[]}
				>	
					<div style={{display: 'flex'}}>
			              <p style={{paddingTop: 15, color: (this.props.useFunc) ? 'blue' : 'black'}}>
			                Use Timeline Variable:
			              </p>
			              <IconButton
			                onClick={this.props.setParamMode}
			                >
			                {(this.props.useTV) ? <CheckStar color={checkStarColor} /> : <UncheckStar />}
			                </IconButton>
			         </div>
					<Paper style={{minHeight: 400, maxHeight: 400}}>
						<List style={{minHeight: 400, maxHeight: 400, overflowY: 'auto', width: '98%', margin: 'auto'}}>
							{this.props.timelineVariables.map((v) => (
								<ListItem 
									primaryText={!v ? "null" : v} 
									key={"TimelineVariableSelector-"+v}
									onClick={() => {
										this.props.submitCallback(v);
									}}
									rightIcon={
										v === this.props.selectedTV ? <CheckYesIcon color={checkColor}/> : <CheckNoIcon color={checkColor}/>
									}
								/>
							))}
						</List>
					</Paper>
				</Dialog>
			</div>
		)
	}
}

// <div style={{display: 'flex'}}>
// 								<div style={{paddingTop: 4, paddingRight: 10}}>
// 									<DialogIcon color={titleIconColor}/>
// 								</div>
// 								<div style={{fontSize: 20,}}>
// 			      					{this.props.title}
// 			      				</div>
// 		      				</div>