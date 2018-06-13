import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardHeader, CardText} from 'material-ui/Card';

import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ConfirmIcon from 'material-ui/svg-icons/navigation/check';
import CancelIcon from 'material-ui/svg-icons/navigation/close';
import OsfAccessIcon from 'material-ui/svg-icons/communication/vpn-key'
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';

import { renderDialogTitle, Text } from '../../../gadgets';
import AppbarTheme from '../../theme.js';

const colors = {
  ...AppbarTheme.colors,
  checkGreen: '#4CAF50',
  cancelRed: '#F44336',
  defaultFontColor: '#424242',
  titleColor: '#3F51B5',
  osfAccessColor: '#03A9F4',
  deleteColor: '#F44336',
  white: '#FEFEFE',
  viewDetails: '#3F51B5'
}

const style = {
	TextFieldFocusStyle: AppbarTheme.TextFieldFocusStyle,
	Actions: {
		Wait: {
			size: 30,
			color: colors.primaryDeep
		}
	},
}

class OSFValue extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
		}

		this.enterEditMode = () => {
			this.setState({
				edit: true,
				value: this.props.value
			});
		}

		this.exitEditMode = () => {
			this.setState({
				edit: false
			});
			this.onCommit();
		}

		this.updateValue = (v) => {
			this.setState({
				value: v
			})
		}

		this.onCommit = () => {
			this.props.onUpdate(this.state.value);
		}
	}

	static defaultProps = {
		value: {},
		onUpdate: () => {},
		index: 0
	}

	render() {
		let { value, index } = this.props;
		let displayValue = !value ? '""' : value;
		return (
			(this.state.edit) ? 
			<TextField  id={`OSF-Access-${value}-${index}`}
						value={this.state.value}
						onBlur={this.exitEditMode}
						onKeyPress={(e) => {
							if (e.which === 13) {
								document.activeElement.blur();
							} 
						}}
						onChange={(e, v) => { this.updateValue(v); }}
						inputStyle={{color: colors.primary, textOverflow: 'ellipsis'}}
						hintText="Please refer to your OSF Account."
						style={{minWidth: 200, maxWidth: 200}}
						underlineFocusStyle={{borderColor: colors.secondary}}
						/>:
			<MenuItem 
				onClick={this.enterEditMode}
				primaryText={
					<p 
						className='truncate-long-string'
						title={value}
					>
					{displayValue}
					</p>
				}
				style={{minWidth: 200, maxWidth: 200, color: colors.primary, textAlign: 'center'}}
			/>
		)
	}
}

class OSFAccessItem extends React.Component {
	constructor(props) {
		super(props);

		this.handleOpen = () => {
			this.props.setVisibility(true);
		}

		this.handleClose = () => {
			this.props.setVisibility(false);
		}
	}

	static defaultProps = {
		setVisibility: (v) => {},
		updateToken: (v) => {},
		updateUserId: (v) => {},
		updateAlias: (v) => {},
		open: false,
		alias: '',
		token: '',
		userId: '',
	}

	render() {
		return (
			<div>
				<MenuItem
					primaryText={this.props.open ? "Hide Details" : "View Details"}
					onClick={this.props.open ? this.handleClose : this.handleOpen}
					style={{color: this.props.open ? colors.secondaryDeep : colors.viewDetails, maxWidth: 130}}
				/>
				{
					this.props.open ?
					<div>
						<div style={{display: 'flex', alignItems: 'baseline'}}>
							<Text
								text={"Alias"}
								style={{width: '100px'}}
							/>
							<Text
								text={":"}
								style={{marginRight: '10px', marginLeft: '10px'}}
							/>
							<OSFValue 
								value={this.props.alias} 
								onUpdate={this.props.updateAlias} 
							/>
						</div>
						<div style={{display: 'flex', alignItems: 'baseline'}}>
							<Text
								text={"User Id"}
								style={{width: '100px'}}
							/>
							<Text
								text={":"}
								style={{marginRight: '10px', marginLeft: '10px'}}
							/>
							<OSFValue 
								value={this.props.userId} 
								onUpdate={this.props.updateUserId} 
							/>
						</div>
						<div style={{display: 'flex', alignItems: 'baseline'}}>
							<Text
								text={"Token"}
								style={{width: '100px'}}
							/>
							<Text
								text={":"}
								style={{marginRight: '10px', marginLeft: '10px'}}
							/>
							<OSFValue 
								value={this.props.token} 
								onUpdate={this.props.updateToken} 
							/>
						</div>
					</div>:
					null
				}
			</div>
		)
	}
}


