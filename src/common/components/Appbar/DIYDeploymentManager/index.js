import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import { ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';

import DIYIcon from 'material-ui/svg-icons/content/archive';
import DIYTitleIcon from 'material-ui/svg-icons/content/archive';

import { renderDialogTitle } from '../../gadgets';
import AppbarTheme from '../theme.js';

import { DIY_Deploy_Mode } from '../../../backend/deploy';

const colors = {
  ...AppbarTheme.colors,
  checkGreen: '#4CAF50',
  cancelRed: '#F44336',
  titleColor: '9B9B9B',
  titleIconColor: '#3F51B5',
  onlineColor: '#03A9F4',
  offlineColor: '#757575',
  defaultFontColor: '#424242',
  infoColor: '#03A9F4',
  settingIconColor: '#795548',
  deleteColor: '#E91E63',
  errorColor: 'red',
  white: '#FEFEFE'
}

const cssStyle = {
	Dialog: {
		Title: utils.prefixer({
			padding: 0
		}),
		Body: utils.prefixer({
			paddingTop: 20
		})
	}
}

const style = {
	Icon: AppbarTheme.AppbarIcon,
	TextFieldFocusStyle: AppbarTheme.TextFieldFocusStyle,
	Actions: {
		Wait: {
			size: 30,
			color: colors.primaryDeep
		}
	},
	SelectFieldStyle: {
		selectedMenuItemStyle: {
			color: colors.secondary
		}
	},
}

export default class DIYDeploymentManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,

			deploying: false,

			total: 0,
      		loaded: [],
      		percent: 0,
		}

		this.update = () => {
			this.setState({
				tempSaveAfter: this.props.saveAfter,
				tempMode: this.props.mode
			})
		}

		this.progressHook = (loadedInfo, total, onFinish = false) => {
			if (onFinish) {
				this.setState({
					loaded: [],
					total: 0,
				})
				return;
			}
			let loaded = this.state.loaded.slice();
			loaded[loadedInfo.index] = loadedInfo.value;

			let percent = loaded.reduce((sum, val) => (sum + val), 0) / total * 100;
			this.setState({
				loaded: loaded,
				total: total,
				percent: (percent > 100) ? 100 : parseInt(percent, 10)
			});
		}

		this.handleOpen = () => {
			this.setState({
				open: true
			});
			this.update();
		}

		this.handleClose = () => {
			this.setState({
				open: false,
			});
			this.update();
		}

		this.diyDeploy = () => {
			this.setState({
				deploying: true
			})
			this.props.diyDeploy({
				progressHook: this.progressHook,
				saveAfter: this.state.tempSaveAfter,
				mode: this.state.tempMode
			}).finally(() => {
				this.setState({
					deploying: false
				})
			})
		}

		this.setSaveAfter = (event, index, value) => {
			this.setState({
				tempSaveAfter: value
			})
		}

		this.setSaveMode = (e, value) => {
			this.setState({
				tempMode: value
			})
		}
	}

	render() {
		let {
			open,
			percent,
			deploying,
			total,
			tempSaveAfter,
			tempMode
		} = this.state;
		let {
			indexedNodeNames
		} = this.props;

		let actions = [
			!deploying ? 
			<FlatButton
				label={"Deploy"}
				style={{color: colors.primaryDeep}}
				onClick={this.diyDeploy}
			/>:
			<div style={{display:'flex', paddingLeft: 10, alignItems: 'center'}}>
              <div>
                <CircularProgress {...style.Actions.Wait} value={percent} mode="determinate"/>
              </div>
              <ListItem primaryText={`${percent}%`} disabled={true}/>
            </div>,
			<FlatButton
				label={"Cancel"}
				style={{color: colors.defaultFontColor}}
				onClick={this.handleClose}
			/>,
		];

		let SaveModeChoices = (
			<RadioButtonGroup
				style={{display: 'flex', flexGrow: 1}}
				valueSelected={tempMode}
				name="DIY_Save_Mode"
				onChange={this.setSaveMode}
			>
				<RadioButton 
					value={globals.DIY_Deploy_Mode.disk}
					label="Disk"
					iconStyle={{fill: colors.primary}}
					labelStyle={{fontWeight: 100}}
				/>
				<RadioButton 
					value={globals.DIY_Deploy_Mode.sqlite}
					label="SQLite 3"
					iconStyle={{fill: colors.primary}}
					labelStyle={{fontWeight: 100}}
				/>
			</RadioButtonGroup>
		)

		return(
			<div>
				<IconButton 
	              tooltip="DIY Deploy"
	              onClick={this.handleOpen}
	          	>
	              <DIYIcon {...style.Icon}/>
	          	</IconButton>
				<Dialog
					modal
					autoScrollBodyContent
					open={open}
					titleStyle={{...cssStyle.Dialog.Title}}
					bodyStyle={{...cssStyle.Dialog.Body}}
					title={renderDialogTitle(
						<Subheader>
							<div style={{display: 'flex', maxHeight: 48}}>
								<div style={{paddingTop: 8, paddingRight: 10, maxHeight: 48}}>
									<DIYTitleIcon color={colors.titleIconColor}/>
								</div>
								<div style={{fontSize: 20, maxHeight: 48}}>
			      					{"DIY Deployment"}
			      				</div>
		      				</div>
						</Subheader>, 
						this.handleClose, 
						null,
						null,
						false
					)}
					actions={actions}
					actionsContainerStyle={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row-reverse'
					}}
				>
					<Paper style={{minHeight: 188, maxHeight: 388, overflowY: 'auto', overflowX: 'hidden'}}>
						<div style={{display: 'flex', alignItems: 'center'}}>
							<MenuItem
								disabled
								primaryText={`Data Storage Method:`}
					    	/>
					    	{SaveModeChoices}
				    	</div>
						<div style={{display: 'flex'}}>
							<MenuItem
								disabled
								primaryText={`Save Data After:`}
					    	/>
					    	<SelectField
					          onChange={this.setSaveAfter}
					          id="Choose_Save_After"
					          {...style.SelectFieldStyle}
					          value={tempSaveAfter}
					        >
					          {
					          	indexedNodeNames.map((n, i) => (
					          		<MenuItem value={i} primaryText={n} key={n+"-"+i}/>)
					          	)
					          }
					        </SelectField>
				    	</div>
				    	{this.state.tempMode !== globals.DIY_Deploy_Mode.disk ?
				    		(
				    			<div style={{display: 'flex'}}>
									<MenuItem
										disabled
										primaryText={`Database Name:`}
							    	/>
							    </div>
							) :
							null
				    	}
				    	{this.state.tempMode !== globals.DIY_Deploy_Mode.disk ?
				    		(
				    			<div style={{display: 'flex'}}>
									<MenuItem
										disabled
										primaryText={`Table Name:`}
							    	/>
							    </div>
							) :
							null
				    	}
					</Paper>
				</Dialog>
			</div>
		);
	}
}