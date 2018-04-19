import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import { Card, CardHeader, CardText} from 'material-ui/Card';

import { renderDialogTitle } from '../../gadgets';
import AppbarTheme from '../theme.js';

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
		}

		this.update = () => {
			this.setState({
			})
		}


		this.handleOpenHepler = () => {
			this.setState({
				open: true,
			})
		}

		this.handleOpen = () => {

		}

		this.handleClose = () => {
			this.setState({
				open: false,
			});
		}

		this.handleCancel = () => {
			this.handleClose();
			this.update();
		}
	}

	render() {
		let {

		} = this.state;
		let {

		} = this.props;

		let actions = [
			!deleting ? 
			<FlatButton
				label={"Cancel"}
				style={{color: colors.defaultFontColor}}
				onClick={this.handleCancel}
			/>:
			<CircularProgress {...style.Actions.Wait}/>,
			!deploying ? 
			<FlatButton
				label={isOnline ? "Update" : "Deploy"}
				style={{color: notReady ? colors.offlineColor : colors.primaryDeep}}
				disabled={notReady}
				title={notReady ? "The experiment is not ready for deployment." : ""}
				onClick={this.cloudDeploy}
			/>:
			<CircularProgress {...style.Actions.Wait}/>,
		];


		let Setting_Card = (
			<Card initiallyExpanded>
			    <CardHeader
			      title="Settings"
			      actAsExpander={true}
			      avatar={
			      	notReady ? 
			      	<AlertIcon color={colors.errorColor}/> :
			      	<SettingIcon color={colors.settingIconColor}/>
			      }
			      showExpandableButton={true}
			    />
			    <CardText expandable={true} style={{paddingTop: 0}}>
			    	<div style={{display: 'flex'}}>
						<MenuItem
							style={{width: 170}}
							disabled
							primaryText={`Current OSF Token:`}
				    	/>
				    	<SelectField
							id="Choose_OSF_Token"
							{...style.SelectFieldStyle}
							style={{paddingLeft: 16, minWidth: 350}}
							labelStyle={{
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
							}}
							onChange={this.updateOsfAccess}
							title={tempChosenOsfAccess ? utils.toEmptyString(tempChosenOsfAccess.token) : ''}
							value={tempChosenOsfAccess}
							errorText={osfTokenError ? 'A token is required' : ''}
				    	>
					    	{
					    		osfAccess.map((item, i) => {
					    			if (deepEqual(item, tempChosenOsfAccess)) {
					    				item = tempChosenOsfAccess;
					    			}
					    			return (
					    				<MenuItem
					    					key={`Registered-Osf-Access-${i}`}
					    					primaryText={utils.toEmptyString(item.alias)}
					    					title={utils.toEmptyString(item.token)}
					    					value={item}
					    				/>
					    			)
					    		})
					    	}
				    	</SelectField>
			    	</div>
					<div style={{display: 'flex'}}>
						<MenuItem
							disabled
							primaryText={`OSF Project Id:`}
				    	/>
						<div style={{display: 'flex', alignItems: 'center'}}>
							<TextField
							  {...style.TextFieldFocusStyle(osfNodeError)}
							  style={{width: 300}}
					          onChange={this.updateOsfNode}
					          id="Choose_OSF_Node"
					          value={utils.toEmptyString(tempOsfNode)}
					          errorText={osfNodeError ? 'A project id is required.' : ''}
					        />
							{!creating ?
								<RaisedButton
									backgroundColor={colors.primary}
									labelColor={colors.white}
									style={{marginLeft: '10px'}}
									labelStyle={{textTransform: "none",}}
									label={"Create One For Me!"}
									title={"Create One For Me!"}
									onClick={this.createProject}
								/> :
								<CircularProgress {...style.Actions.Wait} />
							}
						</div>
					</div>
					<div style={{display: 'flex'}}>
						<MenuItem
							disabled
							primaryText={`Save Data After:`}
				    	/>
				    	<SelectField
				          onChange={this.updateSaveAfter}
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
			    </CardText>
			</Card>
		)

		return(
			<div>
				<IconButton 
	              tooltip="Cloud Deploy"
	              onClick={this.handleOpen}
	          	>
	              <CloudIcon {...style.Icon}/>
	          	</IconButton>
				<Dialog
					modal
					autoScrollBodyContent
					open={this.state.open}
					titleStyle={{...cssStyle.Dialog.Title}}
					bodyStyle={{...cssStyle.Dialog.Body}}
					title={renderDialogTitle(
						<Subheader>
							<div style={{display: 'flex', maxHeight: 48}}>
								<div style={{paddingTop: 8, paddingRight: 10, maxHeight: 48}}>
									<CloudTitleIcon color={colors.titleIconColor}/>
								</div>
								<div style={{fontSize: 20, maxHeight: 48}}>
			      					{"Cloud Deployment"}
			      				</div>
		      				</div>
						</Subheader>, 
						this.handleClose, 
						null
					)}
					actions={actions}
				>
					<Paper style={{minHeight: 388, maxHeight: 388, overflowY: 'auto', overflowX: 'hidden'}}>

					</Paper>
				</Dialog>
			</div>
		);
	}
}