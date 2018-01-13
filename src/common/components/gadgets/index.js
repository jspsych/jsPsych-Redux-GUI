/*
Repeatedly used components

*/


import React from 'react';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {
	grey50 as dialogTitleColor,
	grey300 as CloseBackHighlightColor,
	grey50 as CloseDrawerHoverColor
} from 'material-ui/styles/colors';

export const renderDialogTitle = (messageNode=null, handleClose=()=>{}, titleColor=dialogTitleColor, style={}) => (
	<div style={{display: 'flex', backgroundColor: titleColor, ...style}}>
			{messageNode}
		<IconButton 
				hoveredStyle={{
					backgroundColor: CloseBackHighlightColor,
				}}
				onTouchTap={handleClose}
			disableTouchRipple={true}
		>
		<Close hoverColor={CloseDrawerHoverColor} />
		</IconButton>
	</div>
)