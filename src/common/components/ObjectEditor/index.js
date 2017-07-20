import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ObjectEditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import Clear from 'material-ui/svg-icons/content/clear';
import {
  cyan500 as hoverColor,
  grey50 as listBackgroundColor,
  red500 as clearColor,
} from 'material-ui/styles/colors';

import { deepCopy } from '../../utils';
import { renderDialogTitle } from '../gadgets';

const ObjectKeyErrorCode = {
	Good: 0,
	ContainsDuplicate: 1,
}

const ObjectKeyErrorMessage = (code) => {
	switch(code) {
		case ObjectKeyErrorCode.Good:
			return "";
		case ObjectKeyErrorCode.ContainsDuplicate:
		default:
			return "Key name should be unique.";
	}
}

const convertReserved = (s) => {
	let floatRegex = /^-?\d+\.?\d*$/;
	let intRegex = /^-?\d+$/;
	switch(s) {
		case "true":
			return true;
		case "false":
			return false;
		case "null":
			return null;
		case "undefined":
			return undefined;
		default:
			if (intRegex.test(s)) {
				console.log(s);
				return parseInt(s);
			} else if (floatRegex.test(s)) {
				console.log(s);
				return parseFloat(s);
			} else {
				return s;
			}
	}
}

class ObjectKey extends React.Component {
	defaultProps = {
		oldKey: "",
		setObjectKey: () => {},
		errorCode: ObjectKeyErrorCode.Good,
	}

	state = {
		edit: false,
	}

	enterEditMode = () => {
		this.setState({
			edit: true
		});
	}

	exitEditMode = () => {
		if (this.props.errorCode !== ObjectKeyErrorCode.Good) return;
		this.setState({
			edit: false
		});
	}

	render() {
		let { oldKey, errorCode } = this.props;
		return (
			(this.state.edit) ? 
				<TextField  id={oldKey}
							value={oldKey}
							onBlur={this.exitEditMode}
							errorText={ObjectKeyErrorMessage(errorCode)}
							onKeyPress={(e) => {
								if (e.which === 13) {
									document.activeElement.blur();
								} 
							}}
							onChange={(e, v) => { this.props.setObjectKey(v); }}
							/>:
				<MenuItem onTouchTap={this.enterEditMode} primaryText={`"${oldKey}"`}/>
			)
	}
}

class ObjectValue extends React.Component {
	defaultProps = {
		value: "",
		setObjectValue: () => {},
		keyName: "",
		index: 0,
	}

	state = {
		edit: false,
	}

	enterEditMode = () => {
		this.setState({
			edit: true
		});
	}

	exitEditMode = () => {
		this.setState({
			edit: false
		});
	}

	render() {
		let { keyName, value, index } = this.props;

		return (
			(this.state.edit) ? 
				<TextField  id={`${keyName}-${value}-${index}`}
							value={value}
							onBlur={this.exitEditMode}
							onKeyPress={(e) => {
								if (e.which === 13) {
									document.activeElement.blur();
								} 
							}}
							onChange={(e, v) => { this.props.setObjectValue(v); }}
							/>:
				<MenuItem onTouchTap={this.enterEditMode} primaryText={value} style={{minWidth: 200}}/>
			)
	}
}

export default class ObjectEditor extends React.Component {
	defaultProps = {
		targetObj: {},
		title: "",
		keyName: "",
	}

	state = {
		open: false,
		objectKeys: [],
		objectValues: [],
		objectKeyErrors: [],
		valid: true,
	}

	componentDidMount() {
		let objectKeys = Object.keys(this.props.targetObj);
		let objectValues = objectKeys.map((key) => (this.props.targetObj[key]));
		this.setState({
			objectKeys: objectKeys,
			objectValues: objectValues,
			objectKeyErrors: objectKeys.map(k => ObjectKeyErrorCode.Good),
		})
	}

	handleOpen = () => {
		this.setState({
			open: true
		});
	}

	handleClose = () => {
		this.setState({
			open: false
		});
	}

