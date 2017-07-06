import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

import Media from 'material-ui/svg-icons/action/shopping-cart';
import Add from 'material-ui/svg-icons/av/library-add';
import CheckNoIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckYesIcon from 'material-ui/svg-icons/toggle/check-box';
import {
	grey100 as dialogBodyColor,
	blue800 as titleIconColor,
	cyan500 as checkColor,
	indigo500 as hoverColor,
	pink500 as iconColor
} from 'material-ui/styles/colors';
import { fileIconFromTitle } from '../../Appbar/MediaManager';
import { renderDialogTitle } from '../../gadgets';

export default class MediaSelector extends React.Component {
	// parameterNameeter name is a must
	static propTypes = {
		parameterName: PropTypes.string
	};

	state = {
		open: false,
		s3files: {},
		selected: ""
	}

	handleOpen = () => {
		this.setState({
			open: true
		});
		this.props.updateFileList((update) => {
			this.setState(update);
		});
	}

	handleClose = () => {
		this.setState({
			open: false
		});
	}

	handleSelect = (n) => {
		let newI = n;
		if (this.state.selected === n) {
			newI = "";
		}
		this.setState({
			selected: newI
		});
	}


	renderTrigger = () => {
		return (
			<div style={{display:'flex'}}>
				<AutoComplete
					id="Selected-File-Input"
					fullWidth={true}
					searchText={this.state.selected.replace(this.state.s3files.Prefix, '')}
					dataSource={[this.state.selected.replace(this.state.s3files.Prefix, '')]}
				/>
				<IconButton 
					onTouchTap={this.handleOpen}
				>
					<Add hoverColor={hoverColor} color={iconColor}/>
				</IconButton>
			</div>
		)
	}

	renderFiles = () => {
		if (!this.state.s3files.Contents) return;
		return this.state.s3files.Contents.map((f) => {
			let filename = f.Key.replace(this.state.s3files.Prefix, '');
			return (
				<ListItem
					key={f.ETag}
					primaryText={filename}
					leftIcon={fileIconFromTitle(f.Key)}
					rightIconButton={
							<IconButton
								onTouchTap={() => {this.handleSelect(f.Key)}}
								>
								{(this.state.selected === f.Key) ? <CheckYesIcon color={checkColor}/> : <CheckNoIcon color={checkColor}/>}
							</IconButton>}
				/>
			)
		})
	}

	insertFile = () => {
		if (this.state.selected !== "") {
			this.props.insertFile(this.props.parameterName, this.state.selected)
		}
		this.handleClose();
	}

	render() {
		let {
			handleClose,
			handleOpen,
			renderFiles,
			insertFile,
			renderTrigger
		} = this;
		const actions = [
			<FlatButton 
				label="Insert"
				primary={true}
				onTouchTap={insertFile}
				labelStyle={{textTransform: 'none'}}
			/>,
			<FlatButton
				label="Close"
				secondary={true}
				onTouchTap={handleClose}
				labelStyle={{textTransform: 'none'}}
			/>
		];
		return (
			<div className="Media-Selector">
				{renderTrigger()}
				<Dialog
					open={this.state.open}
					titleStyle={{padding: 0,}}
					title={
						renderDialogTitle(
							<Subheader style={{maxHeight: 48}}>
			      				<div style={{display: 'flex'}}>
								<div style={{paddingTop: 8, paddingRight: 10}}>
									<Media color={titleIconColor}/>
								</div>
								<div style={{fontSize: 20,}}>
			      					Add Media Resources
			      				</div>
			      				</div>
		      				</Subheader>,
							handleClose,
							null
						)
					}
					onRequestClose={handleClose}
					bodyStyle={{backgroundColor: dialogBodyColor}}
					autoScrollBodyContent={true}
					modal={true}
					actions={actions}
				>
					<div style={{paddingTop: 10}}>
						<Paper style={{minHeight: 400, maxHeight: 400}}>
							<List style={{minHeight: 400, maxHeight: 400, overflowY: 'auto'}}>
								{renderFiles()}
							</List>
						</Paper>
					</div>
				</Dialog>
			</div>
		)
	}
}