export default class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			osfAccess: this.props.osfAccess,
			open: false,
			updating: false
		}

		this.update = () => {
			this.setState({
				osfAccess: this.getOsfAccessFromRedux(),
			})
		}

		this.commit = () => {
			if (utils.deepEqual(this.getOsfAccessFromReact(), this.props.osfAccess)) {
				this.props.notifyWarningBySnackbar("Nothing has changed !");
			} else {
				this.setState({
					updating: true
				});
				this.props.setOsfAccess(this.getOsfAccessFromReact()).then(() => {
					this.setState({
						updating: false
					});
				});
			}
		}

		this.handleCancel = () => {
			this.setState({
				open: false
			});
			this.update();
		}

		this.handleOpen = () => {
			this.setState({
				open: true,
			});
			this.update();
		}

		this.getOsfAccessFromRedux = () => {
			let osfAccess = utils.deepCopy(this.props.osfAccess);
			for (let item of osfAccess) {
				for (let key of Object.keys(item)) {
					item[key] = utils.toEmptyString(item[key]);
				}
			}
			return osfAccess;
		}

		this.getOsfAccessFromReact = () => {
			let osfAccess = utils.deepCopy(this.state.osfAccess);
			for (let item of osfAccess) {
				delete item['$open']
				for (let key of Object.keys(item)) {
					item[key] = utils.toNull(item[key].trim());
				}
			}
			return osfAccess;
		}

		this.setOsfAccess = (osfAccess) => {
			this.setState({
				osfAccess: osfAccess
			})
		}

		this.deleteOsfAccess = (index) => {
			let clone = this.state.osfAccess.slice();
			clone.splice(index, 1);
			this.setOsfAccess(clone);
		}

		this.addOsfAccess = () => {
			let clone = this.state.osfAccess.slice(),
				newToken = core.createUserOsfAccessItem(),
				i = 0,
				getName = () => `Untitled Token ${i++}`,
			    name = getName(), 
			    needNewName = true;
			while (needNewName) {
				needNewName = false;
				for (let item of clone) {
					needNewName |= item.alias === name;
					if (needNewName) {
						name = getName();
						break;
					}
				}
			}
			newToken.alias = name;
			for (let key of Object.keys(newToken)) {
				newToken[key] = utils.toEmptyString(newToken[key]);
			}
			newToken['$open'] = false;
			clone.push(newToken);
			this.setOsfAccess(clone);
		}

		this.editOsfTokenAt = (index, value) => {
			let clone = this.state.osfAccess.slice();
			clone[index].token = value;
			this.setOsfAccess(clone);
		}

		this.editOsfUserIdAt = (index, value) => {
			let clone = this.state.osfAccess.slice();
			clone[index].userId = value;
			this.setOsfAccess(clone);
		}
		
		this.editOsfAliasAt = (index, value) => {
			let clone = this.state.osfAccess.slice();
			clone[index].alias = value;
			this.setOsfAccess(clone);
		}

		this.setOsfItemVisibilityAt = (index, value) => {
			let clone = this.state.osfAccess.slice();
			clone[index]['$open'] = value;
			this.setOsfAccess(clone);
		}

		this.renderOsfAccessItem = () => {
			let OSFAccessRow = ({item, index, ...props}) => {
				return (
					<div style={{display: 'flex'}}>
						<MenuItem
							primaryText={item.alias}
							style={{
								color: colors.defaultFontColor,
								width: 130,
								textAlign: 'center'
							}}
							disabled
						/>
						<MenuItem
							primaryText=":"
							style={{
								color: colors.defaultFontColor,
							}}
							disabled
						/>
						<OSFAccessItem
							alias={item.alias}
							token={item.token} 
							userId={item.userId}
							open={item['$open']}
							updateToken={(v) => {
								this.editOsfTokenAt(index, v);
							}} 
							updateUserId={(v) => {
								this.editOsfUserIdAt(index, v);
							}}
							updateAlias={(v) => {
								this.editOsfAliasAt(index, v);
							}}
							setVisibility={(v) => {
								this.setOsfItemVisibilityAt(index, v);
							}}
						/>
						<div style={{right: 0}}>
							<IconButton onClick={()=>{ this.deleteOsfAccess(index); }} >
								<DeleteIcon color={colors.deleteColor} />
							</IconButton>
						</div>
					</div>
				)
			}
			return (
				this.state.osfAccess.map((item, index) => (
					<OSFAccessRow
						key={`OSF-Access-${index}`}
						item={item}
						index={index}
					/>
				))
			)
		}	
	}

	componentDidMount() {
	  this.props.onRef(this);
	}
	
	componentWillUnmount() {
	  this.props.onRef(undefined);
	}

	render() {
		let osfTokenString = this.props.osfToken ? this.props.osfToken : '';
		let actions = [
			<FlatButton
				label="Cancel"
				style={{marginRight: '5px'}}
				onClick={this.handleCancel}
			/>,
			(
				this.state.updating ?
				<CircularProgress {...style.Actions.Wait}/> :
				<RaisedButton
					backgroundColor={colors.primaryDeep}
					labelColor={colors.white}
					label="Update"
					onClick={this.commit}
				/>
			)
		]

		return (
		<div>
			<Dialog
				open={this.state.open}
				titleStyle={{padding: 0,}}
				title={
					renderDialogTitle(
						<Subheader style={{fontSize: 20, color: colors.titleColor}}>
							User Profile
						</Subheader>,
						null,
						null,
						{},
						false
					)
				}
				actions={actions}
				modal
			>
				<Paper style={{minHeight: 400, maxHeight: 400, overflowY: 'auto'}}>
					<div style={{display: 'flex',}}>
						<MenuItem
							style={{width: 170}}
							disabled
							primaryText={`Username:`}
				    	/>
						<MenuItem
							disabled
							style={{color: colors.defaultFontColor }}
							primaryText={utils.toEmptyString(this.props.username)}
				    	/>
			    	</div>
					<Divider />
					<Card>
					    <CardHeader
					      title="OSF Access"
					      actAsExpander={true}
					      avatar={
					      	<OsfAccessIcon color={colors.osfAccessColor}/>
					      }
					      showExpandableButton={true}
					    />
					    <CardText expandable={true} style={{paddingTop: 0}}>
					    	{this.renderOsfAccessItem()}
					    	<div style={{display: 'flex', width: '100%', flexDirection: 'row-reverse'}}>
					    		<RaisedButton
									backgroundColor={colors.primary}
									labelColor={colors.white} 
									label="Add" 
									onClick={this.addOsfAccess}
								/>
					    	</div>
					    </CardText>
					</Card>	
					<Divider />
				</Paper>
			</Dialog>
		</div>
		)
	}
}