	/*
	param:
	oldKey, old key value
	newKey, new key value,
	i, position of key to be modified
	*/
	setObjectKey = (oldKey, newKey, i) => {
		let newObjectKeys = this.state.objectKeys.slice();
		let newObjectKeyErrors = this.state.objectKeyErrors.slice();
		newObjectKeys[i] = newKey;

		// check for duplicate
		let hist = {};
		for (let i = 0; i < newObjectKeys.length; i++) {
			let key = newObjectKeys[i];
			if (!hist[key]) {
				hist[key] = [i];
			} else {
				hist[key].push(i);
			}
		}
		let valid = true;
		// set error message
		for (let v of Object.values(hist)) {
			// if duplicate happens
			if (v.length > 1) {
				for (let i of v) {
					newObjectKeyErrors[i] = ObjectKeyErrorCode.ContainsDuplicate;
				}
				valid = false;
				// else this key is good
			} else {
				newObjectKeyErrors[v[0]] = ObjectKeyErrorCode.Good;
			}
		}

		this.setState({
			objectKeys: newObjectKeys,
			objectKeyErrors: newObjectKeyErrors,
			valid: valid
		});
	}

	setObjectValue = (value, i) => {
		let newObjectValues = this.state.objectValues.slice();
		newObjectValues[i] = value;
		this.setState({
			objectValues: newObjectValues
		})
	}

	deleteKeyPair = (i) => {
		let newObjectKeys = this.state.objectKeys.slice();
		let newObjectValues = this.state.objectValues.slice();
		let newObjectKeyErrors = this.state.objectKeyErrors.slice();
		newObjectKeys.splice(i, 1);
		newObjectValues.splice(i, 1);
		newObjectKeyErrors.splice(i, 1);

		// update if object now is valid
		let valid = true;
		for (let e of newObjectKeyErrors) {
			if (e !== ObjectKeyErrorCode.Good) {
				valid = false;
				break;
			}
		}
		this.setState({
			objectKeys: newObjectKeys,
			objectValues: newObjectValues,
			objectKeyErrors: newObjectKeyErrors,
			valid: valid
		});
	}

	addKeyPair = () => {
		// generate unique default key name
		let hist = {};
		for (let key of this.state.objectKeys) hist[key] = true; 
		let i = 0, key = `key${i++}`;
		while (hist[key]) key = `key${i++}`;

		let newObjectKeys = this.state.objectKeys.slice();
		let newObjectValues = this.state.objectValues.slice();
		let newObjectKeyErrors = this.state.objectKeyErrors.slice();
		newObjectKeys.push(key);
		newObjectValues.push("");
		newObjectKeyErrors.push(ObjectKeyErrorCode.Good);
		this.setState({
			objectKeys: newObjectKeys,
			objectValues: newObjectValues,
			objectKeyErrors: newObjectKeyErrors,
		});
	}

	renderRow = (key, value, i) => {
		return (
			<div style={{display: 'flex', paddingTop: (i === 0) ? 0 : 5}} key={`object-container-${i}`}>
				<ObjectKey 
					oldKey={key}
					key={`object-key-${i}`}
					errorCode={this.state.objectKeyErrors[i]}
					setObjectKey={(newKey) => {
						this.setObjectKey(key, newKey, i);
					}}
				/>
				<MenuItem key={`object-sep-${i}`} primaryText=":" disabled={true} />
				<ObjectValue
					value={value}
					keyName={key}
					index={i}
					key={`object-value-${i}`}
					setObjectValue={(newValue) => {
						this.setObjectValue(newValue, i);
					}}
				/>
				<div style={{right: 0}} key={`object-delete-container-${i}`}>
					<IconButton
						tooltip="delete key"
						key={`object-delete-${i}`}
						onTouchTap={()=>{ this.deleteKeyPair(i); }}
					>
						<Clear key={`object-delete-icon-${i}`} color={clearColor} />
					</IconButton>
				</div>
			</div>
		)
	}

	render() {
		let { title, keyName } = this.props;
		let { handleOpen, handleClose, renderRow, addKeyPair } = this;
		let { objectValues, objectKeys, open } = this.state;

		return (
			<div>
				<MenuItem onTouchTap={this.handleOpen} primaryText="[Object]"/>
				<Dialog
					open={open}
					titleStyle={{padding: 0}}
					title={renderDialogTitle(
						<Subheader style={{fontSize: 18}}>Object Editor</Subheader>,
						this.handleClose,
						null
						)}
					modal={true}

				>
				<p style={{padding: 0}}>{`${keyName} = {`}</p>
				<div>
					<List style={{maxHeight: 300, minHeight: 200, overflow: 'auto', width: "80%", margin: 'auto'}}>
						{objectKeys.map((key, i) => (renderRow(key, objectValues[i], i)))}
					</List>
				</div>
				<p>}</p>
				<div style={{paddingTop: 15}}>
				<FloatingActionButton 
					mini={true} 
					onTouchTap={addKeyPair}
				>
      				<ContentAdd />
    			</FloatingActionButton>
    			</div>
				</Dialog>
			</div>
		)
	}
}