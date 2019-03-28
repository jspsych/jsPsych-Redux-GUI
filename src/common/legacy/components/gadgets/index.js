/*
Repeatedly used components

*/


import React from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Close from 'material-ui/svg-icons/navigation/close';
import {
	grey50 as dialogTitleColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

const colors = {
	...theme.colors,
	dividerColor: 'rgb(224, 224, 224)',
	dialogTitleColor: '#FAFAFA',
	closeBackHighlightColor: '#E0E0E0',
	closeDrawerHoverColor: '#FAFAFA',
};

const style = {
}

export const DialogTitle = ({
	node = null,
	closeCallback = () => {},
	titleColor = colors.dialogTitleColor,
	style = {},
	showCloseButton = true,
	...props
}) => {
	return (
		<div style={utils.prefixer({display: 'flex', backgroundColor: titleColor, ...style})}>
			{ node }
			{ showCloseButton ? 
				<IconButton 
					hoveredStyle={{
						backgroundColor: colors.closeBackHighlightColor,
					}}
					onClick={closeCallback}
					disableTouchRipple={true}
				>
					<Close hoverColor={colors.closeDrawerHoverColor} />
				</IconButton> :
				null
			}
		</div>
	)
}

export const renderDialogTitle = (messageNode = null, 
	handleClose = () => {}, 
	titleColor = colors.dialogTitleColor, 
	style = {},
	showCloseButton = true
) => (
	<div style={{display: 'flex', backgroundColor: titleColor, ...style}}>
		{messageNode}
		{ showCloseButton ? 
			<IconButton 
				hoveredStyle={{
					backgroundColor: colors.closeBackHighlightColor,
				}}
				onClick={handleClose}
				disableTouchRipple={true}
			>
				<Close hoverColor={colors.closeDrawerHoverColor} />
			</IconButton> :
			null
		}
		
	</div>
)


export const Text = ({text, style={}, ...props}) => (
	<div
		style={utils.prefixer({
			paddingLeft: 16,
			color: colors.defaultFontColor,
			textOverflow: 'ellipsis',
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			fontSize: '16px',
			display: 'block',
			...style
		})}
		title={utils.toEmptyString(text)}
		{...props}
	>
	 {text}
	</div>
)

export class EditorTextField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value
		};

		this.onChange = (e, v) => {
			this.setState({
				value: v
			});
		};

		this.onCommit = () => {
			this.props.onCommit(this.state.value);
		};
	}

	static defaultProps = {
		value: "",
		onCommit: v => {},
		styles: {}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			...nextProps
		};
	}

	render() {
		const { value } = this.state;
		const { onCommit, value : propValue, ...textFieldProps } = this.props;

		return (
			<TextField
				{...textFieldProps}
				value={value}
				onChange={this.onChange}
				onBlur={this.onCommit}
				onKeyPress={e => {
					if (e.which === 13) {
						document.activeElement.blur();
					}
				}}
				id={`textfield-${utils.getUUID()}`}
			/>
		);
	}
}