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

import GeneralTheme from '../theme.js';

const colors = {
	...GeneralTheme.colors,
	dividerColor: 'rgb(224, 224, 224)'
};

const style = {
}

export const renderDialogTitle = (messageNode = null, 
	handleClose = () => {}, 
	titleColor = dialogTitleColor, 
	style = {},
	showCloseButton = true
) => (
	<div style={{display: 'flex', backgroundColor: titleColor, ...style}}>
		{messageNode}
		{ showCloseButton ? 
			<IconButton 
				hoveredStyle={{
					backgroundColor: CloseBackHighlightColor,
				}}
				onClick={handleClose}
				disableTouchRipple={true}
			>
				<Close hoverColor={CloseDrawerHoverColor} />
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