/*
Repeatedly used components

*/


import React from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
